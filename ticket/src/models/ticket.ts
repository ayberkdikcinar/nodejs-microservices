import mongoose, { Schema, Document, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

const build = (attr: ITicketAttr) => {
  return new Ticket(attr);
};
TicketSchema.set("versionKey", "version");
TicketSchema.statics.build = build;
TicketSchema.plugin(updateIfCurrentPlugin);
interface ITicketAttr {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends Document {
  title: string;
  price: number;
  userId: string;
  createdAt: Date;
  version: number;
  orderId?: string;
}
interface ITicket extends mongoose.Model<TicketDoc> {
  build(ticket: ITicketAttr): TicketDoc;
}

const Ticket = model<TicketDoc, ITicket>("Ticket", TicketSchema);

export { Ticket };
