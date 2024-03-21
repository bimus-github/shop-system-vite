import { IpcChannels } from "../models/ipc-channels";
import { User_Type } from "../models/types";

const { ipcRenderer } = window.require("electron");

export const loginUser = async (user: User_Type) =>
  ipcRenderer.invoke(IpcChannels.LOGIN, user);

export const signupUser = async (user: User_Type) =>
  ipcRenderer.invoke(IpcChannels.SIGNUP, user);
