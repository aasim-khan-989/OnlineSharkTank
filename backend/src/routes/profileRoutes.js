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
// Create or update profile
router.post('/complete-profile', [
    (0, express_validator_1.body)('fullName').notEmpty().withMessage('Full name is required'),
    (0, express_validator_1.body)('age').optional().isNumeric().withMessage('Age must be a number'),
    (0, express_validator_1.body)('dateOfBirth').optional().isDate().withMessage('Invalid date format'),
    (0, express_validator_1.body)('aadharNumber')
        .optional()
        .isLength({ min: 12, max: 12 })
        .withMessage('Aadhar number must be 12 digits'),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { fullName, age, dateOfBirth, description, businessCategory, investmentCategory, contactNumber, location, profilePictureUrl, socialLinks, aadharNumber, userId, } = req.body;
    try {
        // Upsert (create or update) the profile
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to complete the profile' });
    }
}));
exports.default = router;
