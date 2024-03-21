/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Product_Type, Saled_Product_Type } from '../../models/types'
import ProductModel from '../schemas/productModel'
import SaledProductModel from '../schemas/saledModel'
import { addToStock } from './product'

export const getSaledProducts = async () => {
  try {
    const products = await SaledProductModel.find().sort({ saled_date: -1 })

    return JSON.parse(JSON.stringify(products))
  } catch (error) {
    console.log(error)
  }
}

export const addSaledProduct = async (product: Saled_Product_Type) => {
  try {
    const result1 = await ProductModel.updateOne(
      { id: product.id },
      {
        $inc: {
          count: -product.saled_count
        }
      }
    )
    if (!result1.modifiedCount) return Message_Forms.ERROR

    const result2 = await SaledProductModel.create(product)

    if (!result2) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
  }
}

export const updateSaledProduct = async (product: Saled_Product_Type) => {
  try {
    const result = await SaledProductModel.updateOne({ saledId: product.saledId }, product)
    if (!result.modifiedCount) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
  }
}

export const deleteSaledProduct = async (saledId: string) => {
  try {
    const saledProduct = await SaledProductModel.findOne({ saledId })
    if (!saledProduct) return Message_Forms.NOT_FOUND

    const result = await SaledProductModel.deleteOne({ saledId })
    if (!result.deletedCount) return Message_Forms.ERROR

    const product: Product_Type = {
      id: saledProduct.id,
      name: saledProduct.name,
      count: saledProduct.saled_count,
      barcode: saledProduct.barcode,
      cost: saledProduct.saled_price,
      price: saledProduct.price
    }

    const result3 = await addToStock(product)

    if (!result3) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
  }
}
