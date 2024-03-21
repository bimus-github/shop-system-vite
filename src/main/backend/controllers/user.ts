/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose'
import { Message_Forms } from '../../models/message'
import { User_Type } from '../../models/types'
import UserModel from '../schemas/userModel'
import { mongodb_local, mongodb_online } from '../consts'

export const findUser = async (user: User_Type) => {
  try {
    await mongoose.disconnect()
    await mongoose.connect(mongodb_online)
    const checkUser = await UserModel.findOne({
      $and: [{ email: user.email }, { password: user.password }]
    })
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)

    if (!checkUser) {
      return Message_Forms.NOT_FOUND
    }

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return Message_Forms.ERROR
  }
}

export const createUser = async (user: User_Type) => {
  try {
    await mongoose.disconnect()
    const result1 = await mongoose.connect(mongodb_online)

    if (!result1) {
      await mongoose.disconnect()
      await mongoose.connect(mongodb_local)
      return Message_Forms.ERROR
    }

    const result2 = await UserModel.create(user)

    if (!result2) {
      await mongoose.disconnect()
      await mongoose.connect(mongodb_local)
      return Message_Forms.ERROR
    }

    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return Message_Forms.ERROR
  }
}
