import { CopyAll, Refresh } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { saveAllSelected } from '@renderer/functions/saveAllSelected'
import { useUpdateSaledProduct } from '@renderer/hooks/sale'
import { SALE_FORM, Saled_Product_Type } from '@renderer/models/types'
import { MRT_TableInstance } from 'material-react-table'

type Props = {
  table: MRT_TableInstance<Saled_Product_Type>
}
function TopToolbarCustomActions(props: Props): JSX.Element {
  const { table } = props

  const { mutateAsync: updateSaledProduct } = useUpdateSaledProduct()

  const handleSaveAll = (table: MRT_TableInstance<Saled_Product_Type>): void => {
    const selectedProducts = table.getSelectedRowModel().rows
    saveAllSelected(selectedProducts)
  }

  const handleChangeSelectedRows = async (
    table: MRT_TableInstance<Saled_Product_Type>
  ): Promise<void> => {
    if (
      !confirm(
        langFormat({
          uzb: "Barcha belgilangan qatorni sotuv shaklini o'chirmoqchimisiz?",
          en: 'Are you sure you want to change sale form of all selected rows?',
          ru: 'Вы уверены, что хотите изменить форму продажи для всех выбранных строк?'
        })
      )
    )
      return

    table.getSelectedRowModel().rows.forEach(async (row) => {
      const newSaleForm =
        row.original.sale_form === SALE_FORM.CASH
          ? SALE_FORM.CARD
          : row.original.sale_form === SALE_FORM.LOAN
            ? SALE_FORM.CASH
            : SALE_FORM.LOAN

      const saledProduct: Saled_Product_Type = {
        id: row.original.id,
        name: row.original.name,
        barcode: row.original.barcode,
        saled_count: row.original.saled_count,
        cost: row.original.cost,
        saled_price: row.original.saled_price,
        sale_form: newSaleForm,
        buyers_name: row.original.buyers_name,
        discount: row.original.discount,
        saled_date: row.original.saled_date,
        count: row.original.count,
        price: row.original.price,
        saledId: row.original.saledId
      }

      const result = await updateSaledProduct(saledProduct)

      if (!result) table.setRowSelection({})
    })
  }
  return (
    <Box sx={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', width: '100%' }}>
      {table.getSelectedRowModel().rows.length > 0 && (
        <>
          <Tooltip
            title={langFormat({
              uzb: 'Pul shaklini o`zgartirish',
              en: 'Change form of payment',
              ru: 'Изменить счет'
            })}
          >
            <IconButton onClick={() => handleChangeSelectedRows(table)}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={langFormat({
              uzb: 'Saqlash',
              en: 'Save',
              ru: 'Сохранить'
            })}
          >
            <IconButton onClick={() => handleSaveAll(table)}>
              <CopyAll />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  )
}

export default TopToolbarCustomActions
