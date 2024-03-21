/* eslint-disable @typescript-eslint/explicit-function-return-type */
import CustomTable from '../custom-table'
import { TableCell, TableRow } from '@mui/material'
import { useGetProductsInStorage } from '../../hooks/storage'
import { langFormat } from '../../functions/langFormat'
import { useMemo } from 'react'

const Head = () => {
  return (
    <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({ uzb: 'Soni', en: 'Count', ru: 'Количество' })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
        {langFormat({
          uzb: 'Umumiy Kelish Narxi',
          en: 'Total commming cost',
          ru: 'Всего приход'
        })}
      </TableCell>
      <TableCell sx={{ fontWeight: 'bold' }}>
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
  const { data: products } = useGetProductsInStorage()

  const count = useMemo(() => products?.length || 0, [products])
  const totalCommingCost = useMemo(
    () => products?.reduce((a, b) => a + b.count * b.cost, 0) || 0,
    [products]
  )
  const totalSellingCost = useMemo(
    () => products?.reduce((a, b) => a + b.count * b.price, 0) || 0,
    [products]
  )
  const totalProfit = useMemo(
    () => products?.reduce((a, b) => a + b.count * (b.price - b.cost), 0) || 0,
    [products]
  )
  return (
    <TableRow>
      <TableCell>
        {count} {langFormat({ uzb: 'ta', en: '', ru: '' })}
      </TableCell>
      <TableCell>
        {totalCommingCost.toLocaleString() || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalSellingCost.toLocaleString() || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalProfit.toLocaleString() || 0} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
    </TableRow>
  )
}

function StorageReport() {
  return (
    <CustomTable
      title={langFormat({ uzb: 'Ombor', en: 'Storage', ru: 'Склад' })}
      tablebody={<Body />}
      tablehead={<Head />}
    />
  )
}

export default StorageReport
