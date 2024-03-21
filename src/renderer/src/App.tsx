import { useState, useLayoutEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { root as rootRouter } from './router/root'
import { ThemeProvider } from '@mui/material'
import { theme } from './theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const queryClient = new QueryClient()

function App(): JSX.Element {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState<string>('')

  useLayoutEffect(() => {
    const settings = localStorage.getItem('settings')
    if (settings) {
      const {
        isDark,
        fontSize,
        fontFamily
      }: { isDark: boolean; fontSize: number; fontFamily: string } = JSON.parse(settings)
      setMode(isDark ? 'dark' : 'light')
      setFontSize(fontSize)
      setFontFamily(fontFamily)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme({ mode, fontSize, fontFamily })}>
          <RouterProvider router={rootRouter} />
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  )
}

export default App
