/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useLayoutEffect, useMemo, useState } from 'react'
import CustomTable from '../custom-table'
import { FormControl, TableCell, TableRow } from '@mui/material'
import { useGetSaledProducts } from '../../hooks/sale'
import { SALE_FORM } from '../../models/types'
import { langFormat } from '../../functions/langFormat'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

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
          uzb: 'Umumiy Nasiyalar Miqdori',
          en: 'Total loan',
          ru: 'Всего кредит'
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

const Body = ({ start, end }: { start: Dayjs; end: Dayjs }) => {
  const { data: allData } = useGetSaledProducts()

  const saledProducts = useMemo(() => {
    return allData?.filter(
      (p) =>
        dayjs(new Date(p.saled_date)).isAfter(start) && dayjs(new Date(p.saled_date)).isBefore(end)
    )
  }, [allData, start, end])

  const count = useMemo(
    () => saledProducts?.reduce((a, b) => a + b.saled_count, 0) || 0,
    [saledProducts]
  )
  const totalCommingCost = useMemo(
    () =>
      saledProducts
        ?.reduce((a, b) => a + b.saled_count * b.cost, 0)
        .toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0,
    [saledProducts]
  )
  const totalSellingCost = useMemo(
    () =>
      saledProducts
        ?.reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)
        .toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0,
    [saledProducts]
  )
  const totalLoan = useMemo(
    () =>
      saledProducts
        ?.filter((p) => p.sale_form === SALE_FORM.LOAN)
        ?.reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)
        .toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0,
    [saledProducts]
  )

  const totalProfit = useMemo(
    () =>
      saledProducts
        ?.reduce((a, b) => a + b.saled_count * (b.saled_price * (1 - b.discount / 100) - b.cost), 0)
        .toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0,
    [saledProducts]
  )

  return (
    <TableRow>
      <TableCell>
        {count} {langFormat({ uzb: 'ta', en: '', ru: '' })}
      </TableCell>
      <TableCell>
        {totalCommingCost} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalSellingCost} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalLoan} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {totalProfit} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
    </TableRow>
  )
}

const CustomTtitle = ({
  start,
  end,
  setEnd,
  setStart
}: {
  start: Dayjs | null
  end: Dayjs | null
  setStart: (newStart: Dayjs | null) => void
  setEnd: (newEnd: Dayjs | null) => void
}) => {
  return (
    <FormControl variant="standard" sx={{ display: 'flex', flexDirection: 'row', gap: 1, ml: 2 }}>
      <DatePicker
        label={langFormat({
          uzb: '...dan',
          en: 'from ...',
          ru: 'от ...'
        })}
        value={start}
        onChange={(newStart) => {
          newStart && localStorage.setItem('start-sale', newStart.format('DD/MM/YYYY'))
          setStart(newStart)
        }}
        sx={{ mr: 1, width: '200px' }}
      />
      <DatePicker
        label={langFormat({
          uzb: '...gacha',
          en: 'to ...',
          ru: 'до ...'
        })}
        value={end}
        onChange={(newEnd) => {
          newEnd && localStorage.setItem('end-sale', newEnd.format('DD/MM/YYYY'))
          setEnd(newEnd)
        }}
        sx={{ mr: 1, width: '200px' }}
      />
    </FormControl>
  )
}

function SaleReport() {
  const [start, setStart] = useState<Dayjs | null>(dayjs('2023-01-01'))
  const [end, setEnd] = useState<Dayjs | null>(dayjs(new Date()))

  useLayoutEffect(() => {
    const start = localStorage.getItem('start-sale')
    const end = localStorage.getItem('end-sale')
    if (start || end) {
      setStart(dayjs(start) as Dayjs)
      setEnd(dayjs(end) as Dayjs)
    }
  }, [])

  return (
    <CustomTable
      title={langFormat({
        uzb: 'Savdo tahrihi',
        en: 'Sale report',
        ru: 'Отчёт о продажах'
      })}
      tablebody={<Body start={start as Dayjs} end={end as Dayjs} />}
      tablehead={<Head />}
      customTitle={<CustomTtitle start={start} setStart={setStart} end={end} setEnd={setEnd} />}
    />
  )
}

export default SaleReport
