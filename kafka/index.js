const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "food-delivery-service",
  brokers: ["localhost:9092"],
});

// Initialize producer and consumer
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "delivery-tracking-group" });

// Topic name for delivery location updates
const TOPIC_NAME = "delivery-location-updates";

// Connect both producer and consumer
async function connectServices() {
  try {
    await producer.connect();
    await consumer.connect();
    console.log("Kafka producer and consumer connected successfully");
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
}

// Function to update delivery location
async function updateDeliveryLocation(deliveryId, location) {
  try {
    await producer.send({
      topic: TOPIC_NAME,
      messages: [
        {
          key: deliveryId.toString(),
          value: JSON.stringify({
            deliveryId,
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });
    console.log(`Location updated for delivery ${deliveryId}`);
  } catch (error) {
    console.error("Error sending location update:", error);
    throw error;
  }
}

// Function to start tracking delivery locations
async function startTrackingDeliveries() {
  try {
    // Subscribe to the topic
    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

    // Start processing messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const locationUpdate = JSON.parse(message.value.toString());
        console.log("Received location update:", {
          deliveryId: locationUpdate.deliveryId,
          latitude: locationUpdate.latitude,
          longitude: locationUpdate.longitude,
          timestamp: locationUpdate.timestamp,
        });

        // Here you can add your custom logic to handle location updates
        // For example, updating a database or notifying clients
      },
    });
  } catch (error) {
    console.error("Error tracking deliveries:", error);
  }
}

// Graceful shutdown function
async function shutdownGracefully() {
  try {
    await producer.disconnect();
    await consumer.disconnect();
    console.log("Kafka services disconnected successfully");
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGTERM", shutdownGracefully);
process.on("SIGINT", shutdownGracefully);

// Initialize the services
connectServices()
  .then(() => {
    startTrackingDeliveries();
    console.log("Delivery tracking service started");
  })
  .catch((error) => {
    console.error("Failed to initialize services:", error);
  });

// Export functions for external use
module.exports =  { shutdownGracefully, updateDeliveryLocation };
