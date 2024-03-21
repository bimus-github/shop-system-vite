const { ipcRenderer } = window.require("electron");
import { IpcChannels } from "../models/ipc-channels";
import { Refund_Type } from "../models/types";

export const getRefunds = async () =>
  ipcRenderer.invoke(IpcChannels.GET_REFUNDS);

export const createRefund = async (refund: Refund_Type) =>
  ipcRenderer.invoke(IpcChannels.ADD_REFUND, refund);

export const deleteRefund = async (id: string) =>
  ipcRenderer.invoke(IpcChannels.DELETE_REFUND, id);
