import mongoose, { version } from "mongoose";
import { OrderStatus } from "@ayberkddtickets/common";
import { TicketDocument } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
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
  version: number;
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
      },
    },
  }
);

export const Order = mongoose.model<OrderDocument, IOrder>(
  "Order",
  orderSchema
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order(attributes);
};
