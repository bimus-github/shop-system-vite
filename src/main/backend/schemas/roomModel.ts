import mongoose from "mongoose";
import { Sale_Room_Type } from "../../models/types";
import { saledProdutSchema } from "./dataModel";

const Schema = mongoose.Schema;

const roomSchema = new Schema<Sale_Room_Type>({
  id: {
    type: String,
    required: true,
  },
  products: [saledProdutSchema],
});

export default mongoose.model<Sale_Room_Type>("Room", roomSchema);
