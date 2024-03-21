import mongoose from "mongoose";
import { Money_Type } from "../../models/types";

const Schema = mongoose.Schema;

const moneySchema = new Schema<Money_Type>({
  id: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  extraInfo: {
    type: String,
  },
});

export default mongoose.model<Money_Type>("Money", moneySchema);
