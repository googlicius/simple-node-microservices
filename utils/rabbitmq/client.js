const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://admin:master123@localhost:5672";

class RabbitMQClient {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.responseEmitter = new Map();
        this.responseQueue = null;
    }

    async connect(url = RABBITMQ_URL) {
        try {
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();

            // Create response queue with random name
            const { queue } = await this.channel.assertQueue("", { exclusive: true });
            this.responseQueue = queue;

            // Start listening for responses
            this.channel.consume(
                this.responseQueue,
                (msg) => {
                    const content = JSON.parse(msg.content.toString());
                    const resolver = this.responseEmitter.get(
                        msg.properties.correlationId
                    );
                    if (resolver) {
                        resolver(content);
                        this.responseEmitter.delete(msg.properties.correlationId);
                    }
                },
                { noAck: true }
            );

            console.log("Connected to RabbitMQ");
        } catch (error) {
            console.error("Error connecting to RabbitMQ:", error);
            throw error;
        }
    }

    async createQueue(queue) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
        } catch (error) {
            console.error("Error creating queue:", error);
            throw error;
        }
    }

    async sendMessage(queue, message) {
        try {
            const correlationId = uuidv4();

            const promise = new Promise((resolve) => {
                this.responseEmitter.set(correlationId, resolve);
            });

            // Send message with correlation ID and reply-to queue
            await this.channel.sendToQueue(
                queue,
                Buffer.from(JSON.stringify(message)),
                {
                    correlationId,
                    replyTo: this.responseQueue,
                }
            );

            // Add timeout to prevent memory leaks
            const timeout = new Promise((_, reject) => {
                setTimeout(() => {
                    this.responseEmitter.delete(correlationId);
                    reject(new Error("Request timeout"));
                }, 10000); // 10 seconds timeout
            });

            return Promise.race([promise, timeout]);
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    async consumeMessage(queue, callback) {
        try {
            await this.channel.consume(queue, async (msg) => {
                const content = JSON.parse(msg.content.toString());
                const response = await callback(content);

                // Send response back if replyTo is specified
                if (msg.properties.replyTo) {
                    this.channel.sendToQueue(
                        msg.properties.replyTo,
                        Buffer.from(JSON.stringify(response)),
                        {
                            correlationId: msg.properties.correlationId,
                        }
                    );
                }

                this.channel.ack(msg);
            });
        } catch (error) {
            console.error("Error consuming message:", error);
            throw error;
        }
    }

    async close() {
        try {
            await this.channel.close();
            await this.connection.close();
        } catch (error) {
            console.error("Error closing connection:", error);
            throw error;
        }
    }
}

module.exports = RabbitMQClient;
