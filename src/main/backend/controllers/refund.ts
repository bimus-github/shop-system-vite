/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Product_Type, Refund_Type } from '../../models/types'
import RefundModel from '../schemas/refundModel'
import { addToStock, deleteFromStok } from './product'

export const createRefund = async (refund: Refund_Type) => {
  try {
    const result = await RefundModel.create(refund)

    if (!result) return Message_Forms.ERROR

    const product: Product_Type = {
      id: refund.id,
      name: refund.name,
      count: refund.count,
      barcode: refund.barcode,
      cost: refund.price,
      price: 0
    }

    const result2 = await deleteFromStok(product)

    return result2
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteRefund = async (id: string) => {
  try {
    const refund = await RefundModel.findOne({ id })
    if (!refund) return Message_Forms.NOT_FOUND
    const result = await RefundModel.deleteOne({ id })

    const product: Product_Type = {
      id: refund.id,
      name: refund.name,
      count: refund.count,
      barcode: refund.barcode,
      cost: refund.price,
      price: 0
    }
    if (!result.deletedCount) return Message_Forms.ERROR

    const result2 = await addToStock(product)

    return result2
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const getRefunds = async () => {
  try {
    const refunds = await RefundModel.find()
    return JSON.parse(JSON.stringify(refunds))
  } catch (error) {
    console.log(error)
  }
}
