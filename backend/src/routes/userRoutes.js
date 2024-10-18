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
const db_1 = __importDefault(require("../config/db"));
const router = express_1.default.Router();
router.get('/:username/profile', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params; // username is a string here
    try {
        // Find the user by username instead of id
        const user = yield db_1.default.user.findUnique({
            where: { username }, // Query by username, not id
            include: {
                profile: true, // Include the profile
                feeds: {
                    where: {
                        isPrivate: false, // Fetch only public feeds
                    },
                },
            },
        });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        // Send back the profile and public feeds
        res.json({
            username: user.username,
            profile: user.profile,
            publicFeeds: user.feeds, // Public feeds only
        });
    }
    catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
