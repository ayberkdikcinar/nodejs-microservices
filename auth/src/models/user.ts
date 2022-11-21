import mongoose, { Schema, Document,model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
},{
    timestamps:true,
    toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
  }});

const build = (attr: IUserAttr) =>{
    return new User(attr);
};

UserSchema.statics.build = build;
UserSchema.pre('save',async function (done) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(this.get('password'),salt);
    this.set('password',hashedPassword);
    done();
})

interface IUserAttr {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

interface UserDoc extends Document{
    email:string;
    password:string;
    createdAt: Date;
    updateAt: Date;
}
interface IUser extends mongoose.Model<UserDoc> {
    build(user:IUserAttr): UserDoc;

}


const User = model<UserDoc,IUser>('User',UserSchema);

export {User};
