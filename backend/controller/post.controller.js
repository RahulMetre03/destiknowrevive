import { createPostService } from "../services/post.services.js";

export const createPost = async (req, res) => {
  try {
    const { userId, placeId, postId } = req.body;

    if (!userId || !placeId || !postId)
      return res.status(400).json({ message: "Missing fields" });

    const createdPost = await createPostService({ userId, placeId, postId });

    return res.status(201).json({
      message: "Post created successfully",
      post: createdPost
    });

  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
