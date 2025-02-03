const { Kafka } = require("kafkajs");

const kafka = new Kafka({
    clientId: "wikimedia-consumer",
    brokers: process.env.KAFKA_BROKERS
        ? process.env.KAFKA_BROKERS.split(",")
        : ["localhost:9092", "localhost:9093", "localhost:9094"],
});

const consumer = kafka.consumer({ groupId: "wikimedia-group" });

async function startConsumer() {
    await consumer.connect();
    console.log("Wikimedia Consumer connected");
    await consumer.subscribe({ topic: "recent-changes", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({ message: message.value.toString(), partition });
        },
    });
}

startConsumer().catch(console.error);
