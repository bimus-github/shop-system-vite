/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { createRefund, deleteRefund, getRefunds } from '../controllers/refund'
import { Refund_Type } from '../../models/types'

export const refundRoutes = () => {
  ipcMain.handle(IpcChannels.GET_REFUNDS, async () => {
    const refunds = await getRefunds()
    return refunds
  })

  ipcMain.handle(IpcChannels.ADD_REFUND, async (_, refund: Refund_Type) => {
    const result = await createRefund(refund)
    return result
  })

  ipcMain.handle(IpcChannels.DELETE_REFUND, async (_, id: string) => {
    const result = await deleteRefund(id)
    return result
  })
}
