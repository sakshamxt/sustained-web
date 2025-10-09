// server/controllers/sdgController.js - FINAL FIX

import SDG from '../models/SDG.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


// @desc    Fetch all SDGs
// @route   GET /api/sdgs
// @access  Public
const getAllSDGs = async (req, res) => {
  try {
    const sdgs = await SDG.find({}).sort({ sdgNumber: 1 });
    res.json({ sdgs });
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
    const { idOrNumber } = req.params;
    let query;

    // --- REWRITTEN LOGIC ---
    // First, we decide what kind of identifier we have.
    if (mongoose.Types.ObjectId.isValid(idOrNumber)) {
      // It's a valid ID format, so we will query by ID.
      query = SDG.findById(idOrNumber);
    } else {
      // It's not a valid ID format, so let's see if it's a number.
      const number = parseInt(idOrNumber, 10);
      if (!isNaN(number)) {
        // It's a number, so we will query by sdgNumber.
        query = SDG.findOne({ sdgNumber: number });
      } else {
        // It's neither a valid ID nor a number. We can immediately say it's not found.
        return res.status(404).json({ message: 'SDG not found: Invalid identifier format.' });
      }
    }

    // Now, we execute the query we prepared.
    const sdg = await query;

    // Finally, we check the result and send the appropriate response.
    if (sdg) {
      res.json({ sdg });
    } else {
      res.status(404).json({ message: 'SDG not found with the given identifier.' });
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
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
      return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }

    const sdg = await SDG.findById(sdgId);
    if (!sdg) {
      return res.status(404).json({ message: 'SDG course not found.' });
    }

    const user = req.user; 
    const isEnrolled = user.enrolledCourses.some(courseId => courseId.equals(sdg._id));

    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this SDG course.' });
    }

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