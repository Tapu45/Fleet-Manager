import express from 'express';
import { driverSignup, login,  ownerSignup } from '../controllers/auth.controller';

const router = express.Router();

// Route for owner signup
router.post('/signup', ownerSignup);

router.post('/driver/signup', driverSignup);

router.post('/login', login);

export default router;