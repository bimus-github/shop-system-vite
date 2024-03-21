/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { Product_Type, Shop_Type } from '../../models/types'
import {
  addProductToShop,
  createShop,
  deleteProductFromShop,
  deleteShop,
  getProductsInShop,
  getShops,
  updateProductFromShop,
  updateShopInfo
} from '../controllers/shop'

export const shopRoutes = () => {
  ipcMain.handle(IpcChannels.CREATE_SHOP, async (_event, shop: Shop_Type) => {
    const result = await createShop(shop)

    return result
  })

  ipcMain.handle(IpcChannels.GET_SHOPS, async () => {
    const shops = await getShops()

    return shops
  })

  ipcMain.handle(IpcChannels.DELETE_SHOP, async (_event, id: string) => {
    const result = await deleteShop(id)

    return result
  })

  ipcMain.handle(
    IpcChannels.UPDATE_PRODUCT_FROM_SHOP,
    async (_event, data: { shopId: string; product: Product_Type }) => {
      const result = await updateProductFromShop(data.shopId, data.product)

      return result
    }
  )

  ipcMain.handle(
    IpcChannels.DELETE_PRODUCT_FROM_SHOP,
    async (_event, data: { productId: string; shopId: string }) => {
      const result = await deleteProductFromShop(data.shopId, data.productId)

      return result
    }
  )

  ipcMain.handle(IpcChannels.UPDATE_SHOP, async (_event, shop: Shop_Type) => {
    const result = await updateShopInfo(shop)

    return result
  })

  ipcMain.handle(
    IpcChannels.CREATE_PRODUCT_TO_SHOP,
    async (_event, data: { shopId: string; product: Product_Type }) => {
      const result = await addProductToShop(data.shopId, data.product)

      return result
    }
  )

  ipcMain.handle(IpcChannels.GET_PRODUCTS_FROM_SHOP, async (_e, shopId) => {
    const result = await getProductsInShop(shopId)

    return result
  })
}
