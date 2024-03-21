const { ipcRenderer } = window.require("electron");
import { IpcChannels } from "../models/ipc-channels";
import { Money_Type } from "../models/types";

export const getAllMoney = async () =>
  ipcRenderer.invoke(IpcChannels.GET_ALL_MONEY);

export const addMoney = async (money: Money_Type) =>
  ipcRenderer.invoke(IpcChannels.ADD_MONEY, money);

export const deleteMoney = async (id: string) =>
  ipcRenderer.invoke(IpcChannels.DELETE_MONEY, id);

export const updateMoney = async (money: Money_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_MONEY, money);
