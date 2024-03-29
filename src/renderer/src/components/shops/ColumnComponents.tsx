/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Autocomplete, TextField } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { useGetProductsInStorage } from '@renderer/hooks/storage'
import { Product_Type } from '@renderer/models/types'
import { MRT_Cell, MRT_Column, MRT_Row, MRT_TableInstance } from 'material-react-table'

interface EditByProps {
  cell: MRT_Cell<Product_Type, unknown>
  column: MRT_Column<Product_Type, unknown>
  row: MRT_Row<Product_Type>
  table: MRT_TableInstance<Product_Type>
  validationErrors: Record<string, string | undefined>
  setValidationErrors: (validationErrors: Record<string, string | undefined>) => void
  setSelectedProduct: (product: Product_Type | undefined) => void
}

export const EditName = ({
  row: { original },
  setValidationErrors,
  validationErrors,
  setSelectedProduct
}: EditByProps) => {
  const { data: productsInStorage } = useGetProductsInStorage()
  return (
    <Autocomplete
      options={productsInStorage?.map((p: Product_Type) => p.name) || []}
      defaultValue={original.name || ''}
      onInputChange={(_event, newValue) => {
        if (newValue) {
          delete validationErrors.name
          setValidationErrors(validationErrors)

          const newProduct = productsInStorage?.find((p: Product_Type) => p.name === newValue)

          if (newProduct) {
            setSelectedProduct(newProduct)
          } else {
            setSelectedProduct(undefined)
          }
        } else {
          validationErrors.name = langFormat({
            uzb: 'Mahsulot nomi',
            ru: 'Название продукта',
            en: 'Product name'
          })
          setValidationErrors(validationErrors)
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={langFormat({
            uzb: 'Mahsulot nomi',
            ru: 'Название продукта',
            en: 'Product name'
          })}
          variant="standard"
          error={!!validationErrors.name}
          helperText={validationErrors.name}
          onFocus={() => {
            delete validationErrors.name
            setValidationErrors(validationErrors)
          }}
        />
      )}
    />
  )
}
