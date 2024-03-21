import { Box, Table, TableBody, TableHead, Typography } from '@mui/material'

interface Props {
  tablehead: JSX.Element
  tablebody: JSX.Element
  title: string
  customTitle?: JSX.Element
}

function CustomTable({ title, tablebody, tablehead, customTitle }: Props): JSX.Element {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        gap: '1rem',
        flexDirection: 'column',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 15px',
        borderRadius: '0.5rem',
        padding: '1rem'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Typography textTransform={'uppercase'} variant="h5" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {customTitle}
      </Box>
      <Table>
        <TableHead>{tablehead}</TableHead>
        <TableBody>{tablebody}</TableBody>
      </Table>
    </Box>
  )
}

export default CustomTable
