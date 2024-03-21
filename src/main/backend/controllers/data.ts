/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose'
import { Message_Forms } from '../../models/message'
import { Data_Type, Saled_Product_Type, User_Type } from '../../models/types'
import dataModel from '../schemas/dataModel'
import { findUser } from './user'
import { getClients } from './client'
import { getProducts } from './product'
import { getShops } from './shop'
import { getSaledProducts } from './saledProduct'
import { getAllMoney } from './money'
import { getRefunds } from './refund'
import clientModel from '../schemas/clientModel'
import productModel from '../schemas/productModel'
import shopModel from '../schemas/shopModel'
import saledModel from '../schemas/saledModel'
import moneyModel from '../schemas/moneyModel'
import refundModel from '../schemas/refundModel'
import { mongodb_local, mongodb_online } from '../consts'

export const saveToOnlineDatabase = async (user: User_Type) => {
  try {
    const clinets = await getClients()
    const products = await getProducts()
    const shops = await getShops()
    const saledProducts: Saled_Product_Type[] = await getSaledProducts()
    const money = await getAllMoney()
    const redunds = await getRefunds()

    const data: Data_Type = {
      clients: clinets,
      products: products || [],
      shops: shops,
      saled_products: saledProducts,
      moneys: money,
      refunds: redunds,
      date: new Date().valueOf(),
      user: user
    }

    const result1 = await findUser(user)

    if (result1 !== Message_Forms.SUCCESS) return result1

    await mongoose.disconnect()
    await mongoose.connect(mongodb_online)
    await dataModel.create(data)

    const result3 = await dataModel
      .find({
        $and: [{ 'user.email': user.email }, { 'user.password': user.password }]
      })
      .sort({ date: -1 })

    if (result3.length > 5) {
      const deleted = await dataModel.deleteOne({
        $and: [{ 'user.email': user.email }, { 'user.password': user.password }],
        date: result3[5].date
      })
      await mongoose.disconnect()
      await mongoose.connect(mongodb_local)

      if (!deleted.deletedCount) {
        return Message_Forms.ERROR
      }

      return Message_Forms.SUCCESS
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

export const getAllSavedDataOfUser = async (user: User_Type) => {
  try {
    const result1 = await findUser(user)
    if (result1 !== Message_Forms.SUCCESS) {
      return result1
    }

    await mongoose.disconnect()
    await mongoose.connect(mongodb_online)
    const result = await dataModel
      .find({
        $and: [{ 'user.email': user.email }, { 'user.password': user.password }]
      })
      .sort({ date: -1 })
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)

    return JSON.parse(JSON.stringify(result))
  } catch (error) {
    console.log(error)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return Message_Forms.ERROR
  }
}

export const downloadData = async (data: Data_Type) => {
  try {
    const { clients, products, shops, saled_products, moneys, refunds } = data

    // first delete all
    await clientModel.deleteMany({})
    await productModel.deleteMany({})
    await shopModel.deleteMany({})
    await saledModel.deleteMany({})
    await moneyModel.deleteMany({})
    await refundModel.deleteMany({})

    // then insert new
    await clientModel.insertMany(clients)
    await productModel.insertMany(products)
    await shopModel.insertMany(shops)
    await saledModel.insertMany(saled_products)
    await moneyModel.insertMany(moneys)
    await refundModel.insertMany(refunds)

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}
