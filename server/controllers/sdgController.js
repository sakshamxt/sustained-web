// server/controllers/sdgController.js
import SDG from '../models/SDG.js';
import User from '../models/User.js'; // Needed for enrollment later
import mongoose from 'mongoose';

/**
 * @desc    Fetch all SDGs
 * @route   GET /api/sdgs
 * @access  Public
 */
const getAllSDGs = async (req, res) => {
  try {
    const sdgs = await SDG.find({}).sort({ sdgNumber: 1 }); // Sort by SDG number
    res.json(sdgs);
  } catch (error) {
    console.error('Error fetching all SDGs:', error);
    res.status(500).json({ message: 'Server error. Could not fetch SDGs.' });
  }
};

/**
 * @desc    Fetch a single SDG by its ID or SDG number
 * @route   GET /api/sdgs/:idOrNumber
 * @access  Public
 */
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


export { getAllSDGs, getSDGByIdOrNumber };