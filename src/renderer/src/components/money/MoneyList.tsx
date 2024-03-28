/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo, useState } from 'react'
import { Money_Type, MONEY_REASON } from '../../models/types'
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useCreateMoney, useDeleteMoney, useGetAllMoney, useUpdateMoney } from '../../hooks/money'
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { langFormat } from '../../functions/langFormat'
import toast from 'react-hot-toast'

function MoneyList(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

  const columns = useMemo<MRT_ColumnDef<Money_Type>[]>(
    () => [
      {
        accessorKey: 'value',
        header: langFormat({ uzb: 'Summa', ru: 'Сумма', en: 'Summa' }),
        editVariant: 'text',
        muiEditTextFieldProps: {
          type: 'number',
          InputProps: {
            inputProps: {
              min: 0
            }
          },
          required: true,
          error: !!validationErrors.value,
          helperText: validationErrors.value,
          onFocus: () => {
            delete validationErrors.price
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'reason',
        header: langFormat({ uzb: 'Sabab', ru: 'Причина', en: 'Reason' }),
        editVariant: 'select',
        editSelectOptions: Object.values(MONEY_REASON),
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors.reason,
          helperText: validationErrors.reason,
          onFocus: () => {
            delete validationErrors.reason
            setValidationErrors(validationErrors)
          }
        }
      },
      {
        accessorKey: 'extraInfo',
        header: langFormat({
          uzb: "Qo'shimcha ma'lumot",
          ru: 'Дополнительная информация',
          en: 'Extra info'
        })
      },
      {
        accessorKey: 'date',
        accessorFn: (row) => new Date(+row.date).toLocaleDateString('en-US'),
        header: langFormat({ uzb: 'Sana', ru: 'Дата', en: 'Date' }),
        enableEditing: false
      }
    ],
    [validationErrors]
  )
  const { data: money, isLoading: isFetching } = useGetAllMoney()
  const {
    data: createResult,
    mutateAsync: createMoneyAsync,
    isPending: isCreating
  } = useCreateMoney()
  const { data: updateResult, mutateAsync: updateMoney, isPending: isUpdating } = useUpdateMoney()
  const { data: deleteResult, mutateAsync: deleteMoney, isPending: isDeleting } = useDeleteMoney()

  const onSaveMoney: MRT_TableOptions<Money_Type>['onEditingRowSave'] = async ({
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

    const newMoney: Money_Type = {
      id: row.original.id,
      date: new Date(values.date).valueOf(),
      extraInfo: values.extraInfo,
      reason: values.reason,
      value: +values.value
    }

    const result = await updateMoney(newMoney)
    if (!result) {
      table.setEditingRow(null)
    }
  }

  const handleCreateMoney: MRT_TableOptions<Money_Type>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateShop(values)
    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newMoney: Money_Type = {
      id: Math.random().toString(36).substring(7),
      date: new Date().valueOf(),
      extraInfo: values.extraInfo,
      reason: values.reason,
      value: +values.value
    }

    const result = await createMoneyAsync(newMoney)
    if (result) {
      table.setCreatingRow(null)

      setTimeout(() => {
        table.setCreatingRow(true)
      }, 100)
    }
  }

  const table = useMaterialReactTable({
    data: money || [],
    columns,
    enableEditing: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnFilterModes: false,
    enableBottomToolbar: false,
    enableRowNumbers: true,
    positionActionsColumn: 'last',
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    onEditingRowSave: onSaveMoney,
    onCreatingRowSave: handleCreateMoney,
    getRowId: (row) => row.id,
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    state: {
      showSkeletons: isFetching || isCreating || isUpdating || isDeleting,
      showAlertBanner: !!createResult || !!updateResult || !!deleteResult
    },
    renderToolbarAlertBannerContent: () => {
      return <Typography color="error">{createResult || updateResult || deleteResult}</Typography>
    },
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
                      await toast.promise(deleteMoney(row.original.id), {
                        loading: langFormat({
                          uzb: 'O`chirilmoqda',
                          ru: 'Удаление',
                          en: 'Deleting'
                        }),
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
    )
  })
  return <MaterialReactTable table={table} />
}

export default MoneyList

const validateRequired = (value: string) => !!value.length
const validateReason = (value: MONEY_REASON) => value !== MONEY_REASON.NONE

function validateShop(money: Money_Type) {
  return {
    value: !validateRequired(money.value.toString())
      ? langFormat({
          uzb: 'Narxni kiriting',
          ru: 'Укажите сумму',
          en: 'Enter amount'
        })
      : '',
    reason: !validateReason(money.reason)
      ? langFormat({ uzb: 'Sababi?', ru: 'Причина?', en: 'Reason' })
      : ''
  }
}
