/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { addMoney, deleteMoney, getAllMoney, updateMoney } from '../controllers/money'
import { Money_Type } from '../../models/types'

export const moneyRoutes = () => {
  ipcMain.handle(IpcChannels.GET_ALL_MONEY, async () => {
    const money = await getAllMoney()
    return money
  })

  ipcMain.handle(IpcChannels.ADD_MONEY, async (_event, money: Money_Type) => {
    const result = await addMoney(money)
    return result
  })

  ipcMain.handle(IpcChannels.DELETE_MONEY, async (_event, id: string) => {
    const result = await deleteMoney(id)
    return result
  })

  ipcMain.handle(IpcChannels.UPDATE_MONEY, async (_event, money: Money_Type) => {
    const result = await updateMoney(money)
    return result
  })
}
