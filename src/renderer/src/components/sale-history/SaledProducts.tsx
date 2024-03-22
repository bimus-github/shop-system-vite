/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { SALE_FORM, Saled_Product_Type } from '../../models/types'
import { Autocomplete, Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { ContentCopy, CopyAll, Delete, Edit, Refresh } from '@mui/icons-material'
import { saleFormOptions } from '../../constants'
import { useDeleteSaledProduct, useGetSaledProducts, useUpdateSaledProduct } from '../../hooks/sale'
import { useGetClients } from '../../hooks/client'
import { langFormat } from '../../functions/langFormat'
import { saveAllSelected } from '@renderer/functions/saveAllSelected'
const { clipboard } = window.require('electron')

function SaledProducts(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const { data: data = [], isFetching: isFetchingSaledProducts } = useGetSaledProducts()

  const { data: resultUpdating, mutateAsync: updateSaledProduct } = useUpdateSaledProduct()

  const { data: resultDeleting, mutateAsync: deleteSaledProduct } = useDeleteSaledProduct()

  const { data: clients } = useGetClients()

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
        Filter: (props) => (
          <Autocomplete
            {...props}
            autoFocus={true}
            options={clients?.map((client) => client.name) || []}
            onChange={(_, value) => {
              props.column.setFilterValue(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                sx={{ width: '200px' }}
                placeholder={langFormat({
                  uzb: 'Xaridor',
                  ru: 'Покупатель',
                  en: 'Buyer'
                })}
              />
            )}
          />
        )
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

        Filter: (props) => (
          <Autocomplete
            {...props}
            options={Object.values(SALE_FORM)}
            defaultValue={SALE_FORM.LOAN}
            onInputChange={(_, value) => {
              props.column.setFilterValue(value)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                sx={{ width: '100px' }}
                placeholder={langFormat({
                  uzb: 'Sotish formasi',
                  ru: 'Форма продажи',
                  en: 'Sale form'
                })}
              />
            )}
          />
        ),
        Cell(props) {
          const data = props.row.original
          const form = props.row.original.sale_form
          return (
            <Box
              {...props}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: '0.5rem'
              }}
            >
              <Typography sx={{ color: form === SALE_FORM.LOAN ? 'red' : '' }}>
                {data.sale_form}
              </Typography>
              <Tooltip
                title={langFormat({
                  uzb: 'Pul shaklini o`zgartirish',
                  ru: 'Изменить счет',
                  en: 'Change form of payment'
                })}
              >
                <IconButton
                  onClick={() => {
                    if (
                      !confirm(
                        langFormat({
                          uzb: 'O`zgartirishni istaysizmi?',
                          ru: 'Изменить?',
                          en: 'Change?'
                        })
                      )
                    )
                      return

                    const newSaleForm =
                      data.sale_form === SALE_FORM.CASH
                        ? SALE_FORM.CARD
                        : data.sale_form === SALE_FORM.LOAN
                          ? SALE_FORM.CASH
                          : SALE_FORM.LOAN

                    const saledProduct: Saled_Product_Type = {
                      id: data.id,
                      name: data.name,
                      barcode: data.barcode,
                      saled_count: data.saled_count,
                      cost: data.cost,
                      saled_price: data.saled_price,
                      sale_form: newSaleForm,
                      buyers_name: data.buyers_name,
                      discount: data.discount,
                      saled_date: data.saled_date,
                      count: data.count,
                      price: data.price,
                      saledId: data.saledId
                    }

                    updateSaledProduct(saledProduct).then((result) => {
                      alert(result || 'success')
                    })
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          )
        }
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
        Footer: ({ table }) => {
          const total = useMemo(
            () =>
              table
                .getFilteredRowModel()
                .rows.reduce(
                  (sum, row) =>
                    sum +
                    row.original.saled_price *
                      row.original.saled_count *
                      (1 - row.original.discount / 100),
                  0
                ),
            [table]
          )
          return <Typography fontWeight={'bold'}>{total.toLocaleString()}</Typography>
        }
      },
      {
        accessorKey: 'cost',
        header: langFormat({
          uzb: 'Kelish narxi',
          ru: 'Стоимость прихода',
          en: 'Cost of comming'
        }),
        accessorFn: (row) => row.cost.toLocaleString(),
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
        accessorFn: (row) => ((row.saled_price - row.cost) * row.saled_count).toLocaleString(),
        header: langFormat({
          uzb: 'Foyda',
          ru: 'Прибыль',
          en: 'Profit'
        }),
        enableEditing: false,
        size: 70,
        Footer: ({ table }) => {
          const total = useMemo(
            () =>
              table
                .getFilteredRowModel()
                .rows.reduce(
                  (sum, row) =>
                    sum +
                    (row.original.saled_price * (1 - row.original.discount / 100) -
                      row.original.cost) *
                      row.original.saled_count,
                  0
                )
                .toLocaleString(),
            [table]
          )
          return <Typography fontWeight={'bold'}>{total.toLocaleString()}</Typography>
        }
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
          uzb: 'Sotish sanasi',
          ru: 'Дата продажи',
          en: 'Saled date'
        }),
        enableEditing: false,
        accessorFn: (row) =>
          new Date(+row.saled_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }),
        size: 130
      }
    ],
    [validationErrors, langFormat, saleFormOptions, updateSaledProduct]
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

  const handleChangeSelectedRows = async (table: MRT_TableInstance<Saled_Product_Type>) => {
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

  const handleSaveAll = (table: MRT_TableInstance<Saled_Product_Type>) => {
    const selectedProducts = table.getSelectedRowModel().rows
    saveAllSelected(selectedProducts)
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
    muiPaginationProps: {
      rowsPerPageOptions: [30, data?.length || 50]
    },
    onEditingRowSave: handleUpdateSaledProduct,
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
          <IconButton
            color="error"
            onClick={async () => {
              if (
                !confirm(
                  langFormat({
                    uzb: 'O`chirishni istaysizmi?',
                    ru: 'Удалить?',
                    en: 'Delete?'
                  })
                )
              )
                return
              await deleteSaledProduct(row.original.saledId)
            }}
          >
            <Delete />
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

              alert(text)
              clipboard.writeText(text)
            }}
          >
            <ContentCopy />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
      showAlertBanner: !!resultUpdating || !!resultDeleting,
      showColumnFilters: true
    },
    muiSelectAllCheckboxProps: {
      color: 'success'
    },
    renderTopToolbarCustomActions: ({ table }) => {
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
    },
    renderToolbarAlertBannerContent: () => {
      return <Typography color="error">{resultUpdating || resultDeleting}</Typography>
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
