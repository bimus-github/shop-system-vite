import { PATH_NAME, Route_Type } from '../models/types'
import {
  Assessment,
  AttachMoney,
  CallMissedOutgoing,
  History,
  LocalAtm,
  Person,
  Settings,
  ShoppingCart,
  Storage
} from '@mui/icons-material'

const routes: Route_Type[] = [
  {
    path: PATH_NAME.SALE,
    element: AttachMoney,
    title: {
      uzb: 'Savdo',
      en: 'Sale',
      ru: 'Продажа'
    }
  },
  {
    path: PATH_NAME.SALE_HISTORY,
    element: History,
    title: {
      uzb: 'Savdo tarixi',
      en: 'Sale history',
      ru: 'История продаж'
    }
  },
  {
    path: PATH_NAME.STORAGE,
    element: Storage,
    title: {
      uzb: 'Ombor',
      en: 'Storage',
      ru: 'Склад'
    }
  },
  {
    path: PATH_NAME.SHOPS,
    element: ShoppingCart,
    title: {
      uzb: 'Magazinlar',
      en: 'Shops',
      ru: 'Магазины'
    }
  },

  {
    path: PATH_NAME.CLIENTS,
    element: Person,
    title: {
      uzb: 'Mijozlar',
      en: 'Clients',
      ru: 'Клиенты'
    }
  },
  {
    path: PATH_NAME.REJECTORS,
    element: CallMissedOutgoing,
    title: {
      uzb: 'Qaytish',
      en: 'Rejectors',
      ru: 'Отказывающиеся'
    }
  },
  {
    path: PATH_NAME.MONEY,
    element: LocalAtm,
    title: {
      uzb: 'Kirim & Chiqim',
      en: ' Money',
      ru: 'Деньги'
    }
  },
  {
    path: PATH_NAME.REPORT,
    element: Assessment,
    title: {
      uzb: 'Hisobotlar',
      en: 'Reports',
      ru: 'Отчеты'
    }
  },
  {
    path: PATH_NAME.SETTING,
    element: Settings,
    title: {
      uzb: 'Sozlamalar',
      en: 'Settings',
      ru: 'Настройки'
    }
  }
]

export default routes
