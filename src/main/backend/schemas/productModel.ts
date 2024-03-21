import { Product_Type } from "../../models/types";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const productSchema = new Schema<Product_Type>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  barcode: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<Product_Type>("Product", productSchema);
