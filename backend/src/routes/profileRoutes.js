"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
// Get Profile Completion Status and Profile Image URL
router.get('/profile-completion-status/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const profile = yield db_1.default.profile.findUnique({
            where: { userId },
            select: {
                isProfileCompleted: true,
                profilePictureUrl: true,
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
            profilePictureUrl: profile.profilePictureUrl,
        });
    }
    catch (error) {
        console.error('Error fetching profile completion status:', error);
        res.status(500).json({ error: 'Failed to fetch profile completion status' });
    }
}));
// Create or update profile
router.post('/complete-profile', [
    (0, express_validator_1.body)('fullName').trim().notEmpty().withMessage('Full name is required'),
    (0, express_validator_1.body)('age').optional().isNumeric().withMessage('Age must be a number'),
    (0, express_validator_1.body)('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    (0, express_validator_1.body)('aadharNumber').optional().isString().withMessage('Aadhar number must be a string'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, age, dateOfBirth, description, businessCategory, investmentCategory, contactNumber, location, profilePictureUrl, socialLinks, aadharNumber, userId, } = req.body;
    try {
        const profile = yield db_1.default.profile.upsert({
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
                aadharNumber: aadharNumber !== null && aadharNumber !== void 0 ? aadharNumber : "",
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
                aadharNumber: aadharNumber !== null && aadharNumber !== void 0 ? aadharNumber : "",
                isProfileCompleted: true,
            },
        });
        res.json({ profile, message: 'Profile completed successfully' });
    }
    catch (error) {
        console.error('Error completing profile:', error);
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'A profile with this Aadhar number already exists.' });
        }
        else {
            res.status(500).json({ error: 'Failed to complete the profile' });
        }
    }
}));
exports.default = router;
