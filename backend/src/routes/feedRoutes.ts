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
// Get all public feeds (excluding private ones)
router.get('/all', async (req: Request, res: Response) => {
    try {
        // Fetch all public feeds with the associated user data, ordered by number of likes
        const publicFeeds = await prisma.feed.findMany({
            where: { isPrivate: false },
            orderBy: { likes: 'desc' }, // Order feeds by number of likes in descending order
            include: {
                user: {
                    select: {
                        username: true, // Fetch only the unique username (corrected field name)
                    },
                },
            },
        });

        res.json(publicFeeds);
    } catch (error) {
        console.error('Error fetching all public feeds:', error);
        res.status(500).json({ error: 'Failed to fetch public feeds' });
    }
});

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const updatedFeed = await prisma.feed.update({
            where: { id: Number(id) },
            data: { content },
        });
        res.json(updatedFeed);
    } catch (error) {
        res.status(500).json({ error: 'Error updating feed' });
    }
})

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.feed.delete({
            where: { id: Number(id) },
        });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: 'Error deleting feed' });
    }
});



// Export the router
export default router;
