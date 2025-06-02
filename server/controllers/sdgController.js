// server/controllers/sdgController.js
import SDG from '../models/SDG.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


// @desc    Fetch all SDGs
// @route   GET /api/sdgs
// @access  Public
const getAllSDGs = async (req, res) => {
  try {
    const sdgs = await SDG.find({}).sort({ sdgNumber: 1 }); // Sort by SDG number
    res.json(sdgs);
  } catch (error) {
    console.error('Error fetching all SDGs:', error);
    res.status(500).json({ message: 'Server error. Could not fetch SDGs.' });
  }
};


// @desc    Fetch a single SDG by its ID or SDG number
// @route   GET /api/sdgs/:idOrNumber
// @access  Public
const getSDGByIdOrNumber = async (req, res) => {
  try {
    const idOrNumber = req.params.idOrNumber;
    let sdg;

    // Check if idOrNumber is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
      sdg = await SDG.findById(idOrNumber);
    }
    
    // If not found by ID or if idOrNumber is not an ObjectId, try finding by sdgNumber
    if (!sdg) {
      const number = parseInt(idOrNumber, 10);
      if (!isNaN(number) && number >= 1 && number <= 17) {
        sdg = await SDG.findOne({ sdgNumber: number });
      }
    }

    if (sdg) {
      res.json(sdg);
    } else {
      res.status(404).json({ message: 'SDG not found.' });
    }
  } catch (error) {
    console.error('Error fetching SDG by ID/Number:', error);
    res.status(500).json({ message: 'Server error. Could not fetch SDG details.' });
  }
};



// @desc    Enroll a user in an SDG course
// @route   POST /api/sdgs/:sdgId/enroll
// @access  Private
const enrollInSDG = async (req, res) => {
  try {
    const { sdgId } = req.params;
    const userId = req.user._id; // From protect middleware

    // Validate SDG ID
    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
      return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }

    // Check if SDG exists
    const sdg = await SDG.findById(sdgId);
    if (!sdg) {
      return res.status(404).json({ message: 'SDG course not found.' });
    }

    // Get the user document (req.user from 'protect' middleware is a mongoose doc)
    const user = req.user; 

    // Check if already enrolled
    // user.enrolledCourses is an array of ObjectIds
    const isEnrolled = user.enrolledCourses.some(courseId => courseId.equals(sdg._id));

    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this SDG course.' });
    }

    // Enroll user
    user.enrolledCourses.push(sdg._id);
    await user.save();

    res.status(200).json({
      message: `Successfully enrolled in ${sdg.title}.`,
      enrolledCourses: user.enrolledCourses,
    });

  } catch (error) {
    console.error('Error enrolling in SDG:', error);
    res.status(500).json({ message: 'Server error during enrollment.' });
  }
};



export { getAllSDGs, getSDGByIdOrNumber, enrollInSDG };