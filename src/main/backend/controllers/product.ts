/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Message_Forms } from '../../models/message'
import { Product_Type } from '../../models/types'
import ProductModel from '../schemas/productModel'

const checkProduct = async (product: Product_Type) => {
  const checkProduct = await ProductModel.findOne({
    $or: [{ barcode: product.barcode }, { name: product.name }, { id: product.id }]
  })
  if (checkProduct) {
    return true
  } else {
    return false
  }
}

const checkProductForUpdate = async (product: Product_Type) => {
  const checkProduct = await ProductModel.findOne({
    $or: [{ barcode: product.barcode }, { name: product.name }],
    id: { $ne: product.id }
  })
  if (checkProduct) {
    return true
  } else {
    return false
  }
}

export const createProduct = async (product: Product_Type) => {
  try {
    // build regExp for barcode and name lowercase
    const checked = await checkProduct(product)

    if (checked) {
      return {
        message: Message_Forms.ALREADY_EXISTS
      }
    } else {
      await ProductModel.create(product)

      return {
        message: Message_Forms.SUCCESS
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async () => {
  try {
    const products = await ProductModel.find()
    return products.map((product) => JSON.parse(JSON.stringify(product)))
  } catch (error) {
    console.log(error)
  }
}

export const deleteProduct = async (id: string) => {
  try {
    await ProductModel.deleteOne({ id })
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const updateProduct = async (product: Product_Type) => {
  try {
    const checkProduct = await checkProductForUpdate(product)

    if (checkProduct) {
      return {
        message: Message_Forms.ALREADY_EXISTS
      }
    } else {
      await ProductModel.updateOne({ id: product.id }, product)

      return {
        message: Message_Forms.SUCCESS
      }
    }
  } catch (error) {
    console.log(error)
    return {
      message: Message_Forms.ERROR
    }
  }
}

export const addToStock = async (newProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: newProduct.id }))
    ) as Product_Type

    if (existingProduct) {
      const existingCost = +existingProduct.cost
      const existingCount = +existingProduct.count
      const newCost = +newProduct.cost
      const newCount = +newProduct.count
      newProduct.cost =
        (existingCost * existingCount + newCost * newCount) / (existingCount + newCount)

      newProduct.count = existingCount + newCount
      newProduct.price = newProduct.price !== 0 ? newProduct.price : existingProduct.price

      await ProductModel.updateOne({ id: newProduct.id }, newProduct)
      return Message_Forms.SUCCESS
    } else {
      return Message_Forms.NOT_FOUND
    }
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const updateToStok = async (oldProduct: Product_Type, newProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: newProduct.id }))
    ) as Product_Type

    if (!existingProduct) {
      return Message_Forms.NOT_FOUND
    }

    const existingCost = +existingProduct.cost
    const existingCount = +existingProduct.count
    const newCost = +newProduct.cost
    const newCount = +newProduct.count
    const oldCost = +oldProduct.cost
    const oldCount = +oldProduct.count

    newProduct.count = existingCount + newCount - oldCount
    newProduct.cost =
      (existingCost * existingCount + newCost * newCount - oldCost * oldCount) /
      (existingCount + newCount - oldCount)

    await ProductModel.updateOne({ id: newProduct.id }, newProduct)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}

export const deleteFromStok = async (deletedProduct: Product_Type) => {
  try {
    const existingProduct = JSON.parse(
      JSON.stringify(await ProductModel.findOne({ id: deletedProduct.id }))
    ) as Product_Type

    if (!existingProduct) {
      return Message_Forms.NOT_FOUND
    }

    const existingCost = +existingProduct.cost
    const existingCount = +existingProduct.count
    const deletedCost = +deletedProduct.cost
    const deletedCount = +deletedProduct.count

    existingProduct.count = existingCount - deletedCount <= 0 ? 0 : existingCount - deletedCount
    existingProduct.cost =
      existingCount - deletedCount <= 0
        ? 0
        : (existingCost * existingCount - deletedCost * deletedCount) /
          (existingCount - deletedCount)

    await ProductModel.updateOne({ id: deletedProduct.id }, existingProduct)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
  }
}

