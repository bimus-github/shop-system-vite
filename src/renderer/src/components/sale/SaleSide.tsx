/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo, useState, useTransition } from 'react'
import {
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { Box, IconButton, TextField, Tooltip } from '@mui/material'
import { Delete } from '@mui/icons-material'
import { Saled_Product_Type } from '../../models/types'
import {
  useDeleteProductFromRoom,
  useGetRoomProducts,
  useUpdateProductInRoom
} from '../../hooks/room'
import { langFormat } from '../../functions/langFormat'

const SaledProductsList = ({ currentPage }: { currentPage: number }): JSX.Element => {
  const transition = useTransition()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  //call READ hook
  const {
    data: fetchedProducts,
    isError: isLoadingProductsError,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts
  } = useGetRoomProducts(currentPage.toString())
  //call UPDATE hook
  const { mutateAsync: updateproducts, isPending: isUpdatingproducts } = useUpdateProductInRoom(
    currentPage.toString()
  )
  //call DELETE hook
  const { mutateAsync: deleteproducts, isPending: isDeletingproducts } = useDeleteProductFromRoom(
    currentPage.toString()
  )

  const columns = useMemo<MRT_ColumnDef<Saled_Product_Type>[]>(
    () => [
      {
        accessorKey: 'barcode',
        header: langFormat({ uzb: 'Barkod', ru: 'Баркод', en: 'Barcode' }),
        enableEditing: false,
        size: 100
      },
      {
        accessorKey: 'name',
        header: langFormat({ uzb: 'Nomi', ru: 'Название', en: 'Name' }),
        enableEditing: false,
        size: 100
      },
      {
        accessorKey: 'saled_price',
        header: langFormat({ uzb: 'Narxi', ru: 'Цена', en: 'Price' }),
        size: 80,
        enableEditing: false,

        Cell({ cell, row }) {
          return (
            <TextField
              value={cell.getValue() === 0 ? '' : cell.getValue()}
              type="text"
              variant="outlined"
              size="small"
              onChange={(e) => {
                transition[1](() => {
                  updateproducts({
                    id: row.original.id,
                    saledId: row.original.saledId,
                    buyers_name: row.original.buyers_name,
                    discount: row.original.discount,
                    saled_date: row.original.saled_date,
                    saled_price: typeof +e.target.value === 'number' ? +e.target.value : 0,
                    saled_count: row.original.saled_count,
                    name: row.original.name,
                    price: row.original.price,
                    cost: row.original.cost,
                    count: row.original.count,
                    barcode: row.original.barcode,
                    sale_form: row.original.sale_form
                  })
                })
              }}
            />
          )
        }
      },
      {
        accessorKey: 'saled_count',
        header: langFormat({ uzb: 'Soni', ru: 'Количество', en: 'Count' }),
        size: 50,
        enableEditing: false,
        Cell({ cell, row }) {
          return (
            <TextField
              value={cell.getValue() === 0 ? '' : cell.getValue()}
              type="text"
              variant="outlined"
              size="small"
              onChange={(e) => {
                transition[1](() => {
                  updateproducts({
                    id: row.original.id,
                    saledId: row.original.saledId,
                    buyers_name: row.original.buyers_name,
                    discount: row.original.discount,
                    saled_date: row.original.saled_date,
                    saled_price: row.original.saled_price,
                    saled_count:
                      typeof +e.target.value === 'number'
                        ? +e.target.value > row.original.count
                          ? row.original.count
                          : +e.target.value < 0
                            ? 0
                            : +e.target.value
                        : 0,
                    name: row.original.name,
                    price: row.original.price,
                    cost: row.original.cost,
                    count: row.original.count,
                    barcode: row.original.barcode,
                    sale_form: row.original.sale_form
                  })
                })
              }}
            />
          )
        }
      }
    ],
    [validationErrors]
  )

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Saled_Product_Type>) => {
    deleteproducts(row.original.id)
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedProducts || [],
    enableGlobalFilter: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableRowActions: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    muiTableBodyRowProps: ({ row }) => ({
      sx:
        row.original.count === 0 ||
        row.original.saled_count === 0 ||
        row.original.count < row.original.saled_count
          ? {
              bgcolor: 'warning.light'
            }
          : {}
    }),
    muiToolbarAlertBannerProps: isLoadingProductsError
      ? {
          color: 'error',
          children: langFormat({ uzb: 'Xatolik', ru: 'Ошибка', en: 'Error' })
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        height: '90%'
      }
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    positionActionsColumn: 'last',
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title={langFormat({ uzb: 'O`chirish', ru: 'Удалить', en: 'Delete' })}>
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <Delete sx={{ color: 'red' }} />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isLoadingProducts,
      isSaving: isUpdatingproducts || isDeletingproducts,
      showAlertBanner: isLoadingProductsError,
      showProgressBars: isFetchingProducts
    }
  })

  return <MaterialReactTable table={table} />
}

export default SaledProductsList
