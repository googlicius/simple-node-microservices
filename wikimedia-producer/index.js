const { Kafka, CompressionTypes } = require("kafkajs");
const axios = require("axios");

const kafka = new Kafka({
  clientId: "wikimedia-producer",
  brokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(",")
    : ["localhost:9092", "localhost:9093", "localhost:9094"],
});

const producer = kafka.producer();

async function startProducer() {
  await producer.connect();
  console.log("Kafka Producer connected");

  // URL for the Wikimedia recent changes stream
  const streamUrl = "https://stream.wikimedia.org/v2/stream/recentchange";

  // Create a stream from the Wikimedia API
  const { data: stream } = await axios.get(streamUrl, {
    responseType: "stream",
  });

  // Read the stream line by line
  stream.on("data", async (chunk) => {
    const message = chunk.toString().trim();

    if (message) {
      try {
        // Produce the message to the Kafka topic
        await producer.send({
          topic: "recent-changes",
          messages: [{ value: message }],
          compression: CompressionTypes.GZIP,
        });
        console.log("Message sent to Kafka:", message);
      } catch (error) {
        console.error("Error sending message to Kafka:", error);
      }
    }
  });

  stream.on("error", (error) => {
    console.error("Stream error:", error);
  });
}

startProducer().catch(console.error);
