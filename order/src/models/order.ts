import mongoose from "mongoose";
import { OrderStatus } from "../events/types/order-status";
import { TicketDocument } from "./ticket";
//The properties that are required to create a new Order
interface OrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

//The properties that an Order Document has.
interface OrderDocument extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDocument;
}

//The properties that an Order Model has.
interface IOrder extends mongoose.Model<OrderDocument> {
  build(attr: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
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

export const Order = mongoose.model<OrderDocument, IOrder>(
  "Order",
  orderSchema
);

orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};
