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
      mode: mode,
      primary: {
        main: mode === 'light' ? colors.blue[500] : colors.grey[700],
        contrastText: colors.common.white
      },
      secondary: {
        main: mode === 'light' ? colors.blueGrey[900] : colors.grey[100],
        contrastText: mode === 'light' ? colors.common.white : colors.common.black
      },
      background: {
        default: mode === 'light' ? colors.common.white : colors.common.black,
        paper: mode === 'light' ? colors.common.white : colors.common.black
      },
      text: {
        primary: mode === 'light' ? colors.common.black : colors.common.white,
        disabled: mode === 'light' ? colors.grey[600] : colors.grey[400],
        secondary: mode === 'light' ? colors.blue[500] : colors.blueGrey[200]
      },
      divider: mode === 'light' ? colors.grey[300] : colors.grey[900],
      action: {
        hover: mode === 'light' ? colors.blue[200] : colors.grey[500]
      },
      common: {
        black: colors.grey[800],
        white: colors.grey[100]
      },
      contrastThreshold: 3,
      error: {
        main: colors.red[500],
        contrastText: colors.common.white
      }
    },
    components: {
      MuiSvgIcon: {
        defaultProps: {
          sx: {
            color: 'text.primary',
            ':active': {
              color: 'primary.contrastText'
            }
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
