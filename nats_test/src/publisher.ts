import nats from "node-nats-streaming";
import TicketCreatedPublisher from "./events/ticket-created-publisher";
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("publisher connected.");
  const publisher = new TicketCreatedPublisher(stan);
  publisher.publish({ id: "123", title: "test", price: 5 });
});

stan.on("disconnect", () => {
  console.log("publisher disconnected.");
});
