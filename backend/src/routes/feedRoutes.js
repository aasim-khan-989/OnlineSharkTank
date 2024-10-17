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
// Like a feed post
router.post('/:id/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedId = parseInt(req.params.id);
    // Validate feedId
    if (isNaN(feedId)) {
        return res.status(400).json({ error: 'Invalid feed ID' });
    }
    try {
        const updatedFeed = yield db_1.default.feed.update({
            where: { id: feedId },
            data: { likes: { increment: 1 } },
        });
        res.json(updatedFeed);
    }
    catch (error) {
        console.error('Error liking feed:', error);
        res.status(500).json({ error: 'Failed to like feed' });
    }
}));
// Dislike a feed post
router.post('/:id/dislike', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const feedId = parseInt(req.params.id);
    // Validate feedId
    if (isNaN(feedId)) {
        return res.status(400).json({ error: 'Invalid feed ID' });
    }
    try {
        const updatedFeed = yield db_1.default.feed.update({
            where: { id: feedId },
            data: { dislikes: { increment: 1 } },
        });
        res.json(updatedFeed);
    }
    catch (error) {
        console.error('Error disliking feed:', error);
        res.status(500).json({ error: 'Failed to dislike the feed' });
    }
}));
// Get all public feeds (excluding private ones)
// Get all public feeds (excluding private ones)
router.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all public feeds with the associated user data, ordered by number of likes
        const publicFeeds = yield db_1.default.feed.findMany({
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
    }
    catch (error) {
        console.error('Error fetching all public feeds:', error);
        res.status(500).json({ error: 'Failed to fetch public feeds' });
    }
}));
router.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const updatedFeed = yield db_1.default.feed.update({
            where: { id: Number(id) },
            data: { content },
        });
        res.json(updatedFeed);
    }
    catch (error) {
        res.status(500).json({ error: 'Error updating feed' });
    }
}));
router.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield db_1.default.feed.delete({
            where: { id: Number(id) },
        });
        res.status(204).send(); // No Content
    }
    catch (error) {
        res.status(500).json({ error: 'Error deleting feed' });
    }
}));
// Export the router
exports.default = router;
