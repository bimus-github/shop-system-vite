/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Shop_Type } from '../../models/types'
import { createShop, deleteShop, getShops, updateShop } from '../../functions/shop'
import { Message_Forms } from '../../models/message'

export function useCreateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newShop: Shop_Type) => {
      const result = await createShop(newShop)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['shops'], (prevShops: Shop_Type[]) => [
          ...(prevShops || []),
          newShop
        ])
      } else {
        return result
      }
    }
  })
}

export function useUpdateShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (shop: Shop_Type) => {
      const result = await updateShop(shop)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['shops'], (prevShops: Shop_Type[]) =>
          prevShops.map((s: Shop_Type) => (s.id === shop.id ? shop : s))
        )
      } else {
        return result
      }
    }
  })
}

export function useDeleteShop() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteShop(id)
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['shops'], (prevShops: Shop_Type[]) =>
          prevShops.filter((s: Shop_Type) => s.id !== id)
        )
      } else {
        return result
      }
    }
  })
}

export function useGetShops() {
  const queryClient = useQueryClient()
  return useQuery<Shop_Type[]>({
    queryKey: ['shops'],
    queryFn: async () => {
      const shops: Shop_Type[] = await getShops()
      return shops
    },
    initialData: () => queryClient.getQueryData(['shops']) as Shop_Type[]
  })
}
