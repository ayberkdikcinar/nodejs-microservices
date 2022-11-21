import nats, { Message, Stan } from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("publisher connected.");
  const publisher = new Publisher(stan, "ticket:created");
  publisher.publish({ id: "123", name: "test", data: "test" });
});
stan.on("disconnect", () => {
  console.log("publisher disconnected.");
});

class Publisher {
  private client: Stan;
  subject: string;

  constructor(client: Stan, subject: string) {
    this.client = client;
    this.subject = subject;
  }

  publish(data: any) {
    const convertedData = JSON.stringify(data);
    this.client.publish(this.subject, convertedData, () => {
      console.log(`Event published to channel ${this.subject}`);
    });
  }
}
