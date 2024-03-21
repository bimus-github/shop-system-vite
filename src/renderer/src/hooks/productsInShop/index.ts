import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product_Type } from "../../models/types";
import {
  addProductToShop,
  deleteProductFromShop,
  getProductsFromShop,
  updateProductFromShop,
} from "../../functions/shop";
import { Message_Forms } from "../../models/message";

export function useGetProductsInShop(id: string) {
  return useQuery<Product_Type[], Error>({
    queryKey: ["productsInShop"],
    queryFn: async () => {
      const products: Product_Type[] = await getProductsFromShop(id);
      return products;
    },
  });
}

export function useCreateNewProductToShop(shopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product_Type) => {
      const result: Message_Forms = await addProductToShop(shopId, product);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInShop"],
          (prevProducts: Product_Type[]) => [...prevProducts, product]
        );
      } else {
        return result;
      }
    },
  });
}

export function useUpdateProductFromShop(shopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product_Type) => {
      const result: Message_Forms = await updateProductFromShop(
        shopId,
        product
      );
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInShop"],
          (prevProducts: Product_Type[]) =>
            prevProducts.map((p: Product_Type) =>
              p.id === product.id ? product : p
            )
        );
      } else {
        return result;
      }
    },
  });
}

export function useDeleteProductFromShop(shopId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await deleteProductFromShop(shopId, productId);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(
          ["productsInShop"],
          (prevProducts: Product_Type[]) =>
            prevProducts.filter((p: Product_Type) => p.id !== productId)
        );
      } else {
        return result;
      }
    },
  });
}
