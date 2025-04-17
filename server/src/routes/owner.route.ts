import express from 'express';
import { addVehicle, removeVehicle, manageVehicle, getVehiclesByOwner, getDriversByOwner, removeDriverById, getNotifications, getOwnerById } from '../controllers/owner.controller';
import { getFreeVehiclesByOwner, assignVehicleToDriver } from '../controllers/owner.controller';

const router = express.Router();

router.get('/:id', getOwnerById);


// Route to add a vehicle
router.post('/vehicles', addVehicle);

// Route to remove a vehicle
router.delete('/vehicles/:vehicleId', removeVehicle);

// Route to manage/update a vehicle
router.put('/vehicles/:vehicleId', manageVehicle);

// Route to fetch vehicles by owner
router.get('/:ownerId/vehicles', getVehiclesByOwner);

// Route to fetch drivers by owner
router.get('/:ownerId/drivers', getDriversByOwner);

router.delete('/drivers/:driverId', removeDriverById);

// Route to fetch free vehicles by owner
router.get('/:ownerId/free-vehicles', getFreeVehiclesByOwner);

// Route to assign a vehicle to a driver
router.post('/assign-vehicle', assignVehicleToDriver);



router.get('/notifications', getNotifications);


export default router;