// server/controllers/insightsController.js
import User from '../models/User.js';


// @desc    Get the Learner of the Week (based on highest total points)
// @route   GET /api/insights/learner-of-the-week
// @access  Public
const getLearnerOfTheWeek = async (req, res) => {
  try {
    // Find the user with the highest total points
    // We sort by points in descending order and take the first one.
    // We also ensure the user is active or meets certain criteria if needed (e.g., isAdmin: false)
    const learnerOfTheWeek = await User.findOne({ /* you could add filters like isAdmin: false */ })
      .sort({ points: -1 }) // Highest points first
      .select('username profilePictureUrl points streak') // Select relevant fields
      .exec(); // Execute the query

    if (learnerOfTheWeek) {
      // Check if points are substantial enough to be "learner of the week"
      // For example, if learnerOfTheWeek.points > 0
      if (learnerOfTheWeek.points === 0 && learnerOfTheWeek.streak === 0) {
        return res.status(200).json({ message: 'No outstanding learner this week yet.' });
      }
      res.status(200).json(learnerOfTheWeek);
    } else {
      res.status(404).json({ message: 'Learner of the Week could not be determined at this time.' });
    }
  } catch (error) {
    console.error('Error fetching Learner of the Week:', error);
    res.status(500).json({ message: 'Server error while fetching Learner of the Week.' });
  }
};



// @desc    Get heatmap data (learner counts per state in India)
// @route   GET /api/insights/heatmap
// @access  Public
const getHeatmapData = async (req, res) => {
  try {
    // Aggregate users by state, specifically for India (case-insensitive for 'India')
    // and where state is not empty or null.
    const heatmapData = await User.aggregate([
      {
        $match: {
          country: { $regex: /^India$/i }, // Case-insensitive match for 'India'
          state: { $ne: null, $ne: '' }     // State must exist and not be empty
        }
      },
      {
        $group: {
          _id: '$state', // Group by the state field
          count: { $sum: 1 } // Count users in each state
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field from MongoDB aggregation
          state: '$_id', // Rename _id to state
          count: '$count'
        }
      },
      {
        $sort: { count: -1 } // Optional: sort by count descending
      }
    ]);

    res.status(200).json(heatmapData);

  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    res.status(500).json({ message: 'Server error while fetching heatmap data.' });
  }
};



export { getLearnerOfTheWeek, getHeatmapData };