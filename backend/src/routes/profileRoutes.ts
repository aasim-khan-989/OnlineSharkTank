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

// Get Profile Completion Status
router.get('/profile-completion-status/:userId', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({ isProfileCompleted: false, message: 'Profile not found' });
    }

    res.json({ isProfileCompleted: profile.isProfileCompleted });
  } catch (error) {
    console.error('Error fetching profile completion status:', error);
    res.status(500).json({ error: 'Failed to fetch profile completion status' });
  }
});

// Create or update profile
router.post(
  '/complete-profile',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'), // Trim whitespace and ensure fullName is not empty
    body('age').optional().isNumeric().withMessage('Age must be a number'),
    body('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    body('aadharNumber')
      .optional()
      .isLength({ min: 12, max: 12 })
      .withMessage('Aadhar number must be exactly 12 digits'),
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
      // Upsert the profile (create or update)
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
          aadharNumber,
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
          aadharNumber,
          isProfileCompleted: true,
        },
      });

      res.json({ profile, message: 'Profile completed successfully' });
    } catch (error: any) {
      console.error('Error completing profile:', error);

      // Handle Prisma-specific errors
      if (error.code === 'P2002') { // Prisma unique constraint error
        res.status(409).json({ error: 'A profile with this Aadhar number already exists.' });
      } else {
        res.status(500).json({ error: 'Failed to complete the profile' });
      }
    }
  }
);

export default router;
