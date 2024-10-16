import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/db';

const router = express.Router();

interface CompleteProfileBody {
  fullName: string;
  age?: number;
  dateOfBirth?: string;
  description?: string;
  businessCategory?: string;
  investmentCategory?: string;
  contactNumber?: string;
  location?: string;
  profilePictureUrl?: string;
  socialLinks?: string;
  aadharNumber?: string;
  userId: number;
}

// Get Profile Completion Status and Profile Image URL
router.get('/profile-completion-status/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: {
        fullName: true,
        description: true,
        profilePictureUrl: true,
        isProfileCompleted: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ 
        isProfileCompleted: false, 
        profileImageUrl: null, 
        message: 'Profile not found' 
      });
    }

    res.json({
      isProfileCompleted: profile.isProfileCompleted,
      fullName: profile.fullName,
      description: profile.description,
      profilePictureUrl: profile.profilePictureUrl,
    });
  } catch (error) {
    console.error('Error fetching profile completion status:', error);
    res.status(500).json({ error: 'Failed to fetch profile completion status' });
  }
});

// Create or update profile
router.post(
  '/complete-profile',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('age').optional().isNumeric().withMessage('Age must be a number'),
    body('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    body('aadharNumber').optional().isString().withMessage('Aadhar number must be a string'),
  ],
  async (req: Request<{}, {}, CompleteProfileBody>, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      fullName,
      age,
      dateOfBirth,
      description,
      businessCategory,
      investmentCategory,
      contactNumber,
      location,
      profilePictureUrl,
      socialLinks,
      aadharNumber,
      userId,
    } = req.body;

    try {
      const profile = await prisma.profile.upsert({
        where: { userId: userId },
        update: {
          fullName,
          age: age ? Number(age) : null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          description,
          businessCategory,
          investmentCategory,
          contactNumber,
          location,
          profilePictureUrl,
          socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
          aadharNumber: aadharNumber ?? "",
          isProfileCompleted: true,
        },
        create: {
          userId,
          fullName,
          age: age ? Number(age) : null,
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
          description,
          businessCategory,
          investmentCategory,
          contactNumber,
          location,
          profilePictureUrl,
          socialLinks: socialLinks ? JSON.parse(socialLinks) : null,
          aadharNumber: aadharNumber ?? "",
          isProfileCompleted: true,
        },
      });

      res.json({ profile, message: 'Profile completed successfully' });
    } catch (error: any) {
      console.error('Error completing profile:', error);

      if (error.code === 'P2002') {
        res.status(409).json({ error: 'A profile with this Aadhar number already exists.' });
      } else {
        res.status(500).json({ error: 'Failed to complete the profile' });
      }
    }
  }
);

// Create a post
router.post('/create-post', [
  body('content').isString().notEmpty(),
  body('userId').isNumeric(),
  body('isPrivate').isBoolean(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content, userId, isPrivate } = req.body;

  try {
    const post = await prisma.feed.create({
      data: {
        content,
        userId,
        isPrivate,
      },
    });

    res.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Get all posts for a user
router.get('/user-posts/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const posts = await prisma.feed.findMany({
      where: {
        userId,
      },
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Fetch user feeds (my feeds)
router.get('/my-feeds/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const feeds = await prisma.feed.findMany({
      where: {
        userId,
      },
      select: {
        content: true,
        videoUrl: true,
        isPrivate: false,
      },
    });

    res.json(feeds);
  } catch (error) {
    console.error('Error fetching user feeds:', error);
    res.status(500).json({ error: 'Failed to fetch user feeds' });
  }
});

// Update profile name
router.put('/update-name', [
  body('userId').isNumeric(),
  body('fullName').isString().notEmpty(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, fullName } = req.body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { fullName },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating name:', error);
    res.status(500).json({ error: 'Failed to update name' });
  }
});

// Update profile description
router.put('/update-description', [
  body('userId').isNumeric(),
  body('description').isString(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, description } = req.body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { description },
    });

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating description:', error);
    res.status(500).json({ error: 'Failed to update description' });
  }
});

// Route to upload a video post
router.post(
  '/feed/upload-video',
  [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('videoUrl').isURL().withMessage('Invalid video URL'),
    body('isPrivate').isBoolean().optional().withMessage('isPrivate must be a boolean'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, videoUrl, content, isPrivate } = req.body;

    try {
      // Create a new feed post with the provided data
      const newPost = await prisma.feed.create({
        data: {
          userId: parseInt(userId), // Ensure userId is an integer
          videoUrl,
          content: content || null, // Optional content
          isPrivate: isPrivate || false, // Default to public post
        },
      });

      res.status(201).json(newPost);
    } catch (error) {
      console.error('Error uploading video post:', error);
      res.status(500).json({ error: 'Failed to upload video post' });
    }
  }
);

// Export the router
export default router;
