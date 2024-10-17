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
exports.getUserProfile = void 0;
const db_1 = __importDefault(require("../config/db")); // Make sure prisma is imported correctly
// Fetch user profile and associated public posts
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { username } = req.params;
    try {
        const user = yield db_1.default.user.findFirst({
            where: { username },
            include: {
                profile: true,
                feeds: {
                    where: { isPrivate: false }, // Only fetch public feeds
                    select: {
                        id: true,
                        content: true,
                        videoUrl: true,
                        likes: true,
                        dislikes: true,
                        isPrivate: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            username: user.username,
            description: ((_a = user.profile) === null || _a === void 0 ? void 0 : _a.description) || "No description provided",
            profilePictureUrl: ((_b = user.profile) === null || _b === void 0 ? void 0 : _b.profilePictureUrl) || "/default-profile.png",
            posts: user.feeds, // Return user's public feeds
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserProfile = getUserProfile;
