import CustomTable from '../custom-table'
import { TableCell, TableRow, Tooltip } from '@mui/material'
import { useGetShops } from '../../hooks/shop'
import { useGetAllMoney } from '../../hooks/money'
import { useGetSaledProducts } from '../../hooks/sale'
import { MONEY_REASON, SALE_FORM } from '../../models/types'
import { useGetRefunds } from '../../hooks/refunds'
import { langFormat } from '../../functions/langFormat'
import { useMemo } from 'react'
import { useGetProductsInStorage } from '@renderer/hooks/storage'

const Head = (): JSX.Element => (
  <TableRow sx={{ bgcolor: 'primary.main', color: 'white' }}>
    <TableCell sx={{ fontWeight: 'bold' }}>
      <Tooltip
        title={langFormat({
          uzb: "Do'konga Tikilgan Umumiy Pul",
          ru: 'Всего выдано',
          en: 'Total put'
        })}
      >
        <>{langFormat({ uzb: 'Tikilgan', ru: 'Выдан', en: 'Put' })}</>
      </Tooltip>
    </TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>
      <Tooltip
        title={langFormat({
          uzb: 'Sarflangan Umumiy Pul',
          ru: 'Всего списано',
          en: 'Total taken'
        })}
      >
        <>{langFormat({ uzb: 'Sarflangan', ru: 'Списан', en: 'Taken' })}</>
      </Tooltip>
    </TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>
      <Tooltip title={langFormat({ uzb: 'Umumiy Puli', ru: 'Всего', en: 'Total' })}>
        <>{langFormat({ uzb: 'Umumiy', ru: 'Всего', en: 'Total' })}</>
      </Tooltip>
    </TableCell>
    <TableCell sx={{ fontWeight: 'bold' }}>
      <Tooltip title={langFormat({ uzb: 'Kassa Puli', ru: 'Всего', en: 'Total' })}>
        <>{langFormat({ uzb: 'Kassa', ru: 'Kassa', en: 'Kassa' })}</>
      </Tooltip>
    </TableCell>
  </TableRow>
)

const Body = (): JSX.Element => {
  const { data: shops } = useGetShops()
  const { data: money } = useGetAllMoney()
  const { data: saledProducts } = useGetSaledProducts()
  const { data: refunds } = useGetRefunds()
  const { data: productsInStorage } = useGetProductsInStorage()

  const putMoney = useMemo(
    () =>
      money?.filter((m) => m.reason === MONEY_REASON.PUT)?.reduce((a, b) => a + b.value, 0) || 0,
    [money]
  )
  const takenMoney = useMemo(
    () =>
      money?.filter((m) => m.reason === MONEY_REASON.TAKE)?.reduce((a, b) => a + b.value, 0) || 0,
    [money]
  )
  const myLoans = useMemo(() => shops?.reduce((a, b) => a + b.loan_price, 0) || 0, [shops])
  const recived = useMemo(
    () =>
      shops?.reduce((a, b) => a + b?.products.reduce((x, y) => x + y.count * y.cost, 0), 0) || 0,
    [shops]
  )
  const earned = useMemo(
    () =>
      saledProducts?.reduce(
        (a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100),
        0
      ) || 0,
    [saledProducts]
  )
  const refunded = useMemo(
    () => refunds?.reduce((a, b) => a + b.count * b.price, 0) || 0,
    [refunds]
  )
  const loans = useMemo(
    () =>
      saledProducts
        ?.filter((p) => p.sale_form === SALE_FORM.LOAN)
        ?.reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0) || 0,
    [saledProducts]
  )
  const storage = useMemo(
    () => productsInStorage?.reduce((a, b) => a + b.count * b.price, 0) || 0,
    [productsInStorage]
  )

  return (
    <TableRow>
      <TableCell>
        {putMoney?.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {takenMoney?.toLocaleString('ru-RU', { maximumFractionDigits: 0 }) || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {(putMoney - takenMoney + myLoans - (storage - refunded) + earned)?.toLocaleString(
          'ru-RU',
          { maximumFractionDigits: 0 }
        ) || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {(putMoney + earned - takenMoney - loans + myLoans - (recived - refunded))?.toLocaleString(
          'ru-RU',
          {
            maximumFractionDigits: 0
          }
        ) || 0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
    </TableRow>
  )
}

function OverallReport(): JSX.Element {
  return (
    <CustomTable
      title={langFormat({ uzb: 'Umumiy', en: 'Overall', ru: 'Все' })}
      tablebody={<Body />}
      tablehead={<Head />}
    />
  )
}

export default OverallReport
