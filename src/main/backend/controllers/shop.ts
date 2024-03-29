/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Product_Type, Shop_Type } from '../../models/types'
import ShopModel from '../schemas/shopModel'
import { addToStock, deleteFromStok, updateToStok } from './product'
import fs from 'fs'

export const createShop = async (shop: Shop_Type) => {
  try {
    const result = await ShopModel.create(shop)

    if (!result) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const getShops = async () => {
  try {
    const result = await ShopModel.find().sort({ date: -1 })

    return result.map((shop) => JSON.parse(JSON.stringify(shop))) as Shop_Type[]
  } catch (error) {
    console.log(error)
    return []
  }
}

export const updateShopInfo = async (shop: Shop_Type) => {
  try {
    const result = await ShopModel.updateOne({ id: shop.id }, shop)

    if (!result.matchedCount) return Message_Forms.NOT_FOUND

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteShop = async (id: string) => {
  try {
    const shop = await ShopModel.findOne({ id })

    if (!shop) return Message_Forms.NOT_FOUND

    shop.products.forEach(async (p: Product_Type) => {
      await deleteFromStok(p)
    })

    const result = await ShopModel.deleteOne({ id })

    if (!result.deletedCount) return Message_Forms.ERROR

    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const addProductToShop = async (shopId: string, product: Product_Type) => {
  try {
    const shop = await ShopModel.findOne({ id: shopId })

    if (!shop) return Message_Forms.NOT_FOUND

    const check = JSON.parse(JSON.stringify(shop)).products.find(
      (p: Product_Type) => p.id === product.id
    )

    if (!check) {
      const result = await ShopModel.updateOne({ id: shopId }, { $push: { products: product } })

      if (!result.modifiedCount) return Message_Forms.ERROR

      const resultFromStock = await addToStock(product)
      return resultFromStock
    } else {
      const newProducts = JSON.parse(JSON.stringify(shop)).products.map((p: Product_Type) => {
        if (p.id === product.id) {
          return { ...product, count: +p.count + +product.count }
        } else {
          return p
        }
      })

      const result = await ShopModel.updateOne({ id: shopId }, { $set: { products: newProducts } })

      if (!result.modifiedCount) return Message_Forms.ERROR

      const resultFromStock = await addToStock(product)
      return resultFromStock
    }
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateProductFromShop = async (shopId: string, product: Product_Type) => {
  try {
    const shop = await ShopModel.findOne({ id: shopId })

    if (!shop) return Message_Forms.NOT_FOUND

    const check = JSON.parse(JSON.stringify(shop)).products.find(
      (p: Product_Type) => p.id === product.id
    )

    if (!check) return Message_Forms.NOT_FOUND

    const newProducts = JSON.parse(JSON.stringify(shop)).products.map((p: Product_Type) => {
      if (p.id === product.id) {
        return product
      } else {
        return p
      }
    })

    const result = await ShopModel.updateOne({ id: shopId }, { $set: { products: newProducts } })

    if (!result.modifiedCount) return Message_Forms.ERROR
    const resultFromStok = await updateToStok(check, product)
    return resultFromStok
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteProductFromShop = async (shopId: string, productId: string) => {
  try {
    const shop = await ShopModel.findOne({ id: shopId })

    if (!shop) return Message_Forms.NOT_FOUND

    const existingProduct = JSON.parse(JSON.stringify(shop)).products.find(
      (p: Product_Type) => p.id === productId
    )

    if (!existingProduct) return Message_Forms.NOT_FOUND

    const newProducts = JSON.parse(JSON.stringify(shop)).products.filter(
      (p: Product_Type) => p.id !== productId
    )

    const result = await ShopModel.updateOne({ id: shopId }, { $set: { products: newProducts } })

    if (!result.modifiedCount) return Message_Forms.ERROR
    const resultFromStok = await deleteFromStok(existingProduct)
    return resultFromStok
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const getProductsInShop = async (shopId: string) => {
  try {
    const shop = await ShopModel.findOne({ id: shopId })

    if (!shop) return []

    return JSON.parse(JSON.stringify(shop)).products || []
  } catch (error) {
    console.log(error)
    return []
  }
}

export const addAllShop = async () => {
  try {
    const res = fs.readdirSync(
      '/Users/sardorbekaminjonov/Madaminjon/electron apps/shop-system-mdb-vite/data',
      {
        withFileTypes: true
      }
    )

    res.forEach(async (file) => {
      if (file.isFile()) {
        const res = fs.readFileSync(
          `/Users/sardorbekaminjonov/Madaminjon/electron apps/shop-system-mdb-vite/data/${file.name}`,
          'utf-8'
        )

        const shop = JSON.parse(res).shop

        const newShop: Shop_Type = {
          id: shop.id,
          name: shop.name,
          date: shop.date,
          loan_price: 0,
          phone: shop.tel,
          products: shop.products.map(
            (p) =>
              ({
                barcode: p.code,
                name: p.name,
                cost: p.commingPrice,
                count: p.count,
                id: p.id,
                price: p.salePrice
              }) as Product_Type
          )
        }

        await ShopModel.create(newShop)
      }
    })
  } catch (error) {
    console.log(error)
  }
}
