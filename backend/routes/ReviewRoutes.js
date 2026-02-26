import express from "express";
import {
  createReview,
  getReviewsByPlace,
  getReviewById,
  updateReview,
  deleteReview
} from "../controllers/reviewsController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/place/:locationId", getReviewsByPlace);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;