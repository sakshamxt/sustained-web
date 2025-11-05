# SustainED - System Architecture

This diagram illustrates the complete architecture for the SustainED platform, from the user's browser to the backend services and external APIs.

```mermaid
graph TD

subgraph user [User]
  Client[Client - React Web App]
end

subgraph backend [SustainED Backend Infrastructure]
  Server[Backend Server - Node & Express]
  DB[(MongoDB Atlas)]

  subgraph ext [External Cloud Services]
    Cloudinary[Cloudinary - Image Storage]
    Gemini[Google Gemini API - AI Chatbot]
  end
end

Client -->|1 API Requests HTTPS JSON| Server
Server -->|2 Read Write Data| DB
Server -->|3 Image Uploads via Multer| Cloudinary
Server -->|4 AI Prompts Context Aware| Gemini
Gemini -->|5 AI Responses| Server
Cloudinary -->|6 Image URLs| Server
DB -->|7 Data| Server
Server -->|8 Final JSON Response| Client

style Client fill:#D6E8FF,stroke:#333
style Server fill:#D4F8D4,stroke:#333
style DB fill:#FFF2C2,stroke:#333
style Cloudinary fill:#FFD6C9,stroke:#333
style Gemini fill:#FFD6C9,stroke:#333
