import React from 'react'
import { Pagination as MuiPagination } from '@mui/material'

function Pagination({
  setCurrentPage
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}): JSX.Element {
  return (
    <MuiPagination
      sx={{ position: 'absolute', bottom: 10, right: 10 }}
      count={10}
      variant="outlined"
      shape="rounded"
      onChange={(_, page) => setCurrentPage(page)}
    />
  )
}

export default Pagination
