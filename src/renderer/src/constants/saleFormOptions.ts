import { SALE_FORM } from '../models/types'

const data: { value: SALE_FORM; label: string }[] = Object.values(SALE_FORM).map((value) => ({
  value,
  label: value
}))

export default data
