import express, { Request, Response } from 'express';
import prisma from '../config/db';

const router = express.Router();

// Like a feed post
router.post('/:id/like', async (req: Request, res: Response) => {
    const feedId = parseInt(req.params.id);

    // Validate feedId
    if (isNaN(feedId)) {
        return res.status(400).json({ error: 'Invalid feed ID' });
    }

    try {
        const updatedFeed = await prisma.feed.update({
            where: { id: feedId },
            data: { likes: { increment: 1 } },
        });
        res.json(updatedFeed);
    } catch (error) {
        console.error('Error liking feed:', error);
        res.status(500).json({ error: 'Failed to like feed' });
    }
});

// Dislike a feed post
router.post('/:id/dislike', async (req: Request, res: Response) => {
    const feedId = parseInt(req.params.id);

    // Validate feedId
    if (isNaN(feedId)) {
        return res.status(400).json({ error: 'Invalid feed ID' });
    }

    try {
        const updatedFeed = await prisma.feed.update({
            where: { id: feedId },
            data: { dislikes: { increment: 1 } },
        });
        res.json(updatedFeed);
    } catch (error) {
        console.error('Error disliking feed:', error);
        res.status(500).json({ error: 'Failed to dislike the feed' });
    }
});

// Get all public feeds (excluding private ones)
router.get('/all', async (req: Request, res: Response) => {
    try {
        // Fetch all feeds where isPrivate is false
        const publicFeeds = await prisma.feed.findMany({
            where: { isPrivate: false },
            orderBy: { createdAt: 'desc' }, // Optional: order feeds by creation date
        });
        res.json(publicFeeds);
    } catch (error) {
        console.error('Error fetching all public feeds:', error);
        res.status(500).json({ error: 'Failed to fetch public feeds' });
    }
});

// Export the router
export default router;
