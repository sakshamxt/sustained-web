// server/controllers/redemptionController.js
import RedemptionOption from '../models/RedemptionOption.js';
import User from '../models/User.js';
import mongoose from 'mongoose';


// @desc    Get all active redemption options
// @route   GET /api/redemption/options
// @access  Public (or Protected if only logged-in users can see them)
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
  const session = await mongoose.startSession(); // For transaction
  session.startTransaction();

  try {
    const { optionId } = req.params;
    const userId = req.user._id; // From protect middleware

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

    // Check if user has enough points
    if (user.points < option.pointsRequired) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Not enough points to redeem this option.' });
    }

    // Check stock (if not Infinity)
    if (option.stock !== Infinity && option.stock < 1) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'This item is out of stock.' });
    }

    // Deduct points from user
    user.points -= option.pointsRequired;

    // Decrement stock if it's not Infinity
    if (option.stock !== Infinity) {
      option.stock -= 1;
    }

    await user.save({ session });
    await option.save({ session });

    // Optional: Create a UserRedemptionLog entry here to record the transaction
    // e.g., await UserRedemptionLog.create([{ user: userId, option: optionId, pointsSpent: option.pointsRequired }], { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: `Successfully redeemed '${option.title}'.`,
      newPointsTotal: user.points,
      optionDetails: { // Send some details back, e.g., a link if applicable
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


export { getRedemptionOptions, redeemPointsForOption };