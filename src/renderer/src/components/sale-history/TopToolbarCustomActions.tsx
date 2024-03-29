import { CopyAll, Refresh } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { saveAllSelected } from '@renderer/functions/saveAllSelected'
import { useUpdateSaledProduct } from '@renderer/hooks/sale'
import { SALE_FORM, Saled_Product_Type } from '@renderer/models/types'
import { MRT_TableInstance } from 'material-react-table'
import toast from 'react-hot-toast'

type Props = {
  table: MRT_TableInstance<Saled_Product_Type>
}
function TopToolbarCustomActions(props: Props): JSX.Element {
  const { table } = props

  const { mutateAsync: updateSaledProduct } = useUpdateSaledProduct()

  const handleSaveAll = (table: MRT_TableInstance<Saled_Product_Type>): void => {
    const selectedProducts = table.getSelectedRowModel().rows
    saveAllSelected(selectedProducts)
    toast.success(langFormat({ uzb: 'Saqlandi', ru: 'Сохранено', en: 'Saved' }))
  }

  const handleChangeSelectedRows = async (
    table: MRT_TableInstance<Saled_Product_Type>
  ): Promise<void> => {
    toast((t) => (
      <Box>
        <div>
          {langFormat({
            uzb: 'Pul shaklini o`zgartirildi',
            ru: 'Счет изменен',
            en: 'Form of payment changed'
          })}
        </div>
        <br />
        <Button onClick={() => toast.dismiss(t.id)}>
          {langFormat({ uzb: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' })}
        </Button>
        <Button
          color="error"
          onClick={async () => {
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
              toast.dismiss(t.id)
              const result = await toast.promise(updateSaledProduct(saledProduct), {
                loading: langFormat({ uzb: 'Saqlanmoqda', ru: 'Сохраняется', en: 'Saving' }),
                success: langFormat({ uzb: 'Saqlandi', ru: 'Сохранено', en: 'Saved' }),
                error: langFormat({ uzb: 'Xatolik yuz berdi', ru: 'Ошибка', en: 'Error' })
              })

              if (!result) table.setRowSelection({})
            })
          }}
        >
          {langFormat({ uzb: 'Saqlash', ru: 'Сохранить', en: 'Save' })}
        </Button>
      </Box>
    ))
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
