import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/db';

const router = express.Router();

router.get('/:username/profile', async (req: Request, res: Response) => {
    const { username } = req.params;  // username is a string here
  
    try {
      // Find the user by username instead of id
      const user = await prisma.user.findUnique({
        where: { username },  // Query by username, not id
        include: {
          profile: true,  // Include the profile
          feeds: {
            where: {
              isPrivate: false,  // Fetch only public feeds
            },
          },
        },
      });
  
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Send back the profile and public feeds
      res.json({
        username: user.username,
        profile: user.profile,
        publicFeeds: user.feeds,  // Public feeds only
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
});

  



export default router;
  
  