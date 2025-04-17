import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.route";
import ownerRoutes from "./routes/owner.route";
import driverRoutes from "./routes/driver.route"; // Import driver routes
import '../utils/alert'; // Import the cron job

dotenv.config();

const PORT = process.env.PORT || 7000; // Default to 7000 if PORT is not set

const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan("dev")); // Log HTTP requests
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/drivers', driverRoutes); // Assuming driver routes are handled in ownerRoutes

// Health Check Route
app.get('/', (req, res) => {
  res.send('Fleet Manager API is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});