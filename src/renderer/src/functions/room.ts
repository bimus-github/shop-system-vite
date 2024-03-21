/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IpcChannels } from '../models/ipc-channels'
import { Saled_Product_Type } from '../models/types'

const { ipcRenderer } = window.require('electron')

export const addProductToRoom = async (roomId: string, product: Saled_Product_Type) =>
  ipcRenderer.invoke(IpcChannels.CREATE_PRODUCT_TO_SALE_ROOM, {
    roomId,
    product
  })

export const getRoomProducts = async (roomId: string) =>
  ipcRenderer.invoke(IpcChannels.GET_ROOM_PRODUCTS, { roomId })

export const resetRoom = async (room: string) => ipcRenderer.invoke(IpcChannels.RESET_ROOM, room)

export const deleteProductFromRoom = async (roomId: string, productId: string) =>
  ipcRenderer.invoke(IpcChannels.REMOVE_PRODUCT_FROM_ROOM, {
    roomId,
    productId
  })

export const updateProductInRoom = async (roomId: string, product: Saled_Product_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_PRODUCT_FROM_ROOM, {
    roomId,
    product
  })
