/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { User_Type } from '../../models/types'
import { createUser, findUser } from '../controllers/user'
import mongoose from 'mongoose'
import { mongodb_local } from '../consts'

export const userRoutes = () => {
  ipcMain.handle(IpcChannels.SIGNUP, async (_event, user: User_Type) => {
    const result = await createUser(user)

    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return result
  })

  ipcMain.handle(IpcChannels.LOGIN, async (_event, user: User_Type) => {
    const result = await findUser(user)

    await mongoose.disconnect()
    await mongoose.connect(mongodb_local)
    return result
  })
}
