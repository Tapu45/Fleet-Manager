import express from 'express';
import { freeAssignedVehicle, getAssignedVehicle } from '../controllers/driver.controller';

const router = express.Router();

// Route to get the assigned vehicle for a driver
router.get('/:driverId/vehicle', getAssignedVehicle);

router.patch('/vehicle/:vehicleId/free', freeAssignedVehicle);

export default router;