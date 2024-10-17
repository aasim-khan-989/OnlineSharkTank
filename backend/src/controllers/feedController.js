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
exports.getAllFeeds = void 0;
const db_1 = __importDefault(require("../config/db")); // Make sure prisma is imported correctly
// Fetch all public feeds
const getAllFeeds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeds = yield db_1.default.feed.findMany({
            where: { isPrivate: false }, // Only fetch public feeds
            include: {
                user: {
                    select: {
                        username: true, // Fetch associated user and username
                    },
                },
            },
            orderBy: { createdAt: "desc" }, // Order by creation date
        });
        res.json(feeds);
    }
    catch (error) {
        console.error("Error fetching feeds:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllFeeds = getAllFeeds;
