import mongoose from "mongoose";
import { Shop_Type } from "../../models/types";
import { productSchema } from "./dataModel";

const Schema = mongoose.Schema;

export const shopSchema = new Schema<Shop_Type>({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  id: {
    type: String,
    required: true,
  },
  loan_price: {
    type: Number,
  },
  products: [productSchema],
});

export default mongoose.model<Shop_Type>("Shop", shopSchema);
