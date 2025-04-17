"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const owner_controller_1 = require("../controllers/owner.controller");
const owner_controller_2 = require("../controllers/owner.controller");
const router = express_1.default.Router();
router.get('/:id', owner_controller_1.getOwnerById);
// Route to add a vehicle
router.post('/vehicles', owner_controller_1.addVehicle);
// Route to remove a vehicle
router.delete('/vehicles/:vehicleId', owner_controller_1.removeVehicle);
// Route to manage/update a vehicle
router.put('/vehicles/:vehicleId', owner_controller_1.manageVehicle);
// Route to fetch vehicles by owner
router.get('/:ownerId/vehicles', owner_controller_1.getVehiclesByOwner);
// Route to fetch drivers by owner
router.get('/:ownerId/drivers', owner_controller_1.getDriversByOwner);
router.delete('/drivers/:driverId', owner_controller_1.removeDriverById);
// Route to fetch free vehicles by owner
router.get('/:ownerId/free-vehicles', owner_controller_2.getFreeVehiclesByOwner);
// Route to assign a vehicle to a driver
router.post('/assign-vehicle', owner_controller_2.assignVehicleToDriver);
router.get('/notifications', owner_controller_1.getNotifications);
exports.default = router;
