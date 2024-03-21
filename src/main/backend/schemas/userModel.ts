import mongoose from "mongoose";
import { User_Type } from "../../models/types";

const Schema = mongoose.Schema;

const UserSchema = new Schema<User_Type>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model<User_Type>("User", UserSchema);
