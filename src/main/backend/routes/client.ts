import { ipcMain } from 'electron'
import { IpcChannels } from '../../models/ipc-channels'
import { createClient, deleteClient, getClients, updateClient } from '../controllers/client'
import { Client_Type } from '../../models/types'

export const clientRoutes = (): void => {
  ipcMain.handle(IpcChannels.GET_CLIENTS, async () => {
    const clients = await getClients()

    return clients
  })

  ipcMain.handle(IpcChannels.CREATE_CLIENT, async (_event, client: Client_Type) => {
    const result = await createClient(client)
    return result
  })

  ipcMain.handle(IpcChannels.DELETE_CLIENT, async (_event, client: Client_Type) => {
    const result = await deleteClient(client)
    return result
  })

  ipcMain.handle(IpcChannels.UPDATE_CLIENT, async (_event, client: Client_Type) => {
    const result = await updateClient(client)
    return result
  })
}
