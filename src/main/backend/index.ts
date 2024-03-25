import mongoose from 'mongoose'
import { productRoutes } from './routes/product'
import { shopRoutes } from './routes/shop'
import { roomRoutes } from './routes/room'
import { clientRoutes } from './routes/client'
import { saleRoutes } from './routes/sale'
import { refundRoutes } from './routes/refund'
import { moneyRoutes } from './routes/money'
import { dataRoutes } from './routes/data'
import { userRoutes } from './routes/user'
import { mongodb_local } from './consts'
// import { addAllSaledProducts } from './controllers/saledProduct'

mongoose
  .connect(mongodb_local)
  .then(() => {
    // product routes
    productRoutes()

    // shop routes
    shopRoutes()

    // room routes
    roomRoutes()

    // client routes
    clientRoutes()

    // sale routes
    saleRoutes()

    // refund routes
    refundRoutes()

    // money routes
    moneyRoutes()

    // data routes
    dataRoutes()

    // user routes
    userRoutes()

    // addAllSaledProducts().then(() => console.log('added all saled products'))
  })
  .catch((err) => console.error(err))
