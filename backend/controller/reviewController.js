import Review from "../models/Reviews.js";

export const createReview = async (req, res) => {
  try {
    const { userId, locationId, rating, reviewText } = req.body;

    const review = new Review({
      userId,
      locationId,
      rating,
      reviewText
    });

    const savedReview = await review.save();

    res.status(201).json({
      success: true,
      data: savedReview
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getReviewsByPlace = async (req, res) => {
  try {
    const { locationId } = req.params;

    const reviews = await Review.find({ locationId })
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviewText } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, reviewText },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedReview
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const { locationId } = req.params;

    const result = await Review.aggregate([
      { $match: { locationId: Number(locationId) } },
      {
        $group: {
          _id: "$locationId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: result[0] || { averageRating: 0, totalReviews: 0 }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};