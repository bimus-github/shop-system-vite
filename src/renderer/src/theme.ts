import { PaletteMode, colors, createTheme } from '@mui/material'

export const theme = ({
  mode,
  fontSize,
  fontFamily
}: {
  mode: PaletteMode | undefined
  fontSize: number
  fontFamily: string
}): ReturnType<typeof createTheme> => {
  return createTheme({
    palette: {
      mode,
      primary:
        mode === 'dark'
          ? {
              light: '#333333',
              main: '#232323',
              dark: '#000000',
              contrastText: '#fff'
            }
          : {
              light: '#ffffff',
              main: '#f5f5f5',
              dark: '#e6e6e6',
              contrastText: '#000'
            },
      secondary:
        mode === 'dark'
          ? {
              light: '#4f4f4f',
              main: '#232323',
              dark: '#181818',
              contrastText: '#fff'
            }
          : {
              light: '#c1c1c1',
              main: '#b2b2b2',
              dark: '#7c7c7c',
              contrastText: '#000'
            },
      background: {
        default: mode === 'dark' ? colors.grey[900] : colors.grey[200],
        paper: mode === 'dark' ? colors.grey[900] : colors.grey[200]
      }
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderRadius: 0,
            borderBottom: '1px solid lightgray',
            borderTop: '1px solid lightgray'
          }
        }
      }
    },
    typography: {
      fontSize,
      fontFamily
    }
  })
}
