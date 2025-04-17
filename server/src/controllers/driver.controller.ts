import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

// Get details of the current vehicle assigned to the driver
export const getAssignedVehicle = async (req: any, res: any) => {
  try {
    const driverId = parseInt(req.params.driverId, 10);

    // Validate driverId
    if (!driverId) {
      return res.status(400).json({ error: 'Driver ID is required' });
    }

    // Fetch the driver and their assigned vehicle
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        vehicle: {
          include: {
            owner: true, // Include owner details
          },
        },
      },
    });

    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Check if the driver has a vehicle assigned
    if (!driver.vehicle) {
      return res.status(404).json({ error: 'No vehicle assigned to this driver' });
    }

    // Respond with the vehicle details
    res.status(200).json({
      message: 'Vehicle details fetched successfully',
      vehicle: {
        id: driver.vehicle.id,
        chassisNo: driver.vehicle.chassisNo,
        engineNo: driver.vehicle.engineNo,
        regdNo: driver.vehicle.regdNo,
        fuelType: driver.vehicle.fuelType,
        insuranceCompany: driver.vehicle.insuranceCompany,
        insurancePolicyNo: driver.vehicle.insurancePolicyNo,
        insuranceValidUpto: driver.vehicle.insuranceValidUpto,
        insuranceDocument: driver.vehicle.insuranceDocument,
        puccNo: driver.vehicle.puccNo,
        puccValidUpto: driver.vehicle.puccValidUpto,
        pucDocument: driver.vehicle.pucDocument,
        status: driver.vehicle.status,
        owner: {
          id: driver.vehicle.owner.id,
          name: driver.vehicle.owner.name,
          email: driver.vehicle.owner.email,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching assigned vehicle:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Free the assigned vehicle
export const freeAssignedVehicle = async (req: any, res: any) => {
    try {
      const { vehicleId } = req.params;
  
      // Validate vehicleId
      if (!vehicleId) {
        return res.status(400).json({ error: 'Vehicle ID is required' });
      }
  
      // Update the vehicle's status to "free" and unassign the driver
      const updatedVehicle = await prisma.vehicle.update({
        where: { id: parseInt(vehicleId, 10) },
        data: {
          status: 'free',
          driverId: null, // Unassign the driver
        },
      });
  
      res.status(200).json({ message: 'Vehicle status updated to free', vehicle: updatedVehicle });
    } catch (error) {
      console.error('Error freeing vehicle:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };