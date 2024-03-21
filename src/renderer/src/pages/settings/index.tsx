import { Box, Divider } from '@mui/material'
import { LeftSide, RightSide } from '../../components/settings'

function Settings(): JSX.Element {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 0.01fr 1.5fr',
        minHeight: '80vh'
      }}
    >
      <LeftSide />
      <Divider orientation="vertical" flexItem />
      <RightSide />
    </Box>
  )
}

export default Settings
