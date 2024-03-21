/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Money_Type } from '../../models/types'
import moneyModel from '../schemas/moneyModel'

export const addMoney = async (money: Money_Type) => {
  try {
    const result = await moneyModel.create(money)
    if (!result) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms
  }
}

export const getAllMoney = async () => {
  try {
    const money = await moneyModel.find().sort({ date: -1 })
    return JSON.parse(JSON.stringify(money))
  } catch (error) {
    console.log(error)
  }
}

export const deleteMoney = async (id: string) => {
  try {
    const result = await moneyModel.deleteOne({ id })

    if (!result.deletedCount) return Message_Forms.ERROR
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateMoney = async (money: Money_Type) => {
  try {
    const result = await moneyModel.updateOne({ id: money.id }, money)

    if (!result.modifiedCount) return Message_Forms.ERROR
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}
