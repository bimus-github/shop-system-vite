/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { Product_Type } from '../../models/types'
import {
  useCreateProductToStorage,
  useGetProductsInStorage,
  useDeleteProductFromStorage,
  useUpdateProductInStorage
} from '../../hooks/storage'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { langFormat } from '../../functions/langFormat'
import toast from 'react-hot-toast'

function ProductsList(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const {
    data: fetchedProducts = [],
    isError: isLoadingProductsError,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProducts
  } = useGetProductsInStorage()

  const {
    mutateAsync: createProduct,
    isPending: isCreatingProduct,
    failureReason,
    data
  } = useCreateProductToStorage()

  const {
    data: errorWhileDeleting,
    mutateAsync: deleteProduct,
    isPending: isDeleting
  } = useDeleteProductFromStorage()

  const {
    data: updatedProduct,
    mutateAsync: updateProduct,
    isPending: isUpdatingProduct
  } = useUpdateProductInStorage()

  const columns = useMemo<MRT_ColumnDef<Product_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Mahsulot nomi',
          en: 'Product name',
          ru: 'Название'
        }),
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.name,
          helperText: validationErrors.name,
          autoComplete: 'off',
          onFocus: () => {
            delete validationErrors.name
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'barcode',
        header: langFormat({ uzb: 'Barkod', en: 'Barcode', ru: 'Штрих-код' }),
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.barcode,
          helperText: validationErrors.barcode,
          onFocus: () => {
            delete validationErrors.barcode
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'count',
        header: langFormat({ uzb: 'Soni', en: 'Count', ru: 'Количество' }),
        size: 50,
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.count, 0)
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorKey: 'cost',
        accessorFn: (row) => row.cost.toLocaleString('ru-RU', { maximumFractionDigits: 0 }),
        header: langFormat({
          uzb: 'Kelish narxi',
          en: 'Cost',
          ru: 'Себестоимость'
        }),
        size: 80,
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.cost * b.original.count, 0)
              .toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
          </Typography>
        )
      },
      {
        accessorKey: 'price',
        accessorFn: (row) => row.price.toLocaleString('ru-RU', { maximumFractionDigits: 0 }),
        header: langFormat({ uzb: 'Narxi', en: 'Price', ru: 'Цена' }),
        size: 80,
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.price * b.original.count, 0)
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorKey: 'profit',
        header: langFormat({ uzb: 'Foyda', en: 'Profit', ru: 'Прибыль' }),
        accessorFn: (row) => row.price - row.cost,
        size: 80,
        enableEditing: false,
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows.reduce((a, b) => a + (b.original.price - b.original.cost) * b.original.count, 0)
              .toLocaleString()}
          </Typography>
        )
      }
    ],
    [validationErrors]
  )

  const handleDeleteProduct = async (id: string) => {
    toast((t) => (
      <Box>
        <div>
          {langFormat({
            uzb: 'Haqiqatdan ham o`chirmoqchimisiz?',
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

  const handleCreateProduct: MRT_TableOptions<Product_Type>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateProduct(values)

    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newProduct: Product_Type = {
      id: Math.random().toString(36).substring(7),
      name: values.name,
      price: 0,
      cost: 0,
      count: 0,
      barcode: values.barcode
    }

    const result = await createProduct(newProduct)
    if (!result) table.setCreatingRow(null)
    if (!result) setTimeout(() => table.setCreatingRow(true), 500)
  }

  const handelSaveProduct: MRT_TableOptions<Product_Type>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateProduct(values)

    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const result = await updateProduct(values)
    if (!result) table.setEditingRow(null)
  }

  const table = useMaterialReactTable({
    columns,
    data: fetchedProducts,
    enableFullScreenToggle: false,
    enableEditing: true,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    muiToolbarAlertBannerProps: isLoadingProducts
      ? {
          color: 'error',
          children: langFormat({
            uzb: 'Xatolik yuz berdi',
            en: 'Error occurred',
            ru: 'Произошла ошибка'
          })
        }
      : undefined,
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateProduct,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handelSaveProduct,
    positionActionsColumn: 'last',
    muiPaginationProps: {
      rowsPerPageOptions: [30, 60, 90, 120, fetchedProducts?.length || 150]
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
        <Tooltip title={langFormat({ uzb: 'O`chirish', en: 'Delete', ru: 'Удалить' })}>
          <IconButton color="error" onClick={() => handleDeleteProduct(row.original.id)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <IconButton
        onClick={() => {
          table.setCreatingRow(true)
          // );
        }}
      >
        <Add fontSize="large" />
      </IconButton>
    ),
    initialState: {
      pagination: { pageSize: 30, pageIndex: 0 },
      columnVisibility: {
        profit: false
      },
      showGlobalFilter: true
    },
    state: {
      isLoading: isLoadingProducts,
      isSaving: isCreatingProduct || isUpdatingProduct || isDeleting,
      showAlertBanner:
        isLoadingProductsError ||
        !!failureReason ||
        !!data ||
        !!updatedProduct ||
        !!errorWhileDeleting,
      showProgressBars: isFetchingProducts
    },
    // give text to alert banner
    renderToolbarAlertBannerContent: () => {
      return <Typography color="error">{data || errorWhileDeleting || updatedProduct}</Typography>
    }
  })

  return <MaterialReactTable table={table} />
}

export default ProductsList

const validateRequired = (value: string) => !!value.length

function validateProduct(product: Product_Type) {
  return {
    name: !validateRequired(product.name)
      ? langFormat({ uzb: 'Nomi', en: 'Name', ru: 'Название' })
      : '',
    barcode: !validateRequired(product.barcode)
      ? langFormat({ uzb: 'Barkod', en: 'Barcode', ru: 'Штрих-код' })
      : ''
  }
}
