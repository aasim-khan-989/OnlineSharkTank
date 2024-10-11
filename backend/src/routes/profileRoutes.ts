import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import prisma from '../config/db';

const router = express.Router();

// Define the expected shape of the profile data in the request body
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

// Create or update profile
router.post(
  '/complete-profile',
  [
    body('fullName').notEmpty().withMessage('Full name is required'),
    body('age').optional().isNumeric().withMessage('Age must be a number'),
    body('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    body('aadharNumber')
      .optional()
      .isLength({ min: 12, max: 12 })
      .withMessage('Aadhar number must be 12 digits'),
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
      // Upsert (create or update) the profile
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to complete the profile' });
    }
  }
);

export default router;
