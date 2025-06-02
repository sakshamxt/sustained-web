// server/controllers/progressController.js
import mongoose from 'mongoose';
import UserProgress from '../models/UserProgress.js';
import SDG from '../models/SDG.js';
import User from '../models/User.js';

const POINTS_PER_PRESENTATION = 5;
const POINTS_PER_LESSON = 10;
const POINTS_PER_ACTIVITY = 25;

// Helper function to check if two dates are on the same day (ignoring time)
const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Helper function to check if date1 is the day before date2
const isYesterday = (date1, date2) => {
  if (!date1 || !date2) return false;
  const yesterday = new Date(date2);
  yesterday.setDate(date2.getDate() - 1);
  return isSameDay(date1, yesterday);
};

const markContentAsComplete = async (req, res) => {
  try {
    const { sdgId, contentType, contentId } = req.params;
    const userId = req.user._id;
    const { submissionData } = req.body;

    // ... (validation and SDG course fetching as before) ...
    if (!mongoose.Types.ObjectId.isValid(sdgId)) {
        return res.status(400).json({ message: 'Invalid SDG ID format.' });
    }
    const sdgCourse = await SDG.findById(sdgId);
    if (!sdgCourse) {
        return res.status(404).json({ message: 'SDG course not found.' });
    }

    let userProgress = await UserProgress.findOne({ user: userId, sdgCourse: sdgId });
    if (!userProgress) {
      const enrollingUserCheck = await User.findById(userId); // Fetch full user doc for this check
      if (!enrollingUserCheck.enrolledCourses.some(course => course.equals(sdgId))) {
          return res.status(403).json({ message: 'User not enrolled in this SDG course.' });
      }
      userProgress = new UserProgress({ user: userId, sdgCourse: sdgId });
    }

    let itemAlreadyCompleted = false;
    let pointsToAward = 0;
    let newContentCompletedThisSession = false; // Flag to check if something new was actually completed

    switch (contentType) {
      case 'presentation':
        if (!userProgress.completedPresentations.includes(contentId)) {
          userProgress.completedPresentations.push(contentId);
          pointsToAward = POINTS_PER_PRESENTATION;
          newContentCompletedThisSession = true;
        } else {
          itemAlreadyCompleted = true;
        }
        break;
      case 'lesson':
        if (!userProgress.completedLessons.includes(contentId)) {
          userProgress.completedLessons.push(contentId);
          pointsToAward = POINTS_PER_LESSON;
          newContentCompletedThisSession = true;
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
          newContentCompletedThisSession = true;
        } else {
          itemAlreadyCompleted = true;
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid content type.' });
    }

    if (itemAlreadyCompleted && !newContentCompletedThisSession) { // Make sure not to penalize if user re-submits already completed item
      return res.status(200).json({ 
        message: 'Content already marked as complete.', 
        progress: userProgress 
      });
    }

    // Calculate progress percentage (as before) ...
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
      userProgress.progressPercentage = 0;
    }
    
    await userProgress.save();

    let userForStreakAndPoints; // To store the user document for updates
    // Update user points and streak if new content was completed
    if (newContentCompletedThisSession && pointsToAward > 0) {
      userForStreakAndPoints = await User.findById(userId); // Fetch the user document
      if (userForStreakAndPoints) {
        userForStreakAndPoints.points = (userForStreakAndPoints.points || 0) + pointsToAward;

        // Streak Logic
        const today = new Date();
        if (userForStreakAndPoints.lastActivityDate) {
          if (isYesterday(userForStreakAndPoints.lastActivityDate, today)) {
            userForStreakAndPoints.streak = (userForStreakAndPoints.streak || 0) + 1; // Continued streak
          } else if (!isSameDay(userForStreakAndPoints.lastActivityDate, today)) {
            userForStreakAndPoints.streak = 1; // Streak broken, reset to 1 for today's activity
          }
          // If it's the same day, streak doesn't change for subsequent activities
        } else {
          userForStreakAndPoints.streak = 1; // First activity
        }
        userForStreakAndPoints.lastActivityDate = today;
        
        await userForStreakAndPoints.save();
      }
    }

    res.status(200).json({
      message: `${contentType} '${contentId}' marked as complete.`,
      progress: userProgress,
      awardedPoints: pointsToAward,
      currentStreak: userForStreakAndPoints ? userForStreakAndPoints.streak : req.user.streak, // Show updated streak
      newTotalPoints: userForStreakAndPoints ? userForStreakAndPoints.points : req.user.points
    });

  } catch (error) {
    console.error('Error marking content as complete:', error);
    res.status(500).json({ message: 'Server error while updating progress.' });
  }
};

export { markContentAsComplete };