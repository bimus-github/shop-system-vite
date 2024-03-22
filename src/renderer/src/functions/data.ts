/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { ipcRenderer } = window.require('electron')
import { Data_Type, User_Type } from '../models/types'
import { IpcChannels } from '../models/ipc-channels'

export const getAllSavedDataOfUser = async (user: User_Type) =>
  ipcRenderer.invoke(IpcChannels.GET_ALL_SAVED_DATA, user)

export const saveDataToOnlineDatabase = async (user: User_Type) =>
  ipcRenderer.invoke(IpcChannels.SAVE_DATA_TO_ONLINE_STORAGE, user)

export const downloadDataFromOnlineDatabase = async (data: Data_Type) =>
  ipcRenderer.invoke(IpcChannels.DOWNLOAD_DATA_FROM_ONLINE_STORAGE, data)
