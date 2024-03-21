import mongoose from "mongoose";
import {
  Client_Type,
  Data_Type,
  Product_Type,
  Saled_Product_Type,
  Shop_Type,
  User_Type,
} from "../../models/types";
import moneyModel from "./moneyModel";
import refundModel from "./refundModel";

const Schema = mongoose.Schema;

const userShema = new Schema<User_Type>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const productSchema = new Schema<Product_Type>({
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

const shopSchema = new Schema<Shop_Type>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  loan_price: {
    type: Number,
  },
  products: [productSchema],
});

export const saledProdutSchema = new Schema<Saled_Product_Type>({
  saledId: {
    type: String,
    required: true,
  },
  buyers_name: {
    type: String,
  },
  discount: {
    type: Number,
  },
  saled_count: {
    type: Number,
    required: true,
  },
  saled_date: {
    type: Number,
    required: true,
  },
  saled_price: {
    type: Number,
    required: true,
  },
  sale_form: {
    type: String,
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
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

export const clientsSchema = new Schema<Client_Type>({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  id: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const dataSchema = new Schema<Data_Type>({
  user: userShema,
  products: [productSchema],
  shops: [shopSchema],
  saled_products: [saledProdutSchema],
  clients: [clientsSchema],
  moneys: [moneyModel.schema],
  refunds: [refundModel.schema],
  date: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<Data_Type>("Data", dataSchema);
