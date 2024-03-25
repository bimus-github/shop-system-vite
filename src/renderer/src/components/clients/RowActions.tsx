import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { useDeleteClient } from '@renderer/hooks/client'
import { Client_Type } from '@renderer/models/types'
import { MRT_Cell, MRT_Row, MRT_TableInstance } from 'material-react-table'

type Props = {
  cell: MRT_Cell<Client_Type, unknown>
  row: MRT_Row<Client_Type>
  staticRowIndex?: number | undefined
  table: MRT_TableInstance<Client_Type>
}

export function RowActions(props: Props): JSX.Element {
  const { row, table } = props

  const { mutateAsync: deleteClient } = useDeleteClient()
  return (
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
  )
}
