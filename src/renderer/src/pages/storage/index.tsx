import { Outlet } from 'react-router-dom'
import { ProductsList } from '../../components/storage'
import { Box } from '@mui/material'

function Storage(): JSX.Element {
  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <ProductsList />
      <Outlet />
    </Box>
  )
}

export default Storage
