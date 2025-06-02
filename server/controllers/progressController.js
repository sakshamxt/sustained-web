// server/controllers/progressController.js
import mongoose from 'mongoose';
import UserProgress from '../models/UserProgress.js';
import SDG from '../models/SDG.js';
import User from '../models/User.js';

const POINTS_PER_PRESENTATION = 5;
const POINTS_PER_LESSON = 10;
const POINTS_PER_ACTIVITY = 25;


// @desc    Mark learning content as complete for a user
// @route   POST /api/progress/:sdgId/complete/:contentType/:contentId
// @access  Private
const markContentAsComplete = async (req, res) => {
  try {
    const { sdgId, contentType, contentId } = req.params;
    const userId = req.user._id;
    const { submissionData } = req.body; // For activities

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
      return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }

    // Fetch the SDG course to get total counts for progress calculation
    const sdgCourse = await SDG.findById(sdgId);
    if (!sdgCourse) {
      return res.status(404).json({ message: 'SDG course not found.' });
    }

    // Find or create UserProgress document
    let userProgress = await UserProgress.findOne({ user: userId, sdgCourse: sdgId });
    if (!userProgress) {
      // Check if user is enrolled (optional, but good practice)
      const enrollingUser = await User.findById(userId);
      if (!enrollingUser.enrolledCourses.some(course => course.equals(sdgId))) {
        return res.status(403).json({ message: 'User not enrolled in this SDG course.' });
      }
      userProgress = new UserProgress({ user: userId, sdgCourse: sdgId });
    }

    let itemAlreadyCompleted = false;
    let pointsToAward = 0;

    switch (contentType) {
      case 'presentation':
        if (!userProgress.completedPresentations.includes(contentId)) {
          userProgress.completedPresentations.push(contentId);
          pointsToAward = POINTS_PER_PRESENTATION;
        } else {
          itemAlreadyCompleted = true;
        }
        break;
      case 'lesson':
        if (!userProgress.completedLessons.includes(contentId)) {
          userProgress.completedLessons.push(contentId);
          pointsToAward = POINTS_PER_LESSON;
        } else {
          itemAlreadyCompleted = true;
        }
        break;
      case 'activity':
        if (!userProgress.completedActivities.some(act => act.activityId === contentId)) {
          userProgress.completedActivities.push({ 
            activityId: contentId, 
            submissionData: submissionData || null,
            completedAt: new Date()
          });
          pointsToAward = POINTS_PER_ACTIVITY;
        } else {
          itemAlreadyCompleted = true;
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type.' });
    }

    if (itemAlreadyCompleted) {
      return res.status(200).json({ 
        message: 'Content already marked as complete.', 
        progress: userProgress 
      });
    }

    // Calculate progress percentage
    const totalPresentations = sdgCourse.presentations.length;
    const totalLessons = sdgCourse.lessons.length;
    const totalActivities = sdgCourse.practicalActivities.length;
    const totalItems = totalPresentations + totalLessons + totalActivities;

    if (totalItems > 0) {
      const completedItems = userProgress.completedPresentations.length +
                             userProgress.completedLessons.length +
                             userProgress.completedActivities.length;
      userProgress.progressPercentage = Math.round((completedItems / totalItems) * 100);
    } else {
      userProgress.progressPercentage = 0; // Or 100 if no items means course is complete
    }
    
    await userProgress.save();

    // Update user points (and potentially streak - simplified for now)
    if (pointsToAward > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.points = (user.points || 0) + pointsToAward;
        // Basic streak logic: Increment streak. More complex daily streak logic can be added.
        // For a simple interpretation, if they complete something new, streak might increase.
        // A more robust streak would check daily activity.
        // user.streak = (user.streak || 0) + 1; // Simplistic streak increment
        await user.save();
        // Note: req.user from protect middleware might not reflect these immediate changes
        // unless re-fetched or updated on the req object.
      }
    }

    res.status(200).json({
      message: `${contentType} '${contentId}' marked as complete.`,
      progress: userProgress,
      awardedPoints: pointsToAward,
      // newTotalPoints: user ? user.points : undefined // If user was fetched and updated
    });

  } catch (error) {
    console.error('Error marking content as complete:', error);
    res.status(500).json({ message: 'Server error while updating progress.' });
  }
};

export { markContentAsComplete };