/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { SALE_FORM, Saled_Product_Type } from '../../models/types'
import { Typography } from '@mui/material'
import { saleFormOptions } from '../../constants'
import { useGetSaledProducts, useUpdateSaledProduct } from '../../hooks/sale'
import { langFormat } from '../../functions/langFormat'
import RowActions from './RowActions'
import TopToolbarCustomActions from './TopToolbarCustomActions'
import {
  FilterByBuyer,
  FilterByDate,
  FilterBySaleForm,
  PriceFooter,
  ProfitFooter,
  SalefFromCell
} from './ColumnCompenents'
import { dateFormat } from '@renderer/functions/dateFormat'

function SaledProducts(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const { data = [], isFetching: isFetchingSaledProducts } = useGetSaledProducts()

  const { data: resultUpdating, mutateAsync: updateSaledProduct } = useUpdateSaledProduct()

  const columns = useMemo<MRT_ColumnDef<Saled_Product_Type>[]>(
    () => [
      {
        accessorKey: 'buyers_name',
        header: langFormat({
          uzb: 'Xaridor',
          ru: 'Покупатель',
          en: 'Buyer'
        }),
        editVariant: 'select',
        Filter: FilterByBuyer
      },
      {
        accessorKey: 'sale_form',
        header: langFormat({
          uzb: 'Sotish formasi',
          ru: 'Форма продажи',
          en: 'Sale form'
        }),
        editVariant: 'select',
        size: 80,
        editSelectOptions: saleFormOptions,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.price,
          helperText: validationErrors.price,
          onFocus: () => {
            delete validationErrors.price
            setValidationErrors(validationErrors)
          }
        },

        Filter: FilterBySaleForm,
        Cell: SalefFromCell
      },
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Nomi',
          ru: 'Название',
          en: 'Name'
        }),
        enableEditing: false,
        size: 150
      },
      {
        accessorKey: 'barcode',
        header: langFormat({
          uzb: 'Barkodi',
          ru: 'Штрих-код',
          en: 'Barcode'
        }),
        enableEditing: false,
        size: 50
      },
      {
        accessorKey: 'saled_count',
        header: langFormat({
          uzb: 'Sotish soni',
          ru: 'Количество',
          en: 'Count'
        }),
        size: 50,
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.price,
          helperText: validationErrors.price,
          onFocus: () => {
            delete validationErrors.price
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorFn: (row) => (row.saled_price * row.saled_count).toLocaleString(),
        header: langFormat({
          uzb: 'Jami',
          ru: 'Стоимость',
          en: 'Price'
        }),
        enableEditing: false,
        size: 70,
        Footer: PriceFooter
      },
      {
        accessorKey: 'cost',
        header: langFormat({
          uzb: 'Kelish narxi',
          ru: 'Стоимость прихода',
          en: 'Cost of comming'
        }),
        accessorFn: (row) => row.cost.toLocaleString('ru-RU', { maximumFractionDigits: 0 }),
        enableEditing: false,
        size: 70
      },
      {
        accessorKey: 'saled_price',
        header: langFormat({
          uzb: 'Sotish narxi',
          ru: 'Цена продажи',
          en: 'Saled price'
        }),
        size: 70,
        accessorFn: (row) => row.saled_price.toLocaleString('ru-RU', { maximumFractionDigits: 0 }),
        muiEditTextFieldProps: {
          required: true,
          variant: 'standard',
          error: !!validationErrors.price,
          helperText: validationErrors.price,
          onFocus: () => {
            delete validationErrors.price
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'profit',
        accessorFn: (row) =>
          ((row.saled_price - row.cost) * row.saled_count).toLocaleString('ru-RU', {
            maximumFractionDigits: 0
          }),
        header: langFormat({
          uzb: 'Foyda',
          ru: 'Прибыль',
          en: 'Profit'
        }),
        enableEditing: false,
        size: 70,
        Footer: ProfitFooter
      },
      {
        accessorKey: 'discount',
        header: langFormat({
          uzb: 'Chegirma',
          ru: 'Скидка',
          en: 'Discount'
        }),
        size: 70
      },
      {
        accessorKey: 'saled_date',
        header: langFormat({
          uzb: 'Sotilgan sana',
          ru: 'Дата продажи',
          en: 'Saled date'
        }),
        enableEditing: false,
        accessorFn: (row) => dateFormat(row.saled_date),
        // default value to filter input
        Filter: FilterByDate,
        size: 130
      }
    ],
    [validationErrors]
  )

  const handleUpdateSaledProduct: MRT_TableOptions<Saled_Product_Type>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      const newValidateErrors = validateShop(values)
      if (Object.values(newValidateErrors).some((error) => error)) {
        setValidationErrors(newValidateErrors)
        return
      }
      setValidationErrors({})

      const saledProduct: Saled_Product_Type = {
        id: row.original.id,
        name: row.original.name,
        barcode: row.original.barcode,
        saled_count: values.saled_count,
        cost: row.original.cost,
        saled_price: values.saled_price,
        sale_form: values.sale_form,
        buyers_name: values.buyers_name,
        discount: values.discount,
        saled_date: new Date(values.saled_date).valueOf(),
        count: row.original.count,
        price: row.original.price,
        saledId: row.original.saledId
      }

      updateSaledProduct(saledProduct).then((result) => {
        if (!result) table.setEditingRow(null)
      })
    }

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableRowNumbers: true,
    enableEditing: true,
    positionActionsColumn: 'last',
    editDisplayMode: 'row',
    enableRowSelection: true,
    enableBatchRowSelection: true,
    positionPagination: 'top',
    paginationDisplayMode: 'default',
    positionGlobalFilter: 'left',
    selectAllMode: 'all',
    muiPaginationProps: ({ table }) => ({
      rowsPerPageOptions: [
        30,
        60,
        90,
        table.getFilteredRowModel().rows.length > 120
          ? table.getFilteredRowModel().rows.length
          : 120
      ]
    }),
    onEditingRowSave: handleUpdateSaledProduct,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 30 },
      columnVisibility: {
        barcode: false,
        saled_price: false,
        cost: false,
        discount: false,
        profit: false
      },
      showGlobalFilter: true
    },
    muiSelectCheckboxProps: {
      color: 'success'
    },
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    state: {
      isLoading: isFetchingSaledProducts,
      showAlertBanner: !!resultUpdating,
      showColumnFilters: true
    },
    muiSelectAllCheckboxProps: {
      color: 'success'
    },
    renderTopToolbarCustomActions: TopToolbarCustomActions,
    renderRowActions: RowActions,
    renderToolbarAlertBannerContent: () => {
      return <Typography color="error">{resultUpdating}</Typography>
    }
  })

  return <MaterialReactTable table={table} />
}

export default SaledProducts

const validateRequired = (value: string) => !!value.length
const validateSaledType = (value: SALE_FORM) => value !== SALE_FORM.NONE

function validateShop(product: Saled_Product_Type) {
  return {
    saled_price: validateRequired(product.saled_price.toString())
      ? ''
      : langFormat({
          uzb: 'Sotish narxi kiritilmadi',
          ru: 'Укажите цену',
          en: 'Enter price'
        }),
    saled_count: validateRequired(product.saled_count.toString())
      ? ''
      : langFormat({
          uzb: 'Sotish soni kiritilmadi',
          ru: 'Укажите количество',
          en: 'Enter count'
        }),
    sale_form: validateSaledType(product.sale_form)
      ? ''
      : langFormat({
          uzb: 'Sotish turi kiritilmadi',
          ru: 'Укажите тип',
          en: 'Enter type'
        })
  }
}
