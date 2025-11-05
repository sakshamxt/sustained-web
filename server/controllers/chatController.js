// In server/controllers/chatController.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini model using the API key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Handles generating a chat response from the Gemini API.
 */
export const generateChatResponse = async (req, res) => {
  try {
    // Get the user's message and the course they are currently on from the request
    const { message, courseContext } = req.body;
    
    // req.user is populated by your authentication middleware (e.g., from the JWT)
    const user = req.user; 

    // We create a detailed prompt that tells the AI its role, rules, and the user's context.
    const prompt = `
      You are the SustainED AI Tutor, a friendly and encouraging assistant for the SustainED web platform. Your primary goal is to help users understand the UN's Sustainable Development Goals (SDGs).

      CURRENT USER'S CONTEXT:
      - This user's name is ${user.name}.
      - They have a learning streak of ${user.streak || 0} days.
      - They are currently studying: "${courseContext || 'the SDGs in general'}".

      YOUR RULES:
      1. **Keep your answers short and concise.** Aim for under 40 words.
      2. **Use simple, easy-to-understand language.** Avoid academic jargon.
      3. **Be positive and motivating.** Acknowledge their streak if it's high!
      4. **Provide recommended questions.** After your main answer, you MUST provide 3 relevant follow-up questions. Format them as a JSON array string at the very end of your response, like this: ###RECOMMENDED###["Question 1?", "Question 2?", "Question 3?"]

      Now, please answer the user's question based on all the above: "${message}"
    `;

    // Send the prompt to the Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // We split the AI's text to separate the main message from our recommended questions.
    const parts = text.split('###RECOMMENDED###');
    const mainResponse = parts[0].trim();
    let recommendedQuestions = [];

    // Safely parse the recommended questions JSON
    if (parts.length > 1) {
      try {
        recommendedQuestions = JSON.parse(parts[1].trim());
      } catch (e) {
        // If the AI messes up the JSON, provide a fallback.
        console.error("Failed to parse recommended questions:", e);
        recommendedQuestions = ["Summarize this.", "What is the main goal?", "Why is this important?"];
      }
    }

    // Send the final, clean response to the frontend
    res.status(200).json({ 
      message: mainResponse,
      recommendedQuestions: recommendedQuestions
    });

  } catch (error) {
    console.error("Error in chat controller:", error);
    res.status(500).json({ message: "Sorry, something went wrong on my end." });
  }
};