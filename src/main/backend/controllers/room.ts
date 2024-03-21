/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Saled_Product_Type } from '../../models/types'
import RoomModel from '../schemas/roomModel'

export const addProductToRoom = async (roomId: string, product: Saled_Product_Type) => {
  try {
    const room = await RoomModel.findOne({ id: roomId })

    if (room) {
      const check = JSON.parse(JSON.stringify(room)).products.find(
        (p: Saled_Product_Type) => p.id === product.id
      )

      if (!check) {
        const result = await RoomModel.updateOne({ id: roomId }, { $push: { products: product } })

        if (!result.modifiedCount) return Message_Forms.ERROR

        return Message_Forms.SUCCESS
      } else {
        const result = await RoomModel.updateOne(
          { id: roomId },
          { $set: { products: room.products.push(product) } }
        )

        if (!result.modifiedCount) return Message_Forms.ERROR

        return Message_Forms.SUCCESS
      }
    } else {
      const result = await RoomModel.create({
        id: roomId,
        products: [product]
      })
      if (!result) return Message_Forms.ERROR

      return Message_Forms.SUCCESS
    }
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteProductFromRoom = async (roomId: string, productId: string) => {
  try {
    const room = await RoomModel.findOne({ id: roomId })

    if (!room) return Message_Forms.NOT_FOUND

    const newProducts = JSON.parse(JSON.stringify(room)).products.filter(
      (p: Saled_Product_Type) => p.id !== productId
    )

    const result = await RoomModel.updateOne({ id: roomId }, { $set: { products: newProducts } })

    if (!result.modifiedCount) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const resetRoom = async (roomId: string) => {
  try {
    const room = await RoomModel.findOne({ id: roomId })
    if (!room) return Message_Forms.NOT_FOUND

    const result = await RoomModel.updateOne({ id: roomId }, { $set: { products: [] } })

    if (!result.modifiedCount) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateProductInRoom = async (roomId: string, product: Saled_Product_Type) => {
  try {
    const room = await RoomModel.findOne({ id: roomId })
    if (!room) return Message_Forms.NOT_FOUND

    const newProducts = room.products.map((p: Saled_Product_Type) => {
      if (p.id === product.id) {
        return product
      } else {
        return p
      }
    })

    const result = await RoomModel.updateOne({ id: roomId }, { $set: { products: newProducts } })

    if (!result.modifiedCount) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const getRoomProducts = async (roomId: string) => {
  try {
    const room = await RoomModel.findOne({ id: roomId })

    if (!room) return []

    return room.toJSON().products?.map((p) => p) || []
  } catch (error) {
    console.log(error)
    return []
  }
}
