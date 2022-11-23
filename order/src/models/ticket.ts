import { OrderStatus } from "@ayberkddtickets/common";
import mongoose from "mongoose";
import { Order } from "./order";

//The properties that are required to create a new Ticket
interface TicketAttributes {
  title: string;
  price: number;
}

//The properties that an Ticket Document has.
export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

//The properties that an Ticket Model has.
interface ITicket extends mongoose.Model<TicketDocument> {
  build(attr: TicketAttributes): TicketDocument;
}

const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

TicketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};

TicketSchema.methods.isReserved = async function () {
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.Pending, OrderStatus.Completed],
    },
  });

  return !!order;
};

export const Ticket = mongoose.model<TicketDocument, ITicket>(
  "Ticket",
  TicketSchema
);
