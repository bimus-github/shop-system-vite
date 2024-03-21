import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Money_Type } from "../../models/types";
import {
  addMoney,
  deleteMoney,
  getAllMoney,
  updateMoney,
} from "../../functions/money";
import { Message_Forms } from "../../models/message";

export const useGetAllMoney = () => {
  return useQuery<Money_Type[]>({
    queryKey: ["money"],
    queryFn: async () => {
      const money: Money_Type[] = await getAllMoney();
      return money;
    },
  });
};

export const useCreateMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (money: Money_Type) => {
      const result: Message_Forms = await addMoney(money);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["money"], (prevMoney: Money_Type[]) => [
          ...prevMoney,
          money,
        ]);
      } else {
        return result;
      }
    },
  });
};

export const useUpdateMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (money: Money_Type) => {
      const result: Message_Forms = await updateMoney(money);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["money"], (prevMoney: Money_Type[]) =>
          prevMoney.map((m: Money_Type) => (m.id === money.id ? money : m))
        );
      } else {
        return result;
      }
    },
  });
};

export const useDeleteMoney = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (moneyId: string) => {
      const result = await deleteMoney(moneyId);
      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["money"], (prevMoney: Money_Type[]) =>
          prevMoney.filter((m: Money_Type) => m.id !== moneyId)
        );
      } else {
        return result;
      }
    },
  });
};
