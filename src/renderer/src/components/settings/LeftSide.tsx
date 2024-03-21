/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useLayoutEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Divider,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
  colors
} from '@mui/material'
import BgColorSwitch from '../bg-color-switch'
import { LANGUAGE } from '../../models/types'
import { langFormat } from '../../functions/langFormat'
import { fontFamilies } from '../../constants'

function LeftSide(): JSX.Element {
  const [isDark, setIsDark] = useState(true)
  const [fontSize, setFontSize] = useState(18)
  const [lang, setLang] = useState<LANGUAGE>(LANGUAGE.UZB)
  const [fontFamily, setFontFamily] = useState(fontFamilies[0])

  useLayoutEffect(() => {
    const settings = localStorage.getItem('settings')
    if (settings) {
      const { isDark, fontSize, fontFamily } = JSON.parse(settings)
      const lang = localStorage.getItem('lang')
      setIsDark(isDark)
      setFontSize(fontSize)
      setFontFamily(fontFamily)
      lang && setLang(lang as LANGUAGE)
    }
  }, [])

  const handleSaveSettings = () => {
    const settings = {
      isDark,
      fontSize,
      fontFamily
    }

    localStorage.setItem('settings', JSON.stringify(settings))
    localStorage.setItem('lang', lang)

    window.location.reload()
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography fontWeight={'bold'} fontSize={'20px'}>
        {langFormat({ uzb: 'Sozlamalar', ru: 'Настройки', en: 'Settings' })}
      </Typography>
      <Divider orientation="horizontal" />
      <Box>
        <Typography fontWeight={'bold'}>
          {langFormat({ uzb: 'Tema', en: 'Theme', ru: 'Тема' })}
        </Typography>
        <Box sx={{ ml: 5, mt: 2 }}>
          <BgColorSwitch checked={isDark} onChange={() => setIsDark(!isDark)} />
        </Box>
      </Box>
      <Box>
        <Typography fontWeight={'bold'}>
          {langFormat({
            uzb: 'Shrif Sozlamasi',
            en: 'Font Settings',
            ru: 'Настройки шрифта'
          })}
        </Typography>
        <TextField
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          label={langFormat({
            uzb: 'Font hajmi',
            en: 'Font Size',
            ru: 'Размер шрифта'
          })}
          size="small"
          sx={{ ml: 5, mt: 2, width: '400px' }}
        />
        <Autocomplete
          options={fontFamilies}
          value={fontFamily}
          onInputChange={(_, f) => setFontFamily(f)}
          renderOption={(_props, f) => {
            return (
              <ListItem key={f}>
                <ListItemButton onClick={() => setFontFamily(f)} sx={{ fontFamily: f }}>
                  {f}
                </ListItemButton>
              </ListItem>
            )
          }}
          size="small"
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label={langFormat({ uzb: 'Shrif', en: 'Font', ru: 'Шрифт' })}
              sx={{ ml: 5, mt: 2, width: '400px' }}
            />
          )}
        />
      </Box>
      <Box sx={{ paddingRight: '50px' }}>
        <Typography fontWeight={'bold'}>
          {langFormat({ uzb: 'Til', en: 'Language', ru: 'Язык' })}
        </Typography>
        <Box sx={{ ml: 5, mt: 2 }}>
          <ButtonGroup
            color="inherit"
            orientation="horizontal"
            size="small"
            variant="contained"
            fullWidth
          >
            {Object.values(LANGUAGE).map((l) => (
              <Button
                key={l}
                sx={{ fontWeight: 'bold' }}
                onClick={() => setLang(l)}
                color={l === lang ? 'info' : 'inherit'}
              >
                {l}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>
      <Box
        sx={{
          mt: '20px'
        }}
      >
        <Button
          sx={{
            bgcolor: colors.blue[500],
            color: 'primary.contrastText',
            fontWeight: 'bold'
          }}
          onClick={handleSaveSettings}
        >
          {langFormat({ uzb: 'Saqlash', en: 'Save', ru: 'Сохранить' })}
        </Button>
      </Box>
    </Box>
  )
}

export default LeftSide
