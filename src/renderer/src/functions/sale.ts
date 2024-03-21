const { ipcRenderer } = window.require("electron");
import { Saled_Product_Type } from "../models/types";
import { IpcChannels } from "../models/ipc-channels";

export const getSaledProducts = async () =>
  ipcRenderer.invoke(IpcChannels.GET_SALES);

export const addSaledProduct = async (sale: Saled_Product_Type) =>
  ipcRenderer.invoke(IpcChannels.ADD_SALE, sale);

export const updateSaledProduct = async (sale: Saled_Product_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_SALE, sale);

export const deleteSaledProduct = async (id: string) =>
  ipcRenderer.invoke(IpcChannels.DELETE_SALE, id);
