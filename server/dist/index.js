"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const owner_route_1 = __importDefault(require("./routes/owner.route"));
const driver_route_1 = __importDefault(require("./routes/driver.route")); // Import driver routes
require("../utils/alert"); // Import the cron job
dotenv_1.default.config();
const PORT = process.env.PORT || 7000; // Default to 7000 if PORT is not set
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)()); // Enable Cross-Origin Resource Sharing
app.use((0, morgan_1.default)("dev")); // Log HTTP requests
app.use(express_1.default.json()); // Parse JSON request bodies
// Routes
app.use('/api/auth', auth_route_1.default);
app.use('/api/owners', owner_route_1.default);
app.use('/api/drivers', driver_route_1.default); // Assuming driver routes are handled in ownerRoutes
// Health Check Route
app.get('/', (req, res) => {
    res.send('Fleet Manager API is running!');
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
