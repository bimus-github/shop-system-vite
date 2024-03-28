/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { Shop_Type } from '../../models/types'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
  colors
} from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCreateShop, useDeleteShop, useGetShops, useUpdateShop } from '../../hooks/shop'
import { langFormat } from '../../functions/langFormat'
import toast from 'react-hot-toast'

function ShopsList(): JSX.Element {
  const navigate = useNavigate()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const columns = useMemo<MRT_ColumnDef<Shop_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({ uzb: 'Nomi', en: 'Name', ru: 'Название' }),
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          autoComplete: 'off',
          error: !!validationErrors.name,
          helperText: validationErrors.name,
          onFocus: () => {
            delete validationErrors.name
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'loan_price',
        header: langFormat({ uzb: 'Kredit', en: 'Loan', ru: 'Кредит' }),
        enableEditing: true,
        muiEditTextFieldProps: {
          variant: 'standard',
          autoComplete: 'off',
          error: !!validationErrors.loan_price,
          helperText: validationErrors.loan_price,
          onFocus: () => {
            delete validationErrors.loan_price
            setValidationErrors(validationErrors)
          }
        },
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.loan_price, 0)
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorFn: (row) => row?.products?.reduce((a, b) => a + b.count * b.cost, 0) || 0,
        header: langFormat({ uzb: 'Kelish Narxi', en: 'Cost', ru: 'Приход' }),
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              ?.rows?.reduce(
                (a, b) => a + b.original?.products?.reduce((x, y) => x + y.count * y.cost, 0),
                0
              )
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorFn: (row) =>
          row?.products?.reduce((a, b) => a + b.count * (b.price - b.cost), 0).toLocaleString() ||
          0,
        header: langFormat({ uzb: 'Foyda', en: 'Profit', ru: 'Прибыль' }),
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce(
                (a, b) =>
                  a + b.original?.products?.reduce((x, y) => x + y.count * (y.price - y.cost), 0),
                0
              )
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorKey: 'phone',
        header: langFormat({ uzb: 'Telefon', en: 'Phone', ru: 'Телефон' }),
        enableEditing: true,
        muiEditTextFieldProps: {
          variant: 'standard',
          autoComplete: 'off',
          error: !!validationErrors.phone,
          helperText: validationErrors.phone,
          onFocus: () => {
            delete validationErrors.phone
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'date',
        accessorFn: (row) =>
          new Date(row.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }),
        header: langFormat({ uzb: 'Sana', en: 'Date', ru: 'Дата' }),
        enableEditing: false
      }
    ],
    [validationErrors]
  )

  const { data: shops, isPending: isShopsPending, isError: isShopsError } = useGetShops()

  const {
    data: resultOfCreating,
    isPending: isCreating,
    isError: isCreatingError,
    mutateAsync: createShop
  } = useCreateShop()

  const {
    data: resultOfUpdating,
    isPending: isUpdating,
    isError: isUpdatingError,
    mutateAsync: updateProduct
  } = useUpdateShop()

  const {
    data: resultOfDeleting,
    isPending: isDeleting,
    isError: isDeletingError,
    mutateAsync: deleteProduct
  } = useDeleteShop()

  const handleCreateShop: MRT_TableOptions<Shop_Type>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateShop(values)

    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newShop: Shop_Type = {
      id: Math.random().toString(36).substring(7),
      name: values.name || '',
      phone: values.phone || '',
      date: new Date().valueOf(),
      loan_price: values.loan_price,
      products: []
    }

    createShop(newShop).then(() => {
      // claer row
      table.setCreatingRow(null)

      setTimeout(() => {
        table.setCreatingRow(true)
      }, 500)
    })
  }

  const handleSaveShop: MRT_TableOptions<Shop_Type>['onEditingRowSave'] = async ({
    values,
    table,
    row
  }) => {
    const newValidateErrors = validateShop(values)
    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const updatedProduct: Shop_Type = {
      id: row.original.id,
      name: row.original.name,
      date: new Date(row.original.date).valueOf(),
      loan_price: row.original.loan_price,
      phone: row.original.phone,
      products: row.original.products
    }

    const result = await updateProduct(updatedProduct)
    if (!result) table.setEditingRow(null)
  }

  const handleDeleteShop = async (id: string) => {
    toast((t) => (
      <Box>
        <div>
          {langFormat({
            uzb: 'Haqiqatdan ham o’chirmoqchimisiz?',
            en: 'Are you sure you want to delete it?',
            ru: 'Вы уверены, что хотите удалить?'
          })}
        </div>
        <br />
        <Button onClick={() => toast.dismiss(t.id)}>
          {langFormat({ uzb: 'Bekor qilish', en: 'Cancel', ru: 'Отмена' })}
        </Button>
        <Button
          color="error"
          onClick={async () => {
            toast.dismiss(t.id)
            await toast.promise(deleteProduct(id), {
              loading: langFormat({ uzb: 'O`chirilmoqda', en: 'Deleting', ru: 'Удаление' }),
              success: langFormat({ uzb: 'O`chirildi', en: 'Deleted', ru: 'Удалено' }),
              error: langFormat({ uzb: 'O`chirishda xatolik', en: 'Error', ru: 'Ошибка' })
            })
          }}
        >
          {langFormat({ uzb: 'O`chirish', en: 'Delete', ru: 'Удалить' })}
        </Button>
      </Box>
    ))
  }

  const table = useMaterialReactTable({
    columns,
    data: shops || [],
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnFilterModes: false,
    enableBottomToolbar: false,
    enableEditing: true,
    enableRowNumbers: true,
    createDisplayMode: 'row',
    onCreatingRowSave: handleCreateShop,
    editDisplayMode: 'row',
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    onEditingRowSave: handleSaveShop,
    positionActionsColumn: 'last',
    muiTableContainerProps: {
      sx: {
        minHeight: '80vh',
        maxWidth: '100%'
      }
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip
          title={langFormat({
            uzb: 'Tahrirlash',
            en: 'Edit',
            ru: 'Редактировать'
          })}
        >
          <IconButton onClick={() => table.setEditingRow(row)}>
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title={langFormat({ uzb: 'O’chirish', en: 'Delete', ru: 'Удалить' })}>
          <IconButton color="error" onClick={() => handleDeleteShop(row.id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <IconButton
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        <Add fontSize="large" />
      </IconButton>
    ),
    muiTableBodyCellProps: ({ cell }) =>
      cell.column.id === 'name'
        ? {
            sx: {
              cursor: 'pointer',
              ':hover': {
                color: colors.blue[500],
                fontWeight: 'bold'
              }
            },
            onClick: () => {
              const shopId = cell.row.original.id
              navigate(`/shops/${shopId}`)
            }
          }
        : {},
    getRowId: (row) => row.id,
    state: {
      isLoading: isShopsPending || isCreating || isUpdating || isDeleting,
      showAlertBanner:
        isShopsError ||
        isCreatingError ||
        !!resultOfCreating ||
        !!resultOfUpdating ||
        isUpdatingError ||
        isDeletingError ||
        !!resultOfDeleting
    },
    renderToolbarAlertBannerContent: () => {
      return (
        <Alert severity="error">
          <AlertTitle>{resultOfCreating || resultOfUpdating || resultOfDeleting}</AlertTitle>
        </Alert>
      )
    }
  })

  return <MaterialReactTable table={table} />
}

export default ShopsList

const validateRequired = (value: string) => !!value.length

function validateShop(product: Shop_Type) {
  return {
    nam: !validateRequired(product.name)
      ? langFormat({ uzb: 'Nomi', en: 'Name', ru: 'Название' })
      : ''
  }
}
