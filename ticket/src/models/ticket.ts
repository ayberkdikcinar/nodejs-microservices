import mongoose, { Schema, Document,model } from "mongoose";


const TicketSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    price: {
        type:Number,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    }

},{
    timestamps:true,
    toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }});

const build = (attr: ITicketAttr) =>{
    return new Ticket(attr);
};

TicketSchema.statics.build = build;


interface ITicketAttr {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends Document{
    title: string;
    price: number;
    userId: string;
    createdAt: Date;
    updateAt: Date;
}
interface ITicket extends mongoose.Model<TicketDoc> {
    build(ticket:ITicketAttr): TicketDoc;

}


const Ticket = model<TicketDoc,ITicket>('Ticket',TicketSchema);

export {Ticket};
