import { useCallback, useEffect, useState } from 'react'
import { Box, Divider } from '@mui/material'
import Pagination from '../../components/pagination'
import { SaleSide, SearchSide } from '../../components/sale'
import { useGetRoomProducts, useResetRoom } from '../../hooks/room'
import { useCreateSaledProduct } from '../../hooks/sale'
import { Saled_Product_Type, SALE_FORM, Refund_Type } from '../../models/types'
import { useCreateRefund } from '../../hooks/refunds'
import toast from 'react-hot-toast'
import { langFormat } from '@renderer/functions/langFormat'

function Sale(): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { refetch } = useGetRoomProducts(currentPage.toString())

  const { mutateAsync: createSale } = useCreateSaledProduct()
  const { mutateAsync: resetRoom } = useResetRoom(currentPage.toString())
  const { mutateAsync: createRefund } = useCreateRefund()

  const handleSale = useCallback(
    async (
      products: Saled_Product_Type[],
      discount: number,
      buyerName: string,
      saleForm: SALE_FORM
    ) => {
      const saledProducts = products.map(
        (p: Saled_Product_Type) =>
          ({
            discount,
            buyers_name: buyerName,
            sale_form: saleForm,
            barcode: p.barcode,
            saled_count: p.saled_count,
            cost: p.cost,
            saled_price: p.saled_price,
            saled_date: p.saled_date,
            name: p.name,
            price: p.price,
            saledId: p.saledId,
            count: p.count,
            id: p.id
          }) as Saled_Product_Type
      )

      if (
        saledProducts.find(
          (p) => p.saled_count === 0 || p.saled_count < 0 || p.cost === 0 || p.saled_count > p.count
        )
      ) {
        return
      }

      saledProducts.forEach(async (p) => {
        await createSale(p)
      })

      await resetRoom()
      await refetch()
      toast.success(langFormat({ uzb: 'Sotildi', en: 'Sold', ru: 'Продано' }))
    },
    [createSale, resetRoom, refetch]
  )

  const handleRefund = useCallback(
    async (products: Saled_Product_Type[]) => {
      if (
        products.find(
          (p) =>
            p.saled_count === 0 ||
            p.saled_count < 0 ||
            p.cost === 0 ||
            p.saled_count > p.count ||
            p.saled_price === 0 ||
            p.saled_price < 0
        )
      )
        return

      const refundedProducts: Refund_Type[] = products.map(
        (p: Saled_Product_Type) =>
          ({
            count: p.saled_count,
            id: p.id,
            name: p.name,
            price: p.cost,
            barcode: p.barcode,
            date: new Date().toDateString()
          }) as Refund_Type
      )

      refundedProducts.forEach(async (p) => {
        await createRefund(p)
      })

      await resetRoom()
      await refetch()
      toast.success(langFormat({ uzb: 'Qaytardi', en: 'Returned', ru: 'Возвращено' }))
    },
    [resetRoom, refetch, createRefund]
  )

  useEffect(() => {
    refetch()
  }, [currentPage, refetch])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 0.01fr 1fr',
        height: '80vh',
        gap: 2
      }}
    >
      <SearchSide handleSale={handleSale} handleRefund={handleRefund} currentPage={currentPage} />
      <Divider orientation="vertical" flexItem />
      <SaleSide currentPage={currentPage} />
      <Pagination setCurrentPage={setCurrentPage} />
    </Box>
  )
}

export default Sale
