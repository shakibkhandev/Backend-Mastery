const { updateDeliveryLocation } = require("./index.js");

// Function to simulate a delivery route
async function simulateDeliveryRoute() {
  // Generate a random delivery ID
  const deliveryId = `DEL-${Math.floor(Math.random() * 1000)}`;

  // Simulate a delivery route (e.g., from restaurant to customer)
  const deliveryRoute = [
    {
      latitude: 40.7128,
      longitude: -74.006,
      description: "Restaurant - Starting Point",
    },
    { latitude: 40.7135, longitude: -74.007, description: "On the way" },
    { latitude: 40.714, longitude: -74.008, description: "Near customer" },
    {
      latitude: 40.7145,
      longitude: -74.0085,
      description: "Delivery destination",
    },
  ];

  console.log(`Starting delivery simulation for order ${deliveryId}`);

  // Send location updates with delays to simulate movement
  for (const location of deliveryRoute) {
    try {
      await updateDeliveryLocation(deliveryId, location);
      console.log(`📍 Location updated: ${location.description}`);

      // Wait for 3 seconds before next update
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (error) {
      console.error(
        `❌ Error updating location for delivery ${deliveryId}:`,
        error
      );
    }
  }

  console.log(`✅ Delivery simulation completed for order ${deliveryId}`);
}

// Run multiple delivery simulations
async function runMultipleDeliveries(count = 3) {
  console.log(`Starting simulation for ${count} deliveries...`);

  for (let i = 0; i < count; i++) {
    await simulateDeliveryRoute();
    // Wait for 2 seconds before starting next delivery
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
}

// Start the simulation
runMultipleDeliveries().catch((error) =>
  console.error("Simulation failed:", error)
);
