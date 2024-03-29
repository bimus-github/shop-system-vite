import { Saled_Product_Type } from '@renderer/models/types'
import { MRT_Row } from 'material-react-table'
import { dateFormat } from './dateFormat'

export const saveAllSelected = async (rows: MRT_Row<Saled_Product_Type>[]): Promise<void> => {
  const seperatedRows = seperateRowsByBuyer(rows)

  const text = `

${Object.values(seperatedRows).map(
  (rowsByBuer) => `
Haridor: ${rowsByBuer[0].original.buyers_name}\n
Mahsulotlar:
${rowsByBuer
  .map(
    (row) =>
      `${row.original.name} - ${row.original.saled_count} ta - ${row.original.saled_price} sum donaga - ${row.original.discount ? row.original.discount + '% chegirma -' : ''}${row.original.sale_form} - ${dateFormat(
        row.original.saled_date
      )}\n`
  )
  .join('\n')}
Jami summa: ${rowsByBuer.reduce(
    (sum, row) =>
      sum + row.original.saled_price * row.original.saled_count * (1 - row.original.discount / 100),
    0
  )}

`
)}
${
  Object.values(seperatedRows).length >= 2
    ? `
Jami summa: ${rows.reduce(
        (sum, row) =>
          sum +
          row.original.saled_price * row.original.saled_count * (1 - row.original.discount / 100),
        0
      )}`
    : ''
}


`

  navigator.clipboard.writeText(text)
}

const seperateRowsByBuyer = (
  rows: MRT_Row<Saled_Product_Type>[]
): Record<string, MRT_Row<Saled_Product_Type>[]> => {
  return rows.reduce((acc, row) => {
    if (!acc[row.original.buyers_name]) {
      acc[row.original.buyers_name] = []
    }
    acc[row.original.buyers_name].push(row)
    return acc
  }, {})
}
