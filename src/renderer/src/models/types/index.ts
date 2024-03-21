import { SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'

export type Data_Type = {
  user: User_Type
  products: Product_Type[]
  shops: Shop_Type[]
  saled_products: Saled_Product_Type[]
  clients: Client_Type[]
  moneys: Money_Type[]
  refunds: Refund_Type[]
  date: number
}

export type User_Type = {
  email: string
  password: string
}

export type Product_Type = {
  id: string
  name: string
  price: number
  cost: number
  count: number
  barcode: string
}

export type Shop_Type = {
  id: string
  name: string
  phone: string
  date: number
  loan_price: number
  products: Product_Type[]
}

export type Saled_Product_Type = Product_Type & {
  saledId: string
  buyers_name: string
  discount: number
  saled_count: number
  saled_date: number
  saled_price: number
  sale_form: SALE_FORM
}

export type Client_Type = {
  id: string
  name: string
  phone: string
  date: string
}

export type Refund_Type = {
  id: string
  name: string
  price: number
  barcode: string
  count: number
  date: string
}

export type Money_Type = {
  id: string
  value: number
  date: number
  reason: MONEY_REASON
  extraInfo: string
}

export enum MONEY_REASON {
  TAKE = 'Olish',
  PUT = "Qo'shish",
  NONE = 'Boshqa'
}

export enum SALE_FORM {
  LOAN = 'Qarz',
  CARD = 'Karta',
  CASH = 'Naqd',
  NONE = 'Boshqa'
}

export type Route_Type = {
  path: PATH_NAME
  element: OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string
  }
  title: {
    uzb: string
    en: string
    ru: string
  }
}

export type Sale_Room_Type = {
  id: string
  products: Saled_Product_Type[]
}

export enum PATH_NAME {
  SALE = '/',
  SHOPS = '/shops',
  SALE_HISTORY = '/sale-history',
  REPORT = '/report',
  SETTING = '/setting',
  CLIENTS = '/clients',
  STORAGE = '/storage',
  REJECTORS = '/rejectors',
  MONEY = '/money',
  PRODUCTS_IN_SHOP = 'shops/:shopId',
  NOT_FOUND = '*'
}

export enum LANGUAGE {
  EN = 'en',
  RU = 'ru',
  UZB = 'uzb'
}
