/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo, useState } from 'react'
import {
  MRT_ColumnDef,
  MRT_Row,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { Box, IconButton, Tooltip } from '@mui/material'
import { Delete, Edit } from '@mui/icons-material'
import { Saled_Product_Type } from '../../models/types'
import {
  useDeleteProductFromRoom,
  useGetRoomProducts,
  useUpdateProductInRoom
} from '../../hooks/room'
import { langFormat } from '../../functions/langFormat'

const SaledProductsList = ({ currentPage }: { currentPage: number }): JSX.Element => (
  <Table currentPage={currentPage} />
)

export default SaledProductsList

const Table = ({ currentPage }: { currentPage: number }): JSX.Element => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

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
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.saled_price,
          helperText: validationErrors.saled_price,
          onFocus: () => {
            delete validationErrors.saled_price
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'saled_count',
        header: langFormat({ uzb: 'Soni', ru: 'Количество', en: 'Count' }),
        size: 50,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.count,
          helperText: validationErrors.count,
          onFocus: () => {
            delete validationErrors.count
            setValidationErrors(validationErrors)
          }
        }
      }
    ],
    [validationErrors]
  )

  //call READ hook
  const {
    data: fetchedProducts = [],
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

  //UPDATE action
  const handleSaveproducts: MRT_TableOptions<Saled_Product_Type>['onEditingRowSave'] = async ({
    values,
    table,
    row
  }) => {
    const newValidationErrors = validateproducts(values)
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors as Record<string, string | undefined>)
      return
    }

    const updadetProduct: Saled_Product_Type = {
      id: row.original.id,
      saledId: row.original.saledId,
      buyers_name: row.original.buyers_name,
      discount: row.original.discount,
      saled_date: row.original.saled_date,
      saled_price: values.saled_price,
      barcode: row.original.barcode,
      cost: row.original.cost,
      count: values.saled_count,
      name: row.original.name,
      price: row.original.price,
      saled_count: values.saled_count,
      sale_form: row.original.sale_form
    }

    setValidationErrors({})
    await updateproducts(updadetProduct)
    table.setEditingRow(null)
  }

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Saled_Product_Type>) => {
    deleteproducts(row.original.id)
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedProducts,
    enableGlobalFilter: false,
    enablePagination: false,
    enableSorting: false,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableEditing: true,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    getRowId: (row) => row.id,
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
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
        minHeight: '100%',
        maxWidth: '100%'
      }
    },
    onEditingRowSave: handleSaveproducts,
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    positionActionsColumn: 'last',
    renderRowActions: ({ row, table }) => (
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
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <Delete />
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

const validateRequired = (value: string | number) => !!value.toString().length

function validateproducts(products: Saled_Product_Type) {
  return {
    saled_price: !validateRequired(products.saled_price.toString())
      ? langFormat({
          uzb: 'Sotilish narxi kiritish shart',
          ru: 'Укажите цену',
          en: 'Enter price'
        })
      : null,
    saled_count: !validateRequired(products.saled_count.toString())
      ? langFormat({
          uzb: 'Sotilish soni kiritish shart',
          ru: 'Укажите количество',
          en: 'Enter count'
        })
      : null
  }
}
