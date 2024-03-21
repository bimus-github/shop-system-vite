/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo } from 'react'
import CustomTable from '../custom-table'
import { TableCell, TableRow } from '@mui/material'
import { useGetShops } from '../../hooks/shop'
import { langFormat } from '../../functions/langFormat'

const Head = () => {
  return (
    <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({ uzb: 'Soni', en: 'Count', ru: 'Количество' })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({
          uzb: 'Umumiy Maxsulotlar soni',
          en: 'Total products count',
          ru: 'Всего продукции'
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({
          uzb: 'Umumiy Qarz miqdori',
          en: 'Total loan',
          ru: 'Всего кредит'
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {' '}
        {langFormat({
          uzb: 'Umumiy Kelish Narxi',
          en: 'Total commming cost',
          ru: 'Всего приход'
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {' '}
        {langFormat({
          uzb: 'Umumiy Sotilish Narxi',
          en: 'Total selling cost',
          ru: 'Всего продаж'
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({
          uzb: 'Umumiy Foyda',
          en: 'Total profit',
          ru: 'Всего прибыль'
        })}
      </TableCell>
    </TableRow>
  )
}

const Body = () => {
  const { data: shops } = useGetShops()

  const count = useMemo(() => shops?.length || 0, [shops])
  const totalProducts = useMemo(
    () => shops?.reduce((a, b) => a + b.products?.reduce((a, b) => a + b.count, 0), 0) || 0,
    [shops]
  )
  const totalLoan = useMemo(() => shops?.reduce((a, b) => a + b.loan_price, 0) || 0, [shops])
  const totalCommingCost = useMemo(
    () =>
      shops?.reduce((a, b) => a + b.products?.reduce((a, b) => a + b.count * b.cost, 0), 0) || 0,
    [shops]
  )
  const totalSellingCost = useMemo(
    () =>
      shops?.reduce((a, b) => a + b.products?.reduce((a, b) => a + b.count * b.price, 0), 0) || 0,
    [shops]
  )
  const totalProfit = useMemo(
    () =>
      shops?.reduce(
        (a, b) => a + b.products?.reduce((a, b) => a + b.count * b.price - b.cost * b.count, 0),
        0
      ) || 0,
    [shops]
  )
  return (
    <TableRow>
      <TableCell>{count}</TableCell>
      <TableCell>
        {totalProducts} {langFormat({ uzb: 'ta', en: '', ru: '' })}
      </TableCell>
      <TableCell>
        {totalLoan} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalCommingCost} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalSellingCost} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalProfit} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
    </TableRow>
  )
}

function ShopReport() {
  return (
    <CustomTable
      title={langFormat({ uzb: 'Magazinlar', en: 'Shops', ru: 'Магазины' })}
      tablebody={<Body />}
      tablehead={<Head />}
    />
  )
}

export default ShopReport
