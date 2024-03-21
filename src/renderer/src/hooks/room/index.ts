import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addProductToRoom,
  deleteProductFromRoom,
  getRoomProducts,
  resetRoom,
  updateProductInRoom,
} from "../../functions/room";
import { Saled_Product_Type } from "../../models/types";
import { Message_Forms } from "../../models/message";

export const useAddProductToRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Saled_Product_Type) => {
      const result: Message_Forms = await addProductToRoom(roomId, product);

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInSaleRoom"],
          (prevProducts: Saled_Product_Type[]) => [...prevProducts, product]
        );
      } else {
        return result;
      }
    },
  });
};

export const useDeleteProductFromRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const result: Message_Forms = await deleteProductFromRoom(
        roomId,
        productId
      );

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInSaleRoom"],
          (prevProducts: Saled_Product_Type[]) => {
            return prevProducts.filter(
              (p: Saled_Product_Type) => p.id !== productId
            );
          }
        );
      } else {
        return result;
      }
    },
  });
};

export const useResetRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const result: Message_Forms = await resetRoom(roomId);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["productsInSaleRoom"], []);
      } else {
        return result;
      }
    },
  });
};

export const useGetRoomProducts = (roomId: string) => {
  return useQuery<Saled_Product_Type[]>({
    queryKey: ["productsInSaleRoom"],
    queryFn: async () => {
      const products: Saled_Product_Type[] = await getRoomProducts(roomId);
      return products;
    },
  });
};

export const useUpdateProductInRoom = (roomId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Saled_Product_Type) => {
      const result: Message_Forms = await updateProductInRoom(roomId, product);

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInSaleRoom"],
          (prevProducts: Saled_Product_Type[]) =>
            prevProducts.map((p: Saled_Product_Type) =>
              p.id === product.id ? product : p
            )
        );
      } else {
        return result;
      }
    },
  });
};
