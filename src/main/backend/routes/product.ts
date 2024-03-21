/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product'
import { Product_Type } from '../../models/types'

export const productRoutes = () => {
  ipcMain.handle(IpcChannels.GET_PRODUCTS, async () => {
    const products = await getProducts()

    return products
  })

  ipcMain.handle(IpcChannels.CREATE_PRODUCT, async (_event, product: Product_Type) => {
    const result = await createProduct(product)

    return result
  })

  ipcMain.handle(IpcChannels.DELETE_PRODUCT, async (_event, id: string) => {
    const result = await deleteProduct(id)

    return result
  })

  ipcMain.handle(IpcChannels.UPDATE_PRODUCT, async (_event, product: Product_Type) => {
    const result = await updateProduct(product)

    return result
  })
}
