/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Product_Type, Saled_Product_Type } from '../../models/types'
import {
  addSaledProduct,
  deleteSaledProduct,
  getSaledProducts,
  updateSaledProduct
} from '../../functions/sale'
import { Message_Forms } from '../../models/message'

export function useDeleteSaledProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const result: Message_Forms = await deleteSaledProduct(productId)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['saledProducts'], (prevProducts: Saled_Product_Type[]) =>
          prevProducts?.filter((product: Saled_Product_Type) => product.saledId !== productId)
        )
      } else {
        return result
      }
    }
  })
}

export function useUpdateSaledProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Saled_Product_Type) => {
      const result: Message_Forms = await updateSaledProduct(product)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['saledProducts'], (prevProducts: Saled_Product_Type[]) =>
          prevProducts.map((p: Saled_Product_Type) => (p.id === product.id ? product : p))
        )
      } else {
        return result
      }
    }
  })
}

export function useGetSaledProducts() {
  return useQuery<Saled_Product_Type[], Error>({
    queryKey: ['saledProducts'],
    queryFn: async () => {
      const products: Saled_Product_Type[] = await getSaledProducts()
      return products
    }
  })
}

//CREATE hook (post new product to api)
export function useCreateSaledProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Saled_Product_Type) => {
      const result: Message_Forms = await addSaledProduct(product)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['saledProducts'], (prevProducts: Saled_Product_Type[]) => [
          ...(prevProducts || []),
          product
        ])
        queryClient.setQueryData(['products'], (prevP: Product_Type[]) => {
          return prevP.map((p: Product_Type) => {
            if (p.id === product.id) {
              return {
                ...p,
                count: p.count - product.saled_count
              }
            }
            return p
          })
        })
      } else {
        return result
      }
    }
  })
}
