import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  colors
} from '@mui/material'

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material'

import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Drawer, DrawerHeader } from '../../components/side-bar'
import { routes } from '../../constants'
import { langFormat } from '../../functions/langFormat'

export default function MiniDrawer(): JSX.Element {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = (): void => {
    setOpen(true)
  }

  const handleDrawerClose = (): void => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ bgcolor: 'primary.dark' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' })
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {langFormat({
              uzb: routes.find((route) => route.path === pathname)?.title.uzb || 'Bosh sahifa',
              en: routes.find((route) => route.path === pathname)?.title.en || 'Home',
              ru: routes.find((route) => route.path === pathname)?.title.ru || 'Главная'
            }) || langFormat({ uzb: 'Bosh sahifa', en: 'Home', ru: 'Главная' })}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {routes.map((route) => (
            <Tooltip
              key={route.path}
              title={langFormat({
                uzb: route.title.uzb,
                en: route.title.en,
                ru: route.title.ru
              })}
            >
              <ListItem disablePadding sx={{ display: 'block', p: 1 }}>
                <ListItemButton
                  onClick={() => navigate(route.path)}
                  sx={[
                    {
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: 2
                    },
                    pathname === route.path && {
                      backgroundColor: colors.amber[300],
                      color: 'primary.contrastText',
                      '& .MuiListItemIcon-root': {
                        color: 'inherit'
                      },
                      '& .MuiListItemText-primary': {
                        fontWeight: 'bold'
                      },
                      ':hover': {
                        backgroundColor: 'transparent'
                      }
                    }
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center'
                    }}
                  >
                    {<route.element />}
                  </ListItemIcon>
                  <ListItemText
                    primary={langFormat({
                      uzb: route.title.uzb,
                      en: route.title.en,
                      ru: route.title.ru
                    })}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  )
}