export const addAllProducts = async () => {
  try {
    const products = [
      {
        id: '04l9ug',
        name: 'X STEKLO',
        barcode: '10950',
        count: 220024,
        cost: 269969.7309875606,
        price: 20000
      },
      {
        id: '04pzwl',
        name: 'OPPO A9 LCD',
        barcode: '10991',
        count: 5,
        cost: 22000,
        price: 31000
      },
      {
        id: '05opej',
        name: 'P SMART Z LCD ORG',
        barcode: '10070',
        count: 20,
        cost: 30000,
        price: 40000
      },
      {
        id: '05yux',
        name: 'INFINIX SMART 7 STEKLO',
        barcode: '11155',
        count: 20,
        cost: 20000,
        price: 21000
      },
      {
        id: '0df4qi',
        name: 'MI S2 OR LCD',
        barcode: '7274',
        count: 20,
        cost: 20000,
        price: 30000
      },
      {
        id: '0et3z',
        name: 'VIVO Y53S LCD org',
        barcode: '11188',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '0fgwb',
        name: 'MI5+ LCD SERVIS',
        barcode: '10758',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '0g1oi',
        name: 'BN43 BAT',
        barcode: '10323',
        count: 20,
        cost: 20000,
        price: 30000
      },
      {
        id: '0kra4i',
        name: 'P10 LITE LCD',
        barcode: '4404',
        count: 2,
        cost: 180000,
        price: 180000
      },
      {
        id: '0nxk5',
        name: 'OPPO A1K LCD',
        barcode: '11018',
        count: 20,
        cost: 30000,
        price: 40000
      },
      {
        id: '0oli7',
        name: 'NOT9 LCD',
        barcode: '10031',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '0tfwd',
        name: 'NOT8 LCD',
        barcode: '10026',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '0w3ty',
        name: 'BN54 BAT',
        barcode: '10806',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '0x6bu',
        name: 'SPARK GO 2022 LCD ORG',
        barcode: '10741',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '11y8oj',
        name: 'BN44 BATAREKA ORG',
        barcode: '10324',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '13l29',
        name: 'NOT10PRO LCD OLET FRAMELI',
        barcode: '11225',
        count: 6,
        cost: 427833.3333333333,
        price: 460000
      },
      {
        id: '18635',
        name: 'A50 STEKLO',
        barcode: '10747',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1c2c6',
        name: 'POCO M3 PRO STEKLO',
        barcode: '10944',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1lset',
        name: 'A23 LCD SERVIS',
        barcode: '10502',
        count: 3,
        cost: 130000,
        price: 165000
      },
      {
        id: '1q9wu',
        name: 'TECNO POVA NEO LCD',
        barcode: '11068',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1qayq',
        name: 'A260 LCD SERVIS',
        barcode: '10101',
        count: 2,
        cost: 140000,
        price: 165000
      },
      {
        id: '1rin',
        name: 'NOT8 PRO LCD SERVIS',
        barcode: '10996',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1ukrh',
        name: 'NOT4 LCD',
        barcode: '10008',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1wcnt',
        name: 'OPPO A53 LCD',
        barcode: '10849',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '1zehih',
        name: 'A20 LCD SERVIS',
        barcode: '10110',
        count: 1,
        cost: 497000,
        price: 520000
      },
      {
        id: '1zz8f',
        name: 'HONOR 6A LCD',
        barcode: '7061',
        count: 20,
        cost: 20000,
        price: 30000
      },
      {
        id: '21reh',
        name: 'A30S LCD SERVIS',
        barcode: '10152',
        count: 1,
        cost: 527000,
        price: 550000
      },
      {
        id: '237to',
        name: 'NOT 105G LCD',
        barcode: '10034',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '23y3v',
        name: 'A320 LCD OLED',
        barcode: '101741',
        count: 2,
        cost: 310000,
        price: 320000
      },
      {
        id: '249en',
        name: 'REALME C11 2021 LCD',
        barcode: '10092',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2afmn',
        name: 'TECNO CAMON 18P STEKLO',
        barcode: '11249',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2br8ch',
        name: 'A9 2020 STEKLO A5 2020 STEKLO',
        barcode: '11241',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2gpan',
        name: 'OPPO A16 LCD',
        barcode: '9851',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2icz9',
        name: 'J5 LCD SERVIS',
        barcode: '10637',
        count: 4,
        cost: 248000,
        price: 251000
      },
      {
        id: '2j4sr',
        name: 'INFINIX HOT 10 STEKLO',
        barcode: '9580',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2jwjy',
        name: 'A14 LCD SERVIS 4G',
        barcode: '11021',
        count: 5,
        cost: 163000,
        price: 165000
      },
      {
        id: '2p0do',
        name: '4PRO LCD',
        barcode: '1324',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2p4sk',
        name: 'TECNO SPARK 10C LCD',
        barcode: '11186',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2pbusi',
        name: 'INFINIX SMART 7 LCD',
        barcode: '11077',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2q1ku',
        name: 'MI5 LCD SERVIS',
        barcode: '10753',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2rio5',
        name: 'BM35 BAT',
        barcode: '8347',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2s544',
        name: 'REDMI 9A LCD SERVIS',
        barcode: '10763',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2ttdrk',
        name: 'MI5 LCD',
        barcode: '10010',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2xzlv',
        name: 'INFINIX HOT20I LCD ',
        barcode: '11130',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '2zhxu',
        name: 'HONOR 9C P40LITE E LCD',
        barcode: '10063',
        count: 3,
        cost: 150000,
        price: 180000
      },
      {
        id: '2zk8b',
        name: 'REALME C25 LCD',
        barcode: '11024',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '37uhw',
        name: 'J4+ LCD SERVIS',
        barcode: '10125',
        count: 6,
        cost: 105000,
        price: 140000
      },
      {
        id: '3cs6o',
        name: 'MI6 LCD',
        barcode: '10016',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '3e60y',
        name: 'REDMI 12C LCD',
        barcode: '11095',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '3fxj7',
        name: 'HONOR 20 LITE',
        barcode: '7213',
        count: 1,
        cost: 300000,
        price: 300000
      },
      {
        id: '3gdh2',
        name: 'REDMI 7A LCD SERVIS',
        barcode: '11214',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '3gtih',
        name: 'BN51 BAT ORG',
        barcode: '10595',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '3skhp',
        name: 'INFINIX SMART 4 STEKLO',
        barcode: '3728',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '3w12m',
        name: 'REALME 5PRO LCD',
        barcode: '11019',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '42als',
        name: 'SAMSUNG J4 LCD TFT',
        barcode: '9031',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '42zhhf',
        name: 'NOT5 LCD',
        barcode: '10012',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '43mu5j',
        name: 'OPPO A5S STEKLO',
        barcode: '10690',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4anohk',
        name: 'REALME C55 STEKLO',
        barcode: '11183',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4bf24i',
        name: 'A51 STEKLO',
        barcode: '10796',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4f9ku',
        name: 'A54 STEKLO',
        barcode: '3163',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4fgzx',
        name: 'BN34 BAT',
        barcode: '10319',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4hel6',
        name: 'VIVO Y17 LCD',
        barcode: '10471',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '4pdpq',
        name: 'HUAWEI Y3 2017 LCD',
        barcode: '10054',
        count: 1,
        cost: 114000,
        price: 130000
      },
      {
        id: '4szvl',
        name: 'HUAWEI Y5 8 LCD',
        barcode: '10036',
        count: 5,
        cost: 94000,
        price: 130000
      },
      {
        id: '4zomw',
        name: 'TECNO SPARK 8P LCD',
        barcode: '11153',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '5526y',
        name: 'BN46 NOT8 BATAREKA',
        barcode: '10176',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '55egz',
        name: 'REALME 7I STEKLO',
        barcode: '10531',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '55zlv',
        name: 'A41 LCD OLED',
        barcode: '11215',
        count: 1,
        cost: 455000,
        price: 480000
      },
      {
        id: '57cfh',
        name: 'OPPO A74 STEKLO',
        barcode: '10909',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '5gffp',
        name: 'A02 LCD SERVIS',
        barcode: '10097',
        count: 7,
        cost: 105000,
        price: 130000
      },
      {
        id: '5i5yt',
        name: 'TECNO SPARK 7 LCD',
        barcode: '10485',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '5iv8q',
        name: 'A6+ LCD OLED',
        barcode: '10146',
        count: 4,
        cost: 277000,
        price: 320000
      },
      {
        id: '5knqe',
        name: 'VIVO Y19 STEKLO',
        barcode: '10533',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '5m27x',
        name: 'NOT10 PRO LCD SERVIS',
        barcode: '11079',
        count: 1,
        cost: 831000,
        price: 900000
      },
      {
        id: '5z4m6',
        name: 'BN37 BAT',
        barcode: '10321',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '6dbsl',
        name: 'REDMI 9A BN56 BAT',
        barcode: '10235',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '6f5rk',
        name: 'TECNO CAMON 19 STEKLO',
        barcode: '11134',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '6ip2e',
        name: 'REALME C35 LCD',
        barcode: '10992',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '6og8a',
        name: 'A32 LCD SERVIS',
        barcode: '10115',
        count: 1,
        cost: 726000,
        price: 750000
      },
      {
        id: '6wqol',
        name: 'REALME C31 STEKLO',
        barcode: '6824',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '791wa',
        name: 'NOT9S LCD SERVIS ',
        barcode: '10032',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7dlep',
        name: 'HOT12 PLAY STEKLO',
        barcode: '11006',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7e1l0j',
        name: 'REDMI S2 LCD SERVIS',
        barcode: '10022',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7ftqf',
        name: 'J250 LCD OLET 2',
        barcode: '10040',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7o79wl',
        name: 'BN3A BAT',
        barcode: '10327',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7q5qc',
        name: 'VIVO Y33S LCD',
        barcode: '10963',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7rdrb',
        name: 'A22 LCD OLED',
        barcode: '11218',
        count: 3,
        cost: 209000,
        price: 250000
      },
      {
        id: '7sg8o',
        name: 'BN39 BATAREKA',
        barcode: '10895',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7ybn3',
        name: 'POCO X4 PRO STEKLO',
        barcode: '10897',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '7yxo5f',
        name: 'A8+ LCD OLED',
        barcode: '3913',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '86w7yf',
        name: 'OPPO A74 LCD',
        barcode: '10851',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '88n5x',
        name: 'A01 LCD SERVIS',
        barcode: '100096',
        count: 15,
        cost: 110000,
        price: 135000
      },
      {
        id: '8f1h4f',
        name: 'TECNO SPARK 8C STEKLO',
        barcode: '7600',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '8fym1',
        name: 'OPPO A15 STEKLO',
        barcode: '10861',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '8g3ee',
        name: 'A33 SERVIS LCD',
        barcode: '10586',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '8h571',
        name: 'A21S LCD FRAME',
        barcode: '10109',
        count: 1,
        cost: 170000,
        price: 185000
      },
      {
        id: '8p9cz',
        name: 'BM3J BAT',
        barcode: '10325',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '8ryawk',
        name: 'G570 LCD SERVIS',
        barcode: '10126',
        count: 12,
        cost: 132000,
        price: 150000
      },
      {
        id: '8upqo',
        name: 'HONOR 10 LCD',
        barcode: '7149',
        count: 1,
        cost: 190000,
        price: 190000
      },
      {
        id: '8xbz7h',
        name: 'NOT12 LCD OLED',
        barcode: '11269',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '8y5xp',
        name: 'A51 LCD OLED',
        barcode: '10174',
        count: 4,
        cost: 246000,
        price: 280000
      },
      {
        id: '97amv',
        name: 'BM39 BATAREKA',
        barcode: '10787',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '9fjht',
        name: 'HUAWEI Y3 2017 LCD',
        barcode: '5750',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '9h00b',
        name: 'NOT11PRO LCD OLET',
        barcode: '11025',
        count: 4,
        cost: 344000,
        price: 400000
      },
      {
        id: '9pclx',
        name: 'J530 LCD OLED',
        barcode: '10137',
        count: 6,
        cost: 223000,
        price: 250000
      },
      {
        id: '9u5j',
        name: 'INFINIX NOT10 PRO STEKLO',
        barcode: '11264',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '9uyiy',
        name: 'OPPO A74 5G LCD',
        barcode: '11075',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: '9zo71',
        name: 'A750 LCD OLED',
        barcode: '10145',
        count: 1,
        cost: 287000,
        price: 320000
      },
      {
        id: '9zqmy',
        name: 'INFINIX HOT10I STEKLO',
        barcode: '11165',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'a1q8x',
        name: 'REDMI 5A LCD',
        barcode: '10015',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'aadhg',
        name: 'INFINIX ZERO 5G LCD TECNO CAMON',
        barcode: '11173',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ac75f',
        name: 'MI PLAY LCD',
        barcode: '10021',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'adrba',
        name: 'TECNO POUVOIR STEKLO',
        barcode: '4075',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ae8mrf',
        name: 'MI 8LITE LCD SERVIS',
        barcode: '11213',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'aew0l',
        name: 'TECNO CAMON 15 STEKLO',
        barcode: '2486',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ammhr',
        name: 'REALME C11 STEKLO',
        barcode: '10529',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ar0tt',
        name: 'HONOR 10LITE LCD ORG',
        barcode: '10587',
        count: 6,
        cost: 173000,
        price: 210000
      },
      {
        id: 'as0gf',
        name: 'A1+ LCD',
        barcode: '10919',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'as2kq',
        name: 'A20S LCD SERVIS',
        barcode: '10107',
        count: 1,
        cost: 106000,
        price: 145000
      },
      {
        id: 'asn71',
        name: 'IPHONE 11 SENSOR',
        barcode: '11111',
        count: 52,
        cost: 152063.49206349207,
        price: 240000
      },
      {
        id: 'aujk6h',
        name: 'INFINIX NOTE 10PRO LCD',
        barcode: '11056',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'b3tii',
        name: 'NOT8T LCD SERVIS',
        barcode: '11001',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'b5yrs',
        name: 'TECNO SPARK 8PRO LCD',
        barcode: '11172',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'b6w2y',
        name: 'REALME 7I LCD',
        barcode: '11000',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'b8fv4',
        name: 'REALME C30S LCD',
        barcode: '11128',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'bcabk',
        name: 'IPHONE 6G+ LCD',
        barcode: '10083',
        count: 11,
        cost: 221000,
        price: 245000
      },
      {
        id: 'bf3sa',
        name: 'A33 LCD OLED',
        barcode: '11216',
        count: 1,
        cost: 336000,
        price: 370000
      },
      {
        id: 'bsfz',
        name: 'J260 LCD SERVIS',
        barcode: '2051',
        count: 5,
        cost: 124000,
        price: 140000
      },
      {
        id: 'bsymwl',
        name: 'POCO X3 LCD ORG',
        barcode: '11190',
        count: 1,
        cost: 186000,
        price: 210000
      },
      {
        id: 'bx4kk',
        name: 'C25Y STEKLO',
        barcode: '11037',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'bzfys',
        name: 'VIVO V20 STEKLO',
        barcode: '6676',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'c4up9',
        name: 'OPPO A16S LCD',
        barcode: '11105',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'c582x',
        name: 'VIVO BATAREKA ORG',
        barcode: '11122',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'c84h5',
        name: 'realme 8i lcd',
        barcode: '11093',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'cf5nb',
        name: 'OPPO A57 LCD',
        barcode: '11200',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'clogu',
        name: 'MI8 LCD SERVIS',
        barcode: '10757',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'cu5d1',
        name: 'IPHONE 6S+ LCD',
        barcode: '10084',
        count: 2,
        cost: 295000,
        price: 310000
      },
      {
        id: 'd0sxt',
        name: 'REALME C25Y LCD',
        barcode: '10573',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'd41rxi',
        name: 'VIVO Y02A LCD ORG',
        barcode: '11184',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'd42hwl',
        name: 'J710 LCD OLED',
        barcode: '10140',
        count: 5,
        cost: 208000,
        price: 240000
      },
      {
        id: 'd7o6o',
        name: 'TECNO SPARK 5 AIR LCD',
        barcode: '11080',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'd8sql',
        name: 'INFINIX HOT10S LCD',
        barcode: '11154',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'd99g1',
        name: 'HONOR 7C LCD',
        barcode: '10065',
        count: 1,
        cost: 160000,
        price: 190000
      },
      {
        id: 'd9a67',
        name: 'HONOR X6 LCD',
        barcode: '10774',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'dgpqxi',
        name: 'A520 LCD OLED',
        barcode: '10142',
        count: 3,
        cost: 231000,
        price: 260000
      },
      {
        id: 'djvlp',
        name: 'XIOMI 9T LCD OLET',
        barcode: '10202',
        count: 1,
        cost: 425000,
        price: 425000
      },
      {
        id: 'dk1s7',
        name: 'A30S LCD OLED',
        barcode: '10151',
        count: 1,
        cost: 196000,
        price: 220000
      },
      {
        id: 'dmuwh',
        name: 'XIOMI NOT10 LITE LCD',
        barcode: '11046',
        count: 1,
        cost: 320000,
        price: 370000
      },
      {
        id: 'dq9ve',
        name: 'HONOR 8C LCD ORG',
        barcode: '10068',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'dtezf',
        name: 'NOT9S LCD ORG',
        barcode: '10701',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'dwzqe',
        name: 'NOT10S LCD SERVIS',
        barcode: '10094',
        count: 1,
        cost: 311000,
        price: 360000
      },
      {
        id: 'dxxc4h',
        name: 'TECNO SPARK 10PRO LCD ORG',
        barcode: '11275',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'e8i0a',
        name: 'REALME 9PRO LCD',
        barcode: '11178',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'e8qys',
        name: 'IPHONE X GH',
        barcode: '10194',
        count: 2,
        cost: 296000,
        price: 320000
      },
      {
        id: 'eai4ah',
        name: 'POCO X3PRO STEKLO',
        barcode: '2009',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ekux5',
        name: 'TECNO SPARK GO STEKLO',
        barcode: '2337',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'en8y4g',
        name: 'VIVO Y20 LCD',
        barcode: '10636',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'enlrx',
        name: 'J510 LCD OLET2',
        barcode: '10043',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'epk5t',
        name: 'NOT5A LCD SERVIS',
        barcode: '10013',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'epwaol',
        name: 'X LCD ORGINAL',
        barcode: '10088',
        count: 1,
        cost: 517000,
        price: 550000
      },
      {
        id: 'ettuq',
        name: 'VIVO Y19 LCD',
        barcode: '10632',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ez7dg',
        name: 'BN59 BATAREKA NOT10S',
        barcode: '11107',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'f3gww',
        name: 'HONOR X7A',
        barcode: '11116',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'f4288',
        name: 'INFINIX HOT12I LCD',
        barcode: '11104',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'f5mya',
        name: 'TECNO POVA2 LCD',
        barcode: '11064',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fbqzi',
        name: 'NOT8 LCD SERVIS',
        barcode: '10754',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fckhy',
        name: 'BM47 4X BATAREKA',
        barcode: '10175',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fdc2b',
        name: 'IPHONE 7G LCD ORG',
        barcode: '10085',
        count: 7,
        cost: 174000,
        price: 200000
      },
      {
        id: 'fdgzl',
        name: 'A34 LCD SERVIS',
        barcode: '11196',
        count: 1,
        cost: 793000,
        price: 820000
      },
      {
        id: 'fk5i8',
        name: 'A22 LCD SERVIS',
        barcode: '10111',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fopg',
        name: '7+ LCD ORG',
        barcode: '11228',
        count: 8,
        cost: 205000,
        price: 235000
      },
      {
        id: 'fow0q',
        name: 'A127 LCD SERVIS',
        barcode: '10916',
        count: 6,
        cost: 105000,
        price: 140000
      },
      {
        id: 'fxshl',
        name: 'VIVO Y15 LCD',
        barcode: '10588',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fy0ts',
        name: 'NOT11PRO LCD SERVIS',
        barcode: '11098',
        count: 2,
        cost: 380000,
        price: 470000
      },
      {
        id: 'fyg8r',
        name: 'OPPO A54 STEKLO',
        barcode: '10706',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fyp1c',
        name: 'J7 LCD OLED',
        barcode: '10139',
        count: 3,
        cost: 235000,
        price: 235000
      },
      {
        id: 'fytxp',
        name: 'A24 LCD SERVIS',
        barcode: '11195',
        count: 1,
        cost: 720000,
        price: 750000
      },
      {
        id: 'fzn56',
        name: 'REALME 5 STEKLO',
        barcode: '6823',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'fzy2yf',
        name: 'NOT11 STEKLO',
        barcode: '10257',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'g0lsmf',
        name: 'P SMART 2021 LCD',
        barcode: '10067',
        count: 5,
        cost: 163000,
        price: 190000
      },
      {
        id: 'g223hi',
        name: 'TECNO POP 5LITE OR LCD',
        barcode: '11149',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'g4jv8',
        name: 'J8 LCD OLED',
        barcode: '10455',
        count: 1,
        cost: 290000,
        price: 310000
      },
      {
        id: 'g5pme',
        name: 'INFINIX HOT 10S STEKLO',
        barcode: '10511',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'g6xc5',
        name: 'HUAWEI NOVA Y70 LCD',
        barcode: '11004',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'g8kra',
        name: 'REALME 8PRO STEKLO',
        barcode: '10526',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'gfo6el',
        name: 'XS STEKLO',
        barcode: '10951',
        count: 3,
        cost: 23000,
        price: 30000
      },
      {
        id: 'gh1g1k',
        name: 'XS LCD ORG',
        barcode: '10086',
        count: 3,
        cost: 528000,
        price: 550000
      },
      {
        id: 'ghm2t',
        name: 'INFINIX NOTE 11PRO LCD',
        barcode: '1107',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'gi749',
        name: 'TECNO CAMIN 18 STEKLO',
        barcode: '10835',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'glmp1',
        name: 'VIVO Y02 LCD',
        barcode: '11126',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'goe3f',
        name: 'NOT 4X LCD',
        barcode: '10009',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'gswav',
        name: 'IPHONE 5G LCD',
        barcode: '8526',
        count: 6,
        cost: 144000,
        price: 150000
      },
      {
        id: 'h0st3',
        name: 'A52 LCD SERVIS',
        barcode: '10120',
        count: 3,
        cost: 808000,
        price: 830000
      },
      {
        id: 'hdn2xj',
        name: 'J7 PRIME LCD SERVIS',
        barcode: '10128',
        count: 2,
        cost: 137000,
        price: 160000
      },
      {
        id: 'he6si',
        name: 'INFINIX HOT11 PLAY LCD',
        barcode: '10852',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hevk3',
        name: 'TECNO POUVOIR 4',
        barcode: '10538',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hgi8v',
        name: 'A14 LCD SERVIS 5G',
        barcode: '11059',
        count: 2,
        cost: 165000,
        price: 165000
      },
      {
        id: 'hjlwg',
        name: 'INFINIX HOT10 LITE STEKLO',
        barcode: '11002',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hlzvf',
        name: 'BN30 BAT',
        barcode: '10317',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hnlcb',
        name: 'J4 LCD OLED',
        barcode: '10134',
        count: 4,
        cost: 211000,
        price: 240000
      },
      {
        id: 'hpifa',
        name: 'TECNO POVA 2 STEKLO',
        barcode: '11254',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hqck4',
        name: 'XR STEKLO ORG',
        barcode: '11209',
        count: 2,
        cost: 25000,
        price: 35000
      },
      {
        id: 'hst9b',
        name: 'REALME 6 LCD',
        barcode: '10967',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hvngm',
        name: 'OPPO A12 STEKLO',
        barcode: '11163',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'hwt1q',
        name: 'VIVO Y21 LCD Y21S LCD',
        barcode: '11133',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'i1iuml',
        name: 'A1+ LCD SERVIS',
        barcode: '11142',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'i2kah',
        name: 'SAMSUNG A5 LCD TFT',
        barcode: '2429',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'i4udmi',
        name: 'HUAWEI P9 LITE LCD',
        barcode: '1857',
        count: 1,
        cost: 130000,
        price: 175000
      },
      {
        id: 'i906ci',
        name: 'REDMI 6PRO LCD SERVIS',
        barcode: '11036',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'iacxyj',
        name: 'J7 LCD TFT',
        barcode: '5610',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ibmra',
        name: 'REDMI NOT7 LCD SERVIS',
        barcode: '10755',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'idcr5',
        name: 'TECNO CAMON 15 LCD ORG',
        barcode: '11231',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'iinx7j',
        name: 'A01 CORE LCD SERVIS',
        barcode: '10095',
        count: 4,
        cost: 103320,
        price: 135000
      },
      {
        id: 'ijf4p',
        name: 'REDMI 10 LCD SERVIS',
        barcode: '11140',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'imbqx',
        name: 'A51 LCD SERVIS',
        barcode: '10119',
        count: 2,
        cost: 714000,
        price: 750000
      },
      {
        id: 'isokf',
        name: 'TECNO CAMON 17 LCD',
        barcode: '11161',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ive2jk',
        name: 'HUAWEI MATE 20 LITELCD',
        barcode: '9546',
        count: 1,
        cost: 167000,
        price: 185000
      },
      {
        id: 'ivw4f',
        name: 'INFINIX HOT30I LCD ORG',
        barcode: '11257',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'j1zohj',
        name: 'TECNO BATAREKA',
        barcode: '11102',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jceveh',
        name: 'OPPO A5 LCD',
        barcode: '10574',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jgvpng',
        name: 'J510 LCD OLED',
        barcode: '10136',
        count: 2,
        cost: 225000,
        price: 250000
      },
      {
        id: 'jjb8h',
        name: 'INFINIX NOTE 10 STEKLO',
        barcode: '4966',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jjiqe',
        name: 'A22 STEKLO',
        barcode: '10247',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jkv25l',
        name: 'REDMI 9A LCD ORG',
        barcode: '10030',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jogorf',
        name: 'REALME C21Y LCD ORG',
        barcode: '10243',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jp9j8k',
        name: 'J2 LCD OLET 2',
        barcode: '10039',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jpcr3',
        name: 'VIVO Y1S LCD',
        barcode: '11032',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'js4x',
        name: 'P40LITE LCD',
        barcode: '1235',
        count: 2,
        cost: 190000,
        price: 190000
      },
      {
        id: 'jskq3',
        name: 'TECNO 8PRO STEKLO',
        barcode: '11255',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jt51p',
        name: 'IPHONE 8G+ LCD ORG',
        barcode: '11146',
        count: 2,
        cost: 189000,
        price: 220000
      },
      {
        id: 'jvqe4k',
        name: 'TECNO CAMON 12 AIR LCD',
        barcode: '11232',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'jyx8u',
        name: 'P20 LITE LCD',
        barcode: '10051',
        count: 2,
        cost: 121000,
        price: 160000
      },
      {
        id: 'k0qzj',
        name: 'REALME C33 STEKLO',
        barcode: '11274',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'k5zkd',
        name: 'INFINIX NOT11 STEKLO',
        barcode: '10882',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ka592',
        name: 'A310 LCD OLED',
        barcode: '10200',
        count: 1,
        cost: 282000,
        price: 320000
      },
      {
        id: 'ka8fo',
        name: 'TECNO POVA NEO STEKLO',
        barcode: '11008',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'kcnki',
        name: '5X LCD SERVIS',
        barcode: '10014',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'kdong',
        name: 'VIVO V19',
        barcode: '6467',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'kipwy',
        name: 'INFINIX NOT11 LCD',
        barcode: '11020',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'kkxvxi',
        name: 'TECNO SPARK 8C LCD',
        barcode: '11047',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'kv4bi',
        name: 'HUAWEI P SMART LCD',
        barcode: '10052',
        count: 5,
        cost: 144000,
        price: 175000
      },
      {
        id: 'kx00g',
        name: 'TECNO CAMON 15 AIR STEKLO',
        barcode: '9755',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'l37d6',
        name: 'REALME X3 STEKLO 6PRO STEKLO',
        barcode: '9264',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'lb8lf',
        name: 'TECNO POUVIR4 LCD',
        barcode: '11125',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'lbey6',
        name: 'INFINIX HOT11 LCD',
        barcode: '10853',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'lkg44',
        name: 'A52 LCD OLED',
        barcode: '11076',
        count: 3,
        cost: 297000,
        price: 365000
      },
      {
        id: 'lz2h9',
        name: 'A21S LCD SERVIS',
        barcode: '10108',
        count: 3,
        cost: 132000,
        price: 160000
      },
      {
        id: 'm6yla',
        name: 'TECNO SPARK 7 STEKLO',
        barcode: '10545',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'm7nl',
        name: 'INFINIX SMART 5 LCD',
        barcode: '10890',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'm9uri',
        name: 'A31 LCD OLED',
        barcode: '10199',
        count: 3,
        cost: 206000,
        price: 235000
      },
      {
        id: 'me1cg',
        name: 'REDMI 3X',
        barcode: '4103',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'medpw',
        name: 'INFINIX HOT10 PLAY LCD',
        barcode: '10998',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mfkmi',
        name: 'MATE 10 LITE LCD',
        barcode: '11045',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mgzpj',
        name: 'BN52 BAT',
        barcode: '10807',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mmtud',
        name: 'REALME 6 STEKLO',
        barcode: '10521',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mn523',
        name: 'BM4J BAT',
        barcode: '10328',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mo4za',
        name: 'INFINIX ZERO 8 STEKLO',
        barcode: '11230',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'mohcph',
        name: 'NOT11 LCD SERVIS',
        barcode: '11096',
        count: 9,
        cost: 352000,
        price: 400000
      },
      {
        id: 'mtxdo',
        name: 'TECNO POP 7 STEKLO',
        barcode: '11233',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'n0ony',
        name: 'A03 CORE LCD SERVIS',
        barcode: '10113',
        count: 1,
        cost: 108000,
        price: 135000
      },
      {
        id: 'n3wne',
        name: 'VIVO Y30 STEKLO',
        barcode: '6762',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'n5axx',
        name: 'REALME C55 LCD',
        barcode: '11181',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nd0qo',
        name: 'INFINIX HOT20 PLAY LCD',
        barcode: '11268',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ndkdy',
        name: 'REALME NARZO 30A LCD',
        barcode: '10367',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'neaet',
        name: '4S LCD',
        barcode: '2651',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'netgq',
        name: 'VIVO Y1S STEKLO',
        barcode: '10534',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ni96e',
        name: 'TECNO POP 7PRO LCD SERVIS',
        barcode: '11115',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nj5sh',
        name: '11PRO LCD ORG',
        barcode: '10488',
        count: 1,
        cost: 620000,
        price: 650000
      },
      {
        id: 'nktxy',
        name: 'HONOR 7X LCD',
        barcode: '10071',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nlqzp',
        name: 'OPPO A54 LCD',
        barcode: '10850',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nnlmc',
        name: 'VIVO Y12 STEKLO',
        barcode: '10528',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nsvuq',
        name: 'IPHONE 11 LCD ORG',
        barcode: '10339',
        count: 2,
        cost: 267000,
        price: 320000
      },
      {
        id: 'nuzalj',
        name: 'A6 LCD OLED',
        barcode: '10138',
        count: 3,
        cost: 326000,
        price: 355000
      },
      {
        id: 'nv0bw',
        name: 'TECNO SPARK 9PRO',
        barcode: '11048',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nwgs1f',
        name: 'HUAWEI Y3 3G LCD',
        barcode: '6762',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'nyl7e',
        name: 'HONOR X8 LCD SERVIS',
        barcode: '10899',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'o2ffl',
        name: 'TECNO SPARK GO 2021 LCD',
        barcode: '8187',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'o7xmx',
        name: 'REDMI7 LCD SERVIS',
        barcode: '11044',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'o88ct',
        name: 'BN48 BAT',
        barcode: '10302',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'o8p9x',
        name: 'NOT11 PRO STEKLO ORG',
        barcode: '11051',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'o8x7m',
        name: 'P30 LITE LCD ORG',
        barcode: '10073',
        count: 8,
        cost: 160000,
        price: 195000
      },
      {
        id: 'oahhxh',
        name: 'Y7 2019 LCD',
        barcode: '10050',
        count: 6,
        cost: 120000,
        price: 135000
      },
      {
        id: 'oebvb',
        name: 'A53 LCD OLED',
        barcode: '11180',
        count: 2,
        cost: 418000,
        price: 460000
      },
      {
        id: 'ogpwj',
        name: 'IPHONE 11 STEKLO',
        barcode: '11109',
        count: 2,
        cost: 22500,
        price: 30000
      },
      {
        id: 'ohqcvj',
        name: 'INFINIX NOTE 8 LCD',
        barcode: '11166',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'olrq9',
        name: 'BN57 BAT ORG',
        barcode: '8178',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'omgsw',
        name: 'Y5 2019 LCD',
        barcode: '10048',
        count: 2,
        cost: 135000,
        price: 135000
      },
      {
        id: 'oofv9',
        name: 'VIVO Y20S LCD',
        barcode: '10797',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'opn3f',
        name: 'BN41 BAT',
        barcode: '10322',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'oryrpk',
        name: 'M12 LCD SERVIS',
        barcode: '10106',
        count: 5,
        cost: 112000,
        price: 140000
      },
      {
        id: 'otqxn',
        name: 'OPPO A12 LCD',
        barcode: '11169',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'p0fcp',
        name: 'XR LCD ORG',
        barcode: '11270',
        count: 1,
        cost: 245000,
        price: 280000
      },
      {
        id: 'palrd',
        name: 'TECHNO SPARK 9PRO STEKLO',
        barcode: '11250',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'pjjvf',
        name: 'Y6 2018 LCD',
        barcode: '10047',
        count: 3,
        cost: 130000,
        price: 130000
      },
      {
        id: 'pl5cc',
        name: 'VIVO V21 STEKLO',
        barcode: '11062',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'pmndxi',
        name: 'TECNO CAMON 12 LCD',
        barcode: '11263',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'pv6jw',
        name: 'HONOR 8X LCD SERVIS',
        barcode: '10072',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'pydui',
        name: 'A40 LCD SERVIS',
        barcode: '10116',
        count: 1,
        cost: 596000,
        price: 630000
      },
      {
        id: 'pzxog',
        name: 'IPHONE XS GH',
        barcode: '10193',
        count: 2,
        cost: 277000,
        price: 320000
      },
      {
        id: 'qfkdz',
        name: 'VIVO Y30 2021 LCD',
        barcode: '11086',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qgehug',
        name: 'REALME 7 LCD',
        barcode: '10868',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qk234',
        name: 'A13 LCD SERVIS',
        barcode: '10420',
        count: 4,
        cost: 131000,
        price: 150000
      },
      {
        id: 'qkbj2',
        name: 'NOT5 LCD SERVIS',
        barcode: '10756',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qkxr6',
        name: 'HOT11 PLAY STEKLO',
        barcode: '11055',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qnt1mg',
        name: 'INFINIX NOT8 STEKLO',
        barcode: '11229',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qnuvf',
        name: 'A510 LCD OLED',
        barcode: '10143',
        count: 2,
        cost: 234000,
        price: 255000
      },
      {
        id: 'qqbd1l',
        name: 'TECNO SPARK 5 PRO STEKLO',
        barcode: '8003',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qugrbh',
        name: 'NOT6PRO LCD SERVIS',
        barcode: '10894',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'qyr5r',
        name: 'NOT9 LCD SERVIS',
        barcode: '11039',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'r195q',
        name: 'HONOR 9A LCD Y6P 2020 LCD',
        barcode: '10075',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'r4rsh',
        name: 'VIVO Y12S STEKLO',
        barcode: '11013',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'r6mi4',
        name: 'TECNO CAMON 12 STEKLO',
        barcode: '1236',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'r70of',
        name: 'INFINIX HOT10 PLAY STEKLO',
        barcode: '10460',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'r8jex',
        name: 'A32 5G LCD SERVIS',
        barcode: '6643',
        count: 2,
        cost: 112000,
        price: 150000
      },
      {
        id: 'r91yzg',
        name: 'NOT10 5G LCD SERVIS',
        barcode: '10981',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'rcw03',
        name: 'A20 LCD OLED',
        barcode: '10148',
        count: 2,
        cost: 202000,
        price: 230000
      },
      {
        id: 'rhxac',
        name: 'A22 5G LCD SERVIS',
        barcode: '10112',
        count: 7,
        cost: 136000,
        price: 160000
      },
      {
        id: 'ri5h4',
        name: 'BN4A NOT7 BAT',
        barcode: '10177',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'rjxtd',
        name: 'A41 STEKLO',
        barcode: '10746',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'rt1ho',
        name: 'IPHONE 11PRO GH LCD',
        barcode: '11220',
        count: 1,
        cost: 355000,
        price: 400000
      },
      {
        id: 'ruuk9',
        name: '4X LCD ORG',
        barcode: '10002',
        count: 0,
        cost: 0,
        price: 120000
      },
      {
        id: 's2faf',
        name: 'J250 LCD OLED',
        barcode: '10132',
        count: 12,
        cost: 220000,
        price: 240000
      },
      {
        id: 's5kk3h',
        name: 'SAMSUNG J110 LCD TFT',
        barcode: '10037',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 's6rf6',
        name: 'HUAWEI P8 LITE 2017 LCD',
        barcode: '10053',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 's6xsb',
        name: 'A32 LCD OLED',
        barcode: '10921',
        count: 3,
        cost: 237000,
        price: 280000
      },
      {
        id: 's9dhh',
        name: 'A41 LCD SERVIS',
        barcode: '10117',
        count: 2,
        cost: 640000,
        price: 655000
      },
      {
        id: 's9ze5',
        name: 'P SMART2019 LCD ORG',
        barcode: '10750',
        count: 4,
        cost: 171000,
        price: 200000
      },
      {
        id: 'sab7k',
        name: 'A50 LCD SERVIS',
        barcode: '10118',
        count: 1,
        cost: 532000,
        price: 550000
      },
      {
        id: 'scmhkk',
        name: 'BN63 BAT REDMI 9T BATAREKA',
        barcode: '11175',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'sf4raf',
        name: 'A34 STEKLO',
        barcode: '4274',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'sg6ee',
        name: 'J120 LCD OLET 2',
        barcode: '10038',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'sqezx',
        name: 'OPPO A72 LCD SERVIS',
        barcode: '11074',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'sql45',
        name: 'A8 LCD OLED',
        barcode: '10144',
        count: 7,
        cost: 362000,
        price: 385000
      },
      {
        id: 'srcky',
        name: 'MI9 LCD SERVIS',
        barcode: '10760',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'subdp',
        name: 'VIVO Y93 LCD ORG',
        barcode: '10943',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'suee0f',
        name: 'Y6 2019 LCD SERVIS',
        barcode: '10049',
        count: 4,
        cost: 120000,
        price: 145000
      },
      {
        id: 'suiya',
        name: ' VIVO Y22 LCD',
        barcode: '11067',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'sviw0j',
        name: 'TECNO POVA NEO 2 LCD',
        barcode: '11158',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 't05rq',
        name: 'REALME C30 LCD',
        barcode: '11085',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 't0avzf',
        name: 'HONOR 50 LITE LCD',
        barcode: '11091',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 't6skhj',
        name: 'REDMI 10C LCD SERVIS',
        barcode: '10762',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'talx7',
        name: 'NOT8T LCD',
        barcode: '10027',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'tetdy',
        name: 'INFINIX HOT30 PLAY STEKLO',
        barcode: '11118',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'tetybf',
        name: 'A52 STEKLO ORG',
        barcode: '11050',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'tgwe9',
        name: 'VIVO Y16 LCD',
        barcode: '11147',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'to9qj',
        name: 'TECNO POVA 3 LCD',
        barcode: '11124',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'tu29',
        name: 'TECNO POP 6PRO LCD',
        barcode: '11092',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'tug3e',
        name: 'REDMI 12 LCD SERVIS',
        barcode: '11222',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'u51zc',
        name: 'A54 LCD SERVIS',
        barcode: '11168',
        count: 2,
        cost: 780000,
        price: 810000
      },
      {
        id: 'u5gwp',
        name: 'REDMI 9T LCD SERVIS',
        barcode: '10759',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'u5we0l',
        name: 'HONOR X8A 2023 LCD SERVIS',
        barcode: '11070',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ukwx4',
        name: 'HONOR 20 LCD',
        barcode: '10613',
        count: 2,
        cost: 200000,
        price: 200000
      },
      {
        id: 'um3c7',
        name: 'BN35 BAT',
        barcode: '10320',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'uncht',
        name: 'TECNO POVA5 LCD',
        barcode: '11219',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'unhpp',
        name: 'TECNO SPARK 6 STEKLO',
        barcode: '4150',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ut4te',
        name: 'INFINIX HOT30 PLAY LCD',
        barcode: '11157',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'ut7q7',
        name: 'OPPO A15S STEKLO',
        barcode: '11198',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'uzf38k',
        name: '6S LCD ORG',
        barcode: '10155',
        count: 7,
        cost: 151000,
        price: 185000
      },
      {
        id: 'v2j8q',
        name: 'J320 LCD OLET2',
        barcode: '10041',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vb0sjh',
        name: 'OPPO A52 LCD',
        barcode: '10848',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vk8cj',
        name: 'IPHONE 5S LCD',
        barcode: '9127',
        count: 3,
        cost: 130000,
        price: 140000
      },
      {
        id: 'vm6gbf',
        name: 'TECNO CAMON 16 LCD',
        barcode: '11031',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vmjdh',
        name: 'INFINIX SMART 6+ LCD',
        barcode: '11243',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vnqe7',
        name: 'A02S LCD SERVIS',
        barcode: '10098',
        count: 3,
        cost: 99000,
        price: 120000
      },
      {
        id: 'vrefm',
        name: 'HOT 12 STEKLO',
        barcode: '4133',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vwlz3',
        name: 'TECNO SPARK 5 LCD',
        barcode: '11152',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vy4oh',
        name: 'BN31 BAT',
        barcode: '10316',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'vzc2n',
        name: 'HONOR 9 LITE LCD',
        barcode: '10062',
        count: 2,
        cost: 127000,
        price: 175000
      },
      {
        id: 'w8tqfk',
        name: 'A32 STEKLO',
        barcode: '10244',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'w8xcu',
        name: 'A720 LCD OLED',
        barcode: '10172',
        count: 1,
        cost: 215000,
        price: 240000
      },
      {
        id: 'wggjn',
        name: '4A LCD ',
        barcode: '10006',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'wgjopl',
        name: 'HONOR X7 LCD SERVIS',
        barcode: '10893',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'wj9oug',
        name: 'VIVO Y19C STEKLO',
        barcode: '3675',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'wtl9l',
        name: '6G LCD ORG',
        barcode: '10751',
        count: 6,
        cost: 150000,
        price: 185000
      },
      {
        id: 'wwi76g',
        name: 'TECNO SPARK GO LCD',
        barcode: '7475',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'wwqmo',
        name: 'BN5D BATAREKA',
        barcode: '11189',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'x2rk1',
        name: 'INFINIX HOT10I LCD',
        barcode: '10854',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'x8d38k',
        name: 'INFINIX HOT 11S STEKLO',
        barcode: '1414',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xamo4',
        name: 'A31 LCD SERVIS',
        barcode: '10114',
        count: 2,
        cost: 595000,
        price: 615000
      },
      {
        id: 'xcl96i',
        name: 'XS MAX STEKLO',
        barcode: '2973',
        count: 1,
        cost: 35000,
        price: 35000
      },
      {
        id: 'xcu3a',
        name: 'TECNO CAMON 18 LCD',
        barcode: '11162',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xh6ty',
        name: 'REALME C3 LCD',
        barcode: '10090',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xhhw1',
        name: 'A50 LCD OLED',
        barcode: '10150',
        count: 5,
        cost: 198000,
        price: 230000
      },
      {
        id: 'xmtu7',
        name: 'VIVO Y91 STEKLO',
        barcode: '11182',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xo1u1',
        name: 'MI NOT8 DUBAI LCD',
        barcode: '2383',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xt4pkh',
        name: 'VIVO Y22S LCD',
        barcode: '11078',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xyjrlg',
        name: 'M20 LCD SERVIS',
        barcode: '10127',
        count: 2,
        cost: 122000,
        price: 150000
      },
      {
        id: 'xz5hv',
        name: 'BN55 BAT',
        barcode: '10808',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xzd82',
        name: 'TECNO SPARK 4 STEKLO',
        barcode: '2950',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'xzgyz',
        name: 'MI7A LCD',
        barcode: '10023',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'y3can',
        name: 'BN62 BATAREKA ORG',
        barcode: '11156',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'y74nv',
        name: 'J730 LCD OLED',
        barcode: '10141',
        count: 4,
        cost: 189000,
        price: 220000
      },
      {
        id: 'ycend',
        name: 'IPHONE 11PRO STEKLO',
        barcode: '11112',
        count: 2,
        cost: 26000,
        price: 35000
      },
      {
        id: 'ydx1x',
        name: 'TECNO CAMON19 LCD',
        barcode: '11121',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'yk5qm',
        name: 'A04S LCD SERVIS',
        barcode: '11016',
        count: 5,
        cost: 99000,
        price: 150000
      },
      {
        id: 'ymx1h',
        name: 'BN47 BAT',
        barcode: '10301',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'yqhh6',
        name: 'A11 LCD SERVIS',
        barcode: '10104',
        count: 3,
        cost: 128000,
        price: 155000
      },
      {
        id: 'yzq1q',
        name: 'MI6X LCD',
        barcode: '10035',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'z1rgy',
        name: 'NOT11E LCD SERVIS',
        barcode: '11072',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'z2c5sk',
        name: 'A04 LCD SERVIS',
        barcode: '11015',
        count: 1,
        cost: 113000,
        price: 140000
      },
      {
        id: 'z5tsp',
        name: 'A710 LCD OLED',
        barcode: '10153',
        count: 4,
        cost: 205000,
        price: 240000
      },
      {
        id: 'zahtgg',
        name: 'BN53 BAT NOT10PRO BAT',
        barcode: '11174',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zayfg',
        name: 'VIVO Y12S LCD ORG',
        barcode: '10089',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zdc6zk',
        name: 'VIVO Y31 2020 LCD ',
        barcode: '10667',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zds79',
        name: 'TECNO SPARK 8P STEKLO',
        barcode: '11262',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zdzta',
        name: 'OPPO A15 LCD',
        barcode: '10619',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zg5f8',
        name: 'A6 LCD SERVIS',
        barcode: '10167',
        count: 1,
        cost: 407000,
        price: 450000
      },
      {
        id: 'zok8l',
        name: 'BN49 7A BAT',
        barcode: '10178',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zow2m',
        name: 'HUAWEI Y90 LCD ORG',
        barcode: '11201',
        count: 0,
        cost: 0,
        price: 0
      },
      {
        id: 'zspubk',
        name: 'J330 LCD SERVIS',
        barcode: '10124',
        count: 10,
        cost: 116000,
        price: 155000
      },
      {
        id: 'zyhnc',
        name: 'Y8 P LCD',
        barcode: '10995',
        count: 2,
        cost: 145000,
        price: 170000
      },
      {
        id: 'y90p8',
        name: 'A10 LCD SERVIS',
        barcode: '10102',
        count: 6,
        cost: 92000,
        price: 115000
      },
      {
        id: 'o39un',
        name: 'A12 LCD SERVIS',
        barcode: '10105',
        count: 7,
        cost: 106000,
        price: 130000
      },
      {
        id: 'up1jh',
        name: 'A10S LCD SERVIS',
        barcode: '10103',
        count: 7,
        cost: 96000,
        price: 115000
      },
      {
        id: '3uitak',
        name: 'server 1',
        barcode: '2203',
        count: 0,
        cost: 0,
        price: 30000
      },
      {
        id: '9srbm',
        name: 'IPHONE X SENSOR',
        barcode: '10651',
        count: 4,
        cost: 84846.15384615384,
        price: 86000
      }
    ]

    await ProductModel.insertMany(products)
    return Message_Forms.SUCCESS
  } catch (error) {
    console.log(error)
    return Message_Forms.ERROR
  }
}
