/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { ipcRenderer } = window.require('electron')
import { Product_Type } from '../models/types'
import { IpcChannels } from '../models/ipc-channels'

export const createProduct = async (product: Product_Type) =>
  ipcRenderer.invoke(IpcChannels.CREATE_PRODUCT, product)

export const getProducts = async () => ipcRenderer.invoke(IpcChannels.GET_PRODUCTS)

export const deleteProduct = async (id: string) =>
  ipcRenderer.invoke(IpcChannels.DELETE_PRODUCT, id)

export const updateProduct = async (product: Product_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_PRODUCT, product)
