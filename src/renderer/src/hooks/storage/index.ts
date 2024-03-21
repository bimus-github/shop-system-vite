/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Product_Type } from '../../models/types'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../functions/product'
import { Message_Forms } from '../../models/message'

export const useGetProductsInStorage = () => {
  return useQuery<Product_Type[], Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const products: Product_Type[] = await getProducts()

      return products
    }
  })
}

export function useRefetchProducts() {
  const queryClient = useQueryClient()
  return async () => {
    const products = await getProducts()
    queryClient.setQueryData(['products'], products)
  }
}

export function useCreateProductToStorage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newProduct: Product_Type) => {
      const result: { message: Message_Forms } = await createProduct(newProduct)

      if (result.message === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['products'], (prevProducts: Product_Type[]) => [
          ...prevProducts,
          newProduct
        ])
      } else {
        return result.message
      }
    }
  })
}

export function useDeleteProductFromStorage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (productId: string) => {
      const result = await deleteProduct(productId)

      if (result) {
        queryClient.setQueryData(['products'], (prevProducts: Product_Type[]) =>
          prevProducts?.filter((product: Product_Type) => product.id !== productId)
        )
      } else {
        return 'Xatolik yuz berdi'
      }
    }
  })
}

export function useUpdateProductInStorage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (product: Product_Type) => {
      const { message }: { message: Message_Forms } = await updateProduct(product)
      if (message === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['products'], (prevProducts: Product_Type[]) =>
          prevProducts?.map((p: Product_Type) => (p.id === product.id ? product : p))
        )
      } else {
        return message
      }
    }
  })
}
