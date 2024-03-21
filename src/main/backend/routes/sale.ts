/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { Saled_Product_Type } from '../../models/types'
import {
  addSaledProduct,
  deleteSaledProduct,
  getSaledProducts,
  updateSaledProduct
} from '../controllers/saledProduct'

export const saleRoutes = () => {
  ipcMain.handle(IpcChannels.GET_SALES, async () => {
    const sales = await getSaledProducts()
    return sales
  })

  ipcMain.handle(IpcChannels.ADD_SALE, async (_event, sale: Saled_Product_Type) => {
    const result = await addSaledProduct(sale)
    return result
  })

  ipcMain.handle(IpcChannels.DELETE_SALE, async (_event, id: string) => {
    const result = await deleteSaledProduct(id)
    return result
  })

  ipcMain.handle(IpcChannels.UPDATE_SALE, async (_event, sale: Saled_Product_Type) => {
    const result = await updateSaledProduct(sale)
    return result
  })
}
