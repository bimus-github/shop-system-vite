/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  MRT_ColumnDef,
  MRT_TableOptions,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { useMemo, useState } from 'react'
import { Client_Type } from '../../models/types'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { useAddClient, useDeleteClient, useGetClients } from '../../hooks/client'
import { langFormat } from '../../functions/langFormat'

function ClientsList(): JSX.Element {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({})

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
      },
      {
        accessorKey: 'date',
        header: langFormat({ uzb: 'Sana', ru: 'Дата', en: 'Date' }),
        enableEditing: false
      }
    ],
    [validationErrors]
  )

  const { data, isFetching: isFetchingClients } = useGetClients()

  const { data: resultAdding, mutateAsync: addClient } = useAddClient()
  const { data: resultUpdating, mutateAsync: updateClient } = useAddClient()
  const { data: resultDeleting, mutateAsync: deleteClient } = useDeleteClient()

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
      date: new Date().toLocaleDateString()
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
    onEditingRowSave: handleSaveClient,
    createDisplayMode: 'row',
    onCreatingRowSave: handleAddClient,
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
          <IconButton color="error" onClick={async () => await deleteClient(row.original)}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    state: {
      isLoading: isFetchingClients,
      showAlertBanner: !!resultAdding || !!resultUpdating || !!resultDeleting,
      showSkeletons: isFetchingClients
    },
    renderToolbarAlertBannerContent: () => {
      return <Typography>{resultAdding || resultUpdating || resultDeleting}</Typography>
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
