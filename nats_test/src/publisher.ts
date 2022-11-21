import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connected.");
  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: "123",
      title: "test",
      price: 5,
      userId: "55555",
    });
  } catch (error) {
    console.log(error);
  }
});

stan.on("disconnect", () => {
  console.log("publisher disconnected.");
});
