import CustomTable from '../custom-table'
import { TableCell, TableRow, Tooltip } from '@mui/material'
import { useGetShops } from '../../hooks/shop'
import { useGetAllMoney } from '../../hooks/money'
import { useGetSaledProducts } from '../../hooks/sale'
import { MONEY_REASON, SALE_FORM } from '../../models/types'
import { useGetRefunds } from '../../hooks/refunds'
import { langFormat } from '../../functions/langFormat'

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
        <>{langFormat({ uzb: 'Tikilgan', ru: 'Выдан', en: 'Taken' })}</>
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

  const putMoney = money
    ?.filter((m) => m.reason === MONEY_REASON.PUT)
    ?.reduce((a, b) => a + b.value, 0)
  const takenMoney = money
    ?.filter((m) => m.reason === MONEY_REASON.TAKE)
    ?.reduce((a, b) => a + b.value, 0)
  const myLoans = shops?.reduce((a, b) => a + b.loan_price, 0)
  const recived = shops?.reduce(
    (a, b) => a + b?.products.reduce((x, y) => x + y.count * y.cost, 0),
    0
  )
  const earned = saledProducts?.reduce(
    (a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100),
    0
  )
  const refunded = refunds?.reduce((a, b) => a + b.count * b.price, 0)
  const loans = saledProducts
    ?.filter((p) => p.sale_form === SALE_FORM.LOAN)
    ?.reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)

  return (
    <TableRow>
      <TableCell>
        {putMoney?.toLocaleString() || 0} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {takenMoney?.toLocaleString() || 0} {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {(putMoney &&
          takenMoney &&
          myLoans &&
          loans &&
          recived &&
          refunded &&
          earned &&
          (putMoney - takenMoney + myLoans - (recived - refunded) + earned)?.toLocaleString()) ||
          0}{' '}
        {langFormat({ uzb: "so'm", en: "so'm", ru: 'сум' })}
      </TableCell>
      <TableCell>
        {(putMoney &&
          takenMoney &&
          loans &&
          recived &&
          refunded &&
          earned &&
          (putMoney + earned - takenMoney - loans - (recived - refunded))?.toLocaleString()) ||
          0}{' '}
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
