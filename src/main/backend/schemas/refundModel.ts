import mongoose from "mongoose";
import { Refund_Type } from "../../models/types";

const Schema = mongoose.Schema;

const refundSchema = new Schema<Refund_Type>({
  id: {
    type: String,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Refund", refundSchema);
