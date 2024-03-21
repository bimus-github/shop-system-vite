/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import {
  addProductToRoom,
  deleteProductFromRoom,
  getRoomProducts,
  resetRoom,
  updateProductInRoom
} from '../controllers/room'
import { Saled_Product_Type } from '../../models/types'

export const roomRoutes = () => {
  ipcMain.handle(IpcChannels.GET_ROOM_PRODUCTS, async (_e, { roomId }: { roomId: string }) => {
    const result = await getRoomProducts(roomId)

    return result
  })

  ipcMain.handle(
    IpcChannels.CREATE_PRODUCT_TO_SALE_ROOM,
    async (_event, data: { roomId: string; product: Saled_Product_Type }) => {
      const result = await addProductToRoom(data.roomId, data.product)
      return result
    }
  )

  ipcMain.handle(
    IpcChannels.REMOVE_PRODUCT_FROM_ROOM,
    async (_e, data: { roomId: string; productId: string }) => {
      const result = await deleteProductFromRoom(data.roomId, data.productId)

      return result
    }
  )

  ipcMain.handle(
    IpcChannels.UPDATE_PRODUCT_FROM_ROOM,
    async (_e, data: { roomId: string; product: Saled_Product_Type }) => {
      const result = await updateProductInRoom(data.roomId, data.product)

      return result
    }
  )

  ipcMain.handle(IpcChannels.RESET_ROOM, async (_e, roomId: string) => {
    const result = await resetRoom(roomId)

    return result
  })
}
