const { ipcRenderer } = window.require("electron");
import { Product_Type, Shop_Type } from "../models/types";
import { IpcChannels } from "../models/ipc-channels";

export const createShop = async (shop: Shop_Type) =>
  ipcRenderer.invoke(IpcChannels.CREATE_SHOP, shop);

export const getShops = async () => ipcRenderer.invoke(IpcChannels.GET_SHOPS);

export const deleteShop = async (id: string) =>
  ipcRenderer.invoke(IpcChannels.DELETE_SHOP, id);

export const updateShop = async (shop: Shop_Type) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_SHOP, shop);

export const updateProductFromShop = async (
  shopId: string,
  product: Product_Type
) =>
  ipcRenderer.invoke(IpcChannels.UPDATE_PRODUCT_FROM_SHOP, {
    shopId,
    product,
  });

export const deleteProductFromShop = async (
  shopId: string,
  productId: string
) =>
  ipcRenderer.invoke(IpcChannels.DELETE_PRODUCT_FROM_SHOP, {
    shopId,
    productId,
  });

export const addProductToShop = async (shopId: string, product: Product_Type) =>
  ipcRenderer.invoke(IpcChannels.CREATE_PRODUCT_TO_SHOP, { shopId, product });

export const getProductsFromShop = async (shopId: string) =>
  ipcRenderer.invoke(IpcChannels.GET_PRODUCTS_FROM_SHOP, shopId);
