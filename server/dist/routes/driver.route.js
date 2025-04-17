"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const driver_controller_1 = require("../controllers/driver.controller");
const router = express_1.default.Router();
// Route to get the assigned vehicle for a driver
router.get('/:driverId/vehicle', driver_controller_1.getAssignedVehicle);
router.patch('/vehicle/:vehicleId/free', driver_controller_1.freeAssignedVehicle);
exports.default = router;
