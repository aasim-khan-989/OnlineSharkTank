import { Request, Response } from "express";
import prisma from "../config/db";  // Make sure prisma is imported correctly

// Fetch user profile and associated public posts
export const getUserProfile = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: { username },
      include: {
        profile: true,
        feeds: {
          where: { isPrivate: false },  // Only fetch public feeds
          select: {
            id: true,
            content: true,
            videoUrl: true,
            likes: true,
            dislikes: true,
            isPrivate: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      description: user.profile?.description || "No description provided",
      profilePictureUrl: user.profile?.profilePictureUrl || "/default-profile.png",
      posts: user.feeds,  // Return user's public feeds
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
