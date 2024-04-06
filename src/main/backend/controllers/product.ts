/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Product_Type } from '../../models/types'
import ProductModel from '../schemas/productModel'
// import fs from 'fs'

const checkProduct = async (product: Product_Type) => {
  const checkProduct = await ProductModel.findOne({
    $or: [{ barcode: product.barcode }, { name: product.name }, { id: product.id }]
  })
  if (checkProduct) {
    return true
  } else {
    return false
  }
}

export const createProduct = async (product: Product_Type) => {
  try {
    // build regExp for barcode and name lowercase
    const checked = await checkProduct(product)

    if (checked) {
      return {
        message: Message_Forms.ALREADY_EXISTS
      }
    } else {
      await ProductModel.create(product)

      return {
        message: Message_Forms.SUCCESS
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async () => {
  try {
    const products = await ProductModel.find()
    return products.map((product) => JSON.parse(JSON.stringify(product)))
  } catch (error) {
    console.log(error)
  }
}

export const deleteProduct = async (id: string) => {
  try {
    await ProductModel.deleteOne({ id })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const updateProduct = async (product: Product_Type) => {
  try {
    await ProductModel.findOneAndReplace({ id: product.id }, product)

    return {
      message: Message_Forms.SUCCESS
    }
  } catch (error) {
    console.log(error)
    return {
      message: Message_Forms.ERROR
    }
  }
}

export const addToStock = async (newProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: newProduct.id }))
    ) as Product_Type

    if (existingProduct) {
      const existingCost = +existingProduct.cost
      const existingCount = +existingProduct.count
      const newCost = +newProduct.cost
      const newCount = +newProduct.count
      newProduct.cost =
        (existingCost * existingCount + newCost * newCount) / (existingCount + newCount)

      newProduct.count = existingCount + newCount
      newProduct.price = newProduct.price !== 0 ? newProduct.price : existingProduct.price

      await ProductModel.updateOne({ id: newProduct.id }, newProduct)
      return Message_Forms.SUCCESS
    } else {
      return Message_Forms.NOT_FOUND
    }
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateToStok = async (oldProduct: Product_Type, newProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: newProduct.id }))
    ) as Product_Type

    if (!existingProduct) {
      return Message_Forms.NOT_FOUND
    }

    const existingCost = +existingProduct.cost
    const existingCount = +existingProduct.count
    const newCost = +newProduct.cost
    const newCount = +newProduct.count
    const oldCost = +oldProduct.cost
    const oldCount = +oldProduct.count

    newProduct.count = existingCount + newCount - oldCount
    newProduct.cost =
      (existingCost * existingCount + newCost * newCount - oldCost * oldCount) /
      (existingCount + newCount - oldCount)

    await ProductModel.updateOne({ id: newProduct.id }, newProduct)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteFromStok = async (deletedProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: deletedProduct.id }))
    ) as Product_Type

    if (!existingProduct) {
      return Message_Forms.NOT_FOUND
    }

    const existingCost = +existingProduct.cost
    const existingCount = +existingProduct.count
    const deletedCost = +deletedProduct.cost
    const deletedCount = +deletedProduct.count

    existingProduct.count = existingCount - deletedCount <= 0 ? 0 : existingCount - deletedCount
    existingProduct.cost =
      existingCount - deletedCount <= 0
        ? 0
        : (existingCost * existingCount - deletedCost * deletedCount) /
          (existingCount - deletedCount)

    await ProductModel.updateOne({ id: deletedProduct.id }, existingProduct)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
  }
}

export const addAllProducts = async () => {
  try {
    // const res = fs.readFileSync(
    //   '/Users/sardorbekaminjonov/Madaminjon/electron apps/shop-system-mdb-vite/data/data.json',
    //   'utf-8'
    // )

    // const products = JSON.parse(res).products

    // const newProducts = products.map(
    //   (p) =>
    //     ({
    //       barcode: p.code,
    //       name: p.name,
    //       cost: p.commingPrice,
    //       count: p.count,
    //       id: p.id,
    //       price: p.salePrice
    //     }) as Product_Type
    // )

    // await ProductModel.insertMany(newProducts)

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}
