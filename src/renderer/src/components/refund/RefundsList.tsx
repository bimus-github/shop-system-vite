import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import { useMemo } from 'react'
import { Refund_Type } from '../../models/types'
import { useDeleteRefund, useGetRefunds } from '../../hooks/refunds'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { langFormat } from '../../functions/langFormat'
import toast from 'react-hot-toast'

function RefundsList(): JSX.Element {
  const columns = useMemo<MRT_ColumnDef<Refund_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Mahsulot nomi',
          ru: 'Название продукта',
          en: 'Product name'
        }),
        enableEditing: false,
        size: 150
      },
      {
        accessorKey: 'barcode',
        header: langFormat({
          uzb: 'Mahsulot barkodi',
          ru: 'Баркод продукта',
          en: 'Product barcode'
        }),
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'count',
        header: langFormat({
          uzb: 'Mahsulot soni',
          ru: 'Количество продукта',
          en: 'Product count'
        }),
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'price',
        header: langFormat({
          uzb: 'Mahsulot narxi',
          ru: 'Цена продукта',
          en: 'Product price'
        }),
        enableEditing: false,
        size: 80
      },
      {
        accessorKey: 'date',
        header: langFormat({
          uzb: 'Mahsulot sana',
          ru: 'Дата продукта',
          en: 'Product date'
        }),
        enableEditing: false,
        size: 80
      }
    ],
    []
  )

  const { data: refunds } = useGetRefunds()

  const { data: resultDeleting, mutateAsync: deleteRefund } = useDeleteRefund()

  const table = useMaterialReactTable({
    columns,
    data: refunds || [],
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableEditing: true,
    positionActionsColumn: 'last',
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip
          title={langFormat({
            uzb: 'Tahrirlash',
            ru: 'Редактировать',
            en: 'Edit'
          })}
        >
          <IconButton
            color="error"
            onClick={() => {
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

                      await toast.promise(deleteRefund(row.original.id), {
                        loading: langFormat({
                          uzb: 'O`chirilmoqda',
                          en: 'Deleting',
                          ru: 'Удаление'
                        }),
                        success: langFormat({ uzb: 'O`chirildi', en: 'Deleted', ru: 'Удалено' }),
                        error: langFormat({ uzb: 'O`chirishda xatolik', en: 'Error', ru: 'Ошибка' })
                      })
                    }}
                  >
                    {langFormat({ uzb: 'O`chirish', ru: 'Удалить', en: 'Delete' })}
                  </Button>
                </Box>
              ))
            }}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      showAlertBanner: !!resultDeleting
    },
    renderToolbarAlertBannerContent: () => {
      return <Typography color="error">{resultDeleting}</Typography>
    }
  })
  return <MaterialReactTable table={table} />
}

export default RefundsList
