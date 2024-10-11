"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Import CORS middleware
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = __importDefault(require("./config/db"));
const profileRoutes_1 = __importDefault(require("./routes/profileRoutes")); // Import profile routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS for all origins
app.use((0, cors_1.default)({
    origin: '*', // Allow all origins
    credentials: true // Enable credentials if needed
}));
app.use(express_1.default.json());
// Test the database connection
db_1.default.$connect()
    .then(() => {
    console.log('Connected to the database');
})
    .catch((error) => {
    console.error('Failed to connect to the database', error);
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/profile', profileRoutes_1.default); // Use profile routes
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
