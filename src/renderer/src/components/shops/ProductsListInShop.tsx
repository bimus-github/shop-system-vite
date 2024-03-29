/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { Outlet, useNavigate, useParams } from 'react-router-dom'
import { Product_Type } from '../../models/types'
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
import {
  useCreateNewProductToShop,
  useDeleteProductFromShop,
  useGetProductsInShop,
  useUpdateProductFromShop
} from '../../hooks/productsInShop'
import { langFormat } from '../../functions/langFormat'
import toast from 'react-hot-toast'
import { EditName } from './ColumnComponents'

function ProductsListInShop(): JSX.Element {
  const navigate = useNavigate()
  const [selectedProduct, setSelectedProduct] = useState<Product_Type>()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const { shopId } = useParams()
  const columns = useMemo<MRT_ColumnDef<Product_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Mahsulot nomi',
          ru: 'Название продукта',
          en: 'Product name'
        }),
        size: 100,
        enableEditing: true,

        Edit: (props) => (
          <EditName
            validationErrors={validationErrors}
            setValidationErrors={setValidationErrors}
            setSelectedProduct={setSelectedProduct}
            {...props}
          />
        )
      },
      {
        accessorKey: 'cost',
        header: langFormat({
          uzb: 'Kelish narxi',
          ru: 'Цена покупки',
          en: 'Cost'
        }),
        size: 100,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.cost,
          helperText: validationErrors.cost || selectedProduct?.cost,
          onFocus: () => {
            delete validationErrors.cost
            setValidationErrors(validationErrors)
          }
        },
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.count * b.original.cost, 0)
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorKey: 'price',
        header: langFormat({
          uzb: 'Sotish narxi',
          ru: 'Цена продажи',
          en: 'Price'
        }),
        size: 100,
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.price,
          helperText: validationErrors.price || selectedProduct?.price,
          onFocus: () => {
            delete validationErrors.price
            setValidationErrors(validationErrors)
          }
        },
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.count * b.original.price, 0)
              .toLocaleString()}
          </Typography>
        )
      },
      {
        accessorKey: 'count',
        header: langFormat({
          uzb: 'Soni',
          ru: 'Количество',
          en: 'Count'
        }),
        enableEditing: true,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.count,
          helperText: validationErrors.count || selectedProduct?.count,
          onFocus: () => {
            delete validationErrors.count
            setValidationErrors(validationErrors)
          }
        },
        Footer: ({ table }) => (
          <Typography fontWeight={'bold'}>
            {table
              .getFilteredRowModel()
              .rows?.reduce((a, b) => a + b.original.count, 0)
              .toLocaleString()}
          </Typography>
        )
      }
    ],
    [validationErrors, selectedProduct]
  )

  const {
    data: products,
    isError: isGetProductsError,
    isPending: isGetProductsPending,
    isFetching: isGetProductsFetching
  } = useGetProductsInShop(shopId || '')

  const {
    data: resultCreatingNewProduct,
    mutateAsync: createNewProduct,
    isPending: isCreatingNewProduct,
    isError: isCreatingNewProductError
  } = useCreateNewProductToShop(shopId || '')

  const {
    data: resultUpdateProduct,
    mutateAsync: updateProduct,
    isError: isUpdateProductError,
    isPending: isUpdateProductPending
  } = useUpdateProductFromShop(shopId || '')

  const {
    data: resultDeleteProduct,
    mutateAsync: deleteProduct,
    isError: isDeleteProductError,
    isPending: isDeleteProductPending
  } = useDeleteProductFromShop(shopId || '')

  const handleCreateNewProductToShop: MRT_TableOptions<Product_Type>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateProduct(values)

    if (!selectedProduct) {
      setValidationErrors({
        name: langFormat({
          uzb: 'Mahsulot nomini kiriting',
          ru: 'Название продукта',
          en: 'Product name'
        })
      })
      return
    }
    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newProduct: Product_Type = {
      ...selectedProduct,
      cost: values.cost,
      price: values.price,
      count: values.count
    }

    createNewProduct(newProduct).then((result) => {
      if (!result) {
        table.setCreatingRow(null)
        setSelectedProduct(undefined)
        setTimeout(() => table.setCreatingRow(true), 500)
      }
    })
  }

  const handelSaveProductToShop: MRT_TableOptions<Product_Type>['onEditingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateProduct(values)

    if (!selectedProduct) {
      setValidationErrors({
        name: langFormat({
          uzb: 'Mahsulot nomini kiriting',
          ru: 'Название продукта',
          en: 'Product name'
        })
      })
      return
    }

    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newProduct: Product_Type = {
      ...selectedProduct,
      cost: values.cost,
      price: values.price,
      count: values.count
    }

    updateProduct(newProduct).then((result) => {
      if (!result) {
        table.setEditingRow(null)
        setSelectedProduct(undefined)
      }
    })
  }

  const table = useMaterialReactTable({
    columns,
    data: products || [],
    enablePagination: false,
    enableFullScreenToggle: false,
    enableBottomToolbar: false,
    enableDensityToggle: false,
    enableEditing: true,
    positionActionsColumn: 'last',
    editDisplayMode: 'row',
    onEditingRowSave: handelSaveProductToShop,
    createDisplayMode: 'modal',
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    muiTableBodyCellProps: ({ cell }) =>
      cell.column.id === 'count'
        ? {
            sx: {
              cursor: 'pointer',
              ':hover': {
                color: colors.blue[500],
                fontWeight: 'bold'
              }
            },
            onClick: () => {
              const productId = cell.row.original.id
              navigate(`${productId}`)
            }
          }
        : {},
    onCreatingRowSave: handleCreateNewProductToShop,
    renderTopToolbarCustomActions: ({ table }) => (
      <IconButton onClick={() => table.setCreatingRow(true)}>
        <Add fontSize="large" />
      </IconButton>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip
          title={langFormat({
            uzb: 'Tahrirlash',
            en: 'Edit',
            ru: 'Редактировать'
          })}
        >
          <IconButton
            onClick={() => {
              table.setEditingRow(row)
              setSelectedProduct(row.original)
            }}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title={langFormat({ uzb: 'O`chirish', en: 'Delete', ru: 'Удалить' })}>
          <IconButton
            color="error"
            onClick={async () => {
              toast((t) => (
                <Box>
                  <div>
                    {langFormat({
                      uzb: 'Rostan ham o`chirmoqchimisiz?',
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
                      await toast.promise(deleteProduct(row.original.id), {
                        loading: langFormat({ uzb: 'Yuklanmoqda', en: 'Loading', ru: 'Загрузка' }),
                        success: langFormat({ uzb: 'O`chirildi', en: 'Deleted', ru: 'Удалено' }),
                        error: langFormat({
                          uzb: 'Xatolik yuz berdi',
                          en: 'Error',
                          ru: 'Произошла ошибка'
                        })
                      })
                    }}
                  >
                    {langFormat({ uzb: 'O`chirish', en: 'Delete', ru: 'Удалить' })}
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
      isLoading:
        isGetProductsPending ||
        isCreatingNewProduct ||
        isUpdateProductPending ||
        isDeleteProductPending,
      showAlertBanner:
        isGetProductsError ||
        isCreatingNewProductError ||
        !!resultCreatingNewProduct ||
        isUpdateProductError ||
        !!resultUpdateProduct ||
        isDeleteProductError ||
        !!resultDeleteProduct,
      showProgressBars: isGetProductsFetching
    },
    renderToolbarAlertBannerContent: () => {
      return (
        <Alert severity="error">
          <AlertTitle>
            {resultCreatingNewProduct || resultUpdateProduct || resultDeleteProduct}
          </AlertTitle>
        </Alert>
      )
    }
  })

  return (
    <>
      <MaterialReactTable table={table} />
      <Outlet />
    </>
  )
}

export default ProductsListInShop

const validateRequired = (value: string) => !!value.length

function validateProduct(product: Product_Type) {
  return {
    count: !validateRequired(product.count.toString())
      ? langFormat({
          uzb: 'Mahsulot sonini kiritish shart',
          ru: 'Укажите количество',
          en: 'Enter count'
        })
      : '',
    cost: !validateRequired(product.cost.toString())
      ? langFormat({
          uzb: 'Mahsulotni sotish narxini kiritish shart',
          ru: 'Укажите цену',
          en: 'Enter cost'
        })
      : '',
    price: !validateRequired(product.price.toString())
      ? langFormat({
          uzb: 'Mahsulotni sotish narxini kiritish shart',
          ru: 'Укажите цену',
          en: 'Enter price'
        })
      : ''
  }
}
