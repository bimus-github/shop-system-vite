import { ProductsList } from '../../components/storage'
import { Box } from '@mui/material'

function Storage(): JSX.Element {
  return (
    <Box sx={{ height: '80vh', width: '100%' }}>
      <ProductsList />
    </Box>
  )
}

export default Storage
