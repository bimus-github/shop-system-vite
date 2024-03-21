import mongoose from "mongoose";
import { Saled_Product_Type } from "../../models/types";
import { saledProdutSchema } from "./dataModel";

export default mongoose.model<Saled_Product_Type>("Sale", saledProdutSchema);
