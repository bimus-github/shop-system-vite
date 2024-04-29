import { ContentCopy, Delete, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, Tooltip } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { useDeleteSaledProduct } from '@renderer/hooks/sale'
import { Saled_Product_Type } from '@renderer/models/types'
import { MRT_Cell, MRT_Row, MRT_TableInstance } from 'material-react-table'
import toast from 'react-hot-toast'

const { clipboard } = window.require('electron')

type Props = {
  cell: MRT_Cell<Saled_Product_Type, unknown>
  row: MRT_Row<Saled_Product_Type>
  staticRowIndex?: number | undefined
  table: MRT_TableInstance<Saled_Product_Type>
}

function RowActions(props: Props): JSX.Element {
  const { row, table } = props

  const { mutateAsync: deleteSaledProduct } = useDeleteSaledProduct()
  return (
    <Box sx={{ display: 'flex', gap: '1rem' }}>
      <Tooltip
        title={langFormat({
          uzb: 'Tahrirlash',
          ru: 'Редактировать',
          en: 'Edit'
        })}
      >
        <IconButton onClick={() => table.setEditingRow(row)}>
          <Edit />
        </IconButton>
      </Tooltip>
      <Tooltip title={langFormat({ uzb: 'O`chirish', ru: 'Удалить', en: 'Delete' })}>
        <IconButton
          color="error"
          onClick={async () => {
            toast((t) => (
              <Box>
                <div>
                  {langFormat({
                    uzb: 'O`chirishni istaysizmi?',
                    ru: 'Удалить?',
                    en: 'Delete?'
                  })}
                </div>
                <br />
                <Button onClick={() => toast.dismiss(t.id)}>
                  {langFormat({ uzb: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' })}
                </Button>
                <Button
                  color="error"
                  onClick={async () => {
                    toast.dismiss(t.id)
                    await toast.promise(deleteSaledProduct(row.original.saledId), {
                      loading: langFormat({ uzb: 'O`chirilmoqda', ru: 'Удаление', en: 'Deleting' }),
                      success: langFormat({ uzb: 'O`chirildi', ru: 'Удалено', en: 'Deleted' }),
                      error: langFormat({ uzb: 'O`chirishda xatolik', ru: 'Ошибка', en: 'Error' })
                    })
                  }}
                >
                  {langFormat({ uzb: 'O`chirish', ru: 'Удалить', en: 'Delete' })}
                </Button>
              </Box>
            ))
          }}
        >
          <Delete sx={{ color: 'red' }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title={langFormat({
          uzb: 'Nusha olish',
          en: 'Copy',
          ru: 'Копировать'
        })}
      >
        <IconButton
          onClick={async () => {
            const companyName = localStorage.getItem('username')
            const sale = row.original
            const text = `
Do'kon: ${companyName ?? 'BIMUS'}
        
Haridor: ${sale.buyers_name}
Sana: ${new Date(sale.saled_date).toLocaleDateString('uz-UZ', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
    
Mahsulot: ${sale.name}
Narx: ${sale.saled_price} so'm
Soni: ${sale.saled_count} ta
    
Jami narx: ${sale.saled_price * (1 - sale.discount / 100) * sale.saled_count} so'm
`

            toast.success(langFormat({ uzb: 'Nusxalandi', en: 'Copied', ru: 'Скопировано' }))
            clipboard.writeText(text)
          }}
        >
          <ContentCopy />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default RowActions
