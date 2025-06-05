import RedemptionOption from '../models/RedemptionOption.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// @desc    Get all active redemption options
// @route   GET /api/redemption/options
// @access  Public
const getRedemptionOptions = async (req, res) => {
  try {
    const options = await RedemptionOption.find({ isActive: true })
      .sort({ pointsRequired: 1 }); // Show cheaper options first
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching redemption options:', error);
    res.status(500).json({ message: 'Server error while fetching redemption options.' });
  }
};

// @desc    Redeem points for an option
// @route   POST /api/redemption/redeem/:optionId
// @access  Private
const redeemPointsForOption = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { optionId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(optionId)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Invalid redemption option ID.' });
    }

    const user = await User.findById(userId).session(session);
    const option = await RedemptionOption.findById(optionId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!option) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Redemption option not found.' });
    }
    if (!option.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ message: 'This redemption option is currently not active.' });
    }
    if (user.points < option.pointsRequired) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Not enough points to redeem this option.' });
    }
    if (option.stock !== Infinity && option.stock < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'This item is out of stock.' });
    }

    // Deduct points and stock
    user.points -= option.pointsRequired;
    if (option.stock !== Infinity) {
      option.stock -= 1;
    }

    await user.save({ session });
    await option.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: `Successfully redeemed '${option.title}'.`,
      newPointsTotal: user.points,
      optionDetails: {
        title: option.title,
        linkToCourse: option.linkToCourse,
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Error redeeming points:', error);
    res.status(500).json({ message: 'Server error during point redemption.' });
  }
};



export { 
    getRedemptionOptions, 
    redeemPointsForOption,
};