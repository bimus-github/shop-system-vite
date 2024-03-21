const { ipcRenderer } = window.require("electron");
import { IpcChannels } from "../models/ipc-channels";
import { Client_Type } from "../models/types";

export const createClient = async (client: Client_Type) =>
  ipcRenderer.invoke(IpcChannels.CREATE_CLIENT, client);

export const updateClient = async (client: Client_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_CLIENT, client);

export const deleteClient = async (client: Client_Type) =>
  ipcRenderer.invoke(IpcChannels.DELETE_CLIENT, client);

export const getClients = async () =>
  ipcRenderer.invoke(IpcChannels.GET_CLIENTS);
