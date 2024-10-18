import { Request, Response } from "express";
import prisma from "../config/db";  // Make sure prisma is imported correctly

// Fetch all public feeds
export const getAllFeeds = async (req: Request, res: Response) => {
  try {
    const feeds = await prisma.feed.findMany({
      where: { isPrivate: false },  // Only fetch public feeds
      include: {
        user: {
          select: {
            username: true,  // Fetch associated user and username
          },
        },
      },
      orderBy: { createdAt: "desc" },  // Order by creation date
    });
    res.json(feeds);
  } catch (error) {
    console.error("Error fetching feeds:", error);
    res.status(500).json({ message: "Server error" });
  }
};
