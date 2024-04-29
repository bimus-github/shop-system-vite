/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Client_Type } from '../../models/types'
import { createClient, deleteClient, getClients, updateClient } from '../../functions/client'
import { Message_Forms } from '../../models/message'

export const useGetClients = () => {
  return useQuery<Client_Type[]>({
    queryKey: ['clients'],
    queryFn: async () => {
      const clients: Client_Type[] = await getClients()
      return clients || []
    },
    refetchOnWindowFocus: false
  })
}

export const useAddClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (client: Client_Type) => {
      const result = await createClient(client)

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['clients'], (prevClients: Client_Type[]) => [
          ...prevClients,
          client
        ])
      } else {
        return result
      }
    }
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (client: Client_Type) => {
      const result = await updateClient(client)
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['clients'], (prevClients: Client_Type[]) =>
          prevClients.map((c: Client_Type) => (c.id === client.id ? client : c))
        )
      } else {
        return result
      }
    }
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (client: Client_Type) => {
      const result = await deleteClient(client)
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(['clients'], (prevClients: Client_Type[]) =>
          prevClients.filter((c: Client_Type) => c.id !== client.id)
        )
      } else {
        return result
      }
    }
  })
}
