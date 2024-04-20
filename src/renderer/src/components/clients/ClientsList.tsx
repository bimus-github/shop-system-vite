/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { Client_Type, SALE_FORM } from '../../models/types'
import { Box, IconButton, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useAddClient, useGetClients } from '../../hooks/client'
import { langFormat } from '../../functions/langFormat'
import { RowActions } from './RowActions'
import { dateFormat } from '@renderer/functions/dateFormat'
import { useGetSaledProducts } from '@renderer/hooks/sale'

function ClientsList(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})
  const { data: saledProdcucts } = useGetSaledProducts()

  const columns = useMemo<MRT_ColumnDef<Client_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Haridor ismi',
          ru: 'Имя клиента',
          en: 'Name'
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
        header: langFormat({ uzb: 'Nasiya', en: 'Loan', ru: 'Задолженность' }),
        enableEditing: false,
        accessorFn: (row) =>
          saledProdcucts
            ?.filter((p) => p.buyers_name === row.name && p.sale_form === SALE_FORM.LOAN)
            .reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)
            .toLocaleString() || 0,
        Cell({ row }) {
          const buyersProducts = saledProdcucts?.filter(
            (p) => p.buyers_name === row.original.name && p.sale_form === SALE_FORM.LOAN
          )
          return (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Typography>
                {buyersProducts
                  ?.reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)
                  .toLocaleString() || 0}
              </Typography>
            </Box>
          )
        }
      },
      {
        header: langFormat({ uzb: 'Jami Harid', en: 'Total', ru: 'Всего выдано' }),
        enableEditing: false,
        accessorFn: (row) =>
          saledProdcucts
            ?.filter((p) => p.buyers_name === row.name)
            .reduce((a, b) => a + b.saled_count * b.saled_price * (1 - b.discount / 100), 0)
            .toLocaleString() || 0
      },
      {
        accessorKey: 'phone',
        header: langFormat({
          uzb: 'Telefon raqami',
          ru: 'Номер телефона',
          en: 'Phone number'
        }),
        enableEditing: true,
        muiEditTextFieldProps: {
          variant: 'standard',
          error: !!validationErrors.phone,
          helperText: validationErrors.phone,
          autoComplete: 'off',
          onFocus: () => {
            delete validationErrors.phone
            setValidationErrors(validationErrors)
          }
        }
      }
    ],
    [validationErrors]
  )

  const { data, isFetching: isFetchingClients } = useGetClients()

  const { data: resultAdding, mutateAsync: addClient } = useAddClient()
  const { data: resultUpdating, mutateAsync: updateClient } = useAddClient()

  const handleAddClient: MRT_TableOptions<Client_Type>['onCreatingRowSave'] = async ({
    values,
    table
  }) => {
    const newValidateErrors = validateShop(values)

    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const newClient: Client_Type = {
      id: Math.random().toString(36).substring(7),
      name: values.name || '',
      phone: values.phone || '',
      date: dateFormat(new Date())
    }

    addClient(newClient).then((result) => {
      // claer row
      if (!result) {
        table.setCreatingRow(null)

        setTimeout(() => {
          table.setCreatingRow(true)
        }, 500)
      }
    })
  }

  const handleSaveClient: MRT_TableOptions<Client_Type>['onEditingRowSave'] = async ({
    exitEditingMode,
    row,
    values
  }) => {
    const newValidateErrors = validateShop(values)
    if (Object.values(newValidateErrors).some((error) => error)) {
      setValidationErrors(newValidateErrors)
      return
    }
    setValidationErrors({})

    const client: Client_Type = {
      id: row.original.id,
      name: values.name || '',
      phone: values.phone || '',
      date: row.original.date
    }

    updateClient(client).then((result) => {
      if (!result) {
        exitEditingMode()
      }
    })
  }

  const table = useMaterialReactTable({
    columns,
    data: data || [],
    enableEditing: true,
    enableFullScreenToggle: false,
    enablePagination: false,
    positionActionsColumn: 'last',
    editDisplayMode: 'row',
    createDisplayMode: 'row',
    renderRowActions: RowActions,
    onCreatingRowSave: handleAddClient,
    onEditingRowSave: handleSaveClient,
    muiSearchTextFieldProps: {
      autoFocus: true,
      placeholder: langFormat({
        uzb: 'Qidirish',
        en: 'Search',
        ru: 'Поиск'
      })
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <IconButton
        onClick={() => {
          table.setCreatingRow(true)
        }}
      >
        <Add fontSize="large" />
      </IconButton>
    ),
    state: {
      isLoading: isFetchingClients,
      showAlertBanner: !!resultAdding || !!resultUpdating,
      showSkeletons: isFetchingClients
    },
    renderToolbarAlertBannerContent: () => {
      return <Typography>{resultAdding || resultUpdating}</Typography>
    }
  })
  return <MaterialReactTable table={table} />
}

export default ClientsList

const validateRequired = (value: string) => !!value.length

function validateShop(product: Client_Type) {
  return {
    name: !validateRequired(product.name) ? langFormat({ uzb: 'Ismi', ru: 'Имя', en: 'Name' }) : ''
  }
}
