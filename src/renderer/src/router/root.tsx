import { createHashRouter, createRoutesFromElements, Route } from 'react-router-dom'
import {
  Clients,
  Money,
  NotFound,
  Refund,
  Report,
  Sale,
  SaleHistory,
  Settings,
  Shops,
  SideBar,
  Storage
} from '../pages'
import { PATH_NAME } from '../models/types'
import { ProductsListInShop } from '../components/shops'
import PrintModal from '../components/qr-code-print'
import CheckPrintModal from '@renderer/components/check-print'

export const root = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<SideBar />}>
      <Route path={PATH_NAME.SALE} element={<Sale />}>
        <Route path="/check-print/:roomId" element={<CheckPrintModal />} />
      </Route>
      <Route path={PATH_NAME.STORAGE} element={<Storage />}>
        <Route path={':productId'} element={<PrintModal />} />
      </Route>
      <Route path={PATH_NAME.SHOPS} element={<Shops />} />
      <Route path={PATH_NAME.PRODUCTS_IN_SHOP} element={<ProductsListInShop />}>
        <Route path={':productId'} element={<PrintModal />} />
      </Route>
      <Route path={PATH_NAME.SALE_HISTORY} element={<SaleHistory />} />
      <Route path={PATH_NAME.CLIENTS} element={<Clients />} />
      <Route path={PATH_NAME.REJECTORS} element={<Refund />} />
      <Route path={PATH_NAME.REPORT} element={<Report />} />
      <Route path={PATH_NAME.MONEY} element={<Money />} />
      <Route path={PATH_NAME.SETTING} element={<Settings />} />
      <Route path={PATH_NAME.NOT_FOUND} element={<NotFound />} />
    </Route>
  )
)
