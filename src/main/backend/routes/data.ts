/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { downloadData, getAllSavedDataOfUser, saveToOnlineDatabase } from '../controllers/data'
import { Data_Type, User_Type } from '../../models/types'
import mongoose from 'mongoose'
import { mongodb_local } from '../consts'

export const dataRoutes = () => {
  ipcMain.handle(IpcChannels.GET_ALL_SAVED_DATA, async (_event, user: User_Type) => {
    const data = await getAllSavedDataOfUser(user)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return data
  })

  ipcMain.handle(IpcChannels.SAVE_DATA_TO_ONLINE_STORAGE, async (_event, user: User_Type) => {
    const result = await saveToOnlineDatabase(user)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return result
  })

  ipcMain.handle(IpcChannels.DOWNLOAD_DATA_FROM_ONLINE_STORAGE, async (_event, data: Data_Type) => {
    const result = await downloadData(data)
    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return result
  })
}
