/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { PATH_NAME } from '../../models/types'

function NotFound(): JSX.Element {
  return (
    <Box>
      <Typography>Ooops, nimadur xato ketib, boshqa sahifaga o'tib qoldingiz!!!</Typography>
      <Link to={PATH_NAME.SALE}>Savdo bo'limiga o'tish</Link>
    </Box>
  )
}

export default NotFound
