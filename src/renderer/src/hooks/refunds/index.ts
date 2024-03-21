import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product_Type, Refund_Type } from "../../models/types";
import { createRefund, deleteRefund, getRefunds } from "../../functions/refund";
import { Message_Forms } from "../../models/message";

export const useGetRefunds = () => {
  return useQuery<Refund_Type[]>({
    queryKey: ["refunds"],
    queryFn: async () => {
      const refunds: Refund_Type[] = await getRefunds();
      return refunds;
    },
  });
};

export const useCreateRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (refund: Refund_Type) => {
      const result = await createRefund(refund);

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["refunds"], (prevRefunds: Refund_Type[]) => [
          ...(prevRefunds || []),
          refund,
        ]);

        queryClient.setQueryData(["products"], (prevP: Refund_Type[]) => {
          return prevP.map((p: Refund_Type) => {
            if (p.id === refund.id) {
              return {
                ...p,
                count: p.count - refund.count,
              };
            }
            return p;
          });
        });
      } else {
        return result;
      }
    },
  });
};

export const useDeleteRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteRefund(id);

      if (result === Message_Forms.SUCCESS) {
        queryClient.setQueryData(["refunds"], (prevRefunds: Refund_Type[]) =>
          prevRefunds.filter((r: Refund_Type) => r.id !== id)
        );

        queryClient.setQueryData(["products"], (prevP: Product_Type[]) => {
          return prevP.map((p: Product_Type) => {
            if (p.id === id) {
              return {
                ...p,
                count: p.count + p.count,
              };
            }
            return p;
          });
        });
      } else {
        return result;
      }
    },
  });
};
