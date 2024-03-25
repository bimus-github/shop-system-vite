import { Refresh } from '@mui/icons-material'
import { Autocomplete, Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { useGetClients } from '@renderer/hooks/client'
import { useUpdateSaledProduct } from '@renderer/hooks/sale'
import { SALE_FORM, Saled_Product_Type } from '@renderer/models/types'
import { MRT_Cell, MRT_Column, MRT_Header, MRT_Row, MRT_TableInstance } from 'material-react-table'
import { useMemo } from 'react'

type FilterByProps = {
  column: MRT_Column<Saled_Product_Type, unknown>
  header: MRT_Header<Saled_Product_Type>
  rangeFilterIndex?: number | undefined
  table: MRT_TableInstance<Saled_Product_Type>
}

type SalefFromCell = {
  cell: MRT_Cell<Saled_Product_Type, unknown>
  column: MRT_Column<Saled_Product_Type, unknown>
  renderedCellValue: React.ReactNode
  table: MRT_TableInstance<Saled_Product_Type>
  row: MRT_Row<Saled_Product_Type>
}

type Footer = {
  column: MRT_Column<Saled_Product_Type, unknown>
  footer: MRT_Header<Saled_Product_Type>
  table: MRT_TableInstance<Saled_Product_Type>
}

export function FilterByBuyer(props: FilterByProps): JSX.Element {
  const { data: clients } = useGetClients()
  return (
    <Autocomplete
      {...props}
      autoFocus={true}
      options={clients?.map((client) => client.name) || []}
      onChange={(_, value) => {
        props.column.setFilterValue(value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          sx={{ width: '200px' }}
          placeholder={langFormat({
            uzb: 'Xaridor',
            ru: 'Покупатель',
            en: 'Buyer'
          })}
        />
      )}
    />
  )
}

export function FilterBySaleForm(props: FilterByProps): JSX.Element {
  return (
    <Autocomplete
      {...props}
      options={Object.values(SALE_FORM)}
      defaultValue={SALE_FORM.LOAN}
      onInputChange={(_, value) => {
        props.column.setFilterValue(value)
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          sx={{ width: '100px' }}
          placeholder={langFormat({
            uzb: 'Sotish formasi',
            ru: 'Форма продажи',
            en: 'Sale form'
          })}
        />
      )}
    />
  )
}

export function SalefFromCell(props: SalefFromCell): JSX.Element {
  const data = props.row.original
  const form = props.row.original.sale_form

  const { mutateAsync: updateSaledProduct } = useUpdateSaledProduct()
  return (
    <Box
      {...props}
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: '0.5rem'
      }}
    >
      <Typography sx={{ color: form === SALE_FORM.LOAN ? 'red' : '' }}>{data.sale_form}</Typography>
      <Tooltip
        title={langFormat({
          uzb: 'Pul shaklini o`zgartirish',
          ru: 'Изменить счет',
          en: 'Change form of payment'
        })}
      >
        <IconButton
          onClick={() => {
            if (
              !confirm(
                langFormat({
                  uzb: 'O`zgartirishni istaysizmi?',
                  ru: 'Изменить?',
                  en: 'Change?'
                })
              )
            )
              return

            const newSaleForm =
              data.sale_form === SALE_FORM.CASH
                ? SALE_FORM.CARD
                : data.sale_form === SALE_FORM.LOAN
                  ? SALE_FORM.CASH
                  : SALE_FORM.LOAN

            const saledProduct: Saled_Product_Type = {
              id: data.id,
              name: data.name,
              barcode: data.barcode,
              saled_count: data.saled_count,
              cost: data.cost,
              saled_price: data.saled_price,
              sale_form: newSaleForm,
              buyers_name: data.buyers_name,
              discount: data.discount,
              saled_date: data.saled_date,
              count: data.count,
              price: data.price,
              saledId: data.saledId
            }

            updateSaledProduct(saledProduct).then((result) => {
              alert(result || 'success')
            })
          }}
        >
          <Refresh />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export function PriceFooter(props: Footer): JSX.Element {
  const { table } = props
  const total = useMemo(
    () =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) =>
            sum +
            row.original.saled_price * row.original.saled_count * (1 - row.original.discount / 100),
          0
        ),
    [table]
  )
  return <Typography fontWeight={'bold'}>{total.toLocaleString()}</Typography>
}

export function ProfitFooter(props: Footer): JSX.Element {
  const { table } = props
  const total = useMemo(
    () =>
      table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) =>
            sum +
            (row.original.saled_price * (1 - row.original.discount / 100) - row.original.cost) *
              row.original.saled_count,
          0
        )
        .toLocaleString(),
    [table]
  )
  return <Typography fontWeight={'bold'}>{total.toLocaleString()}</Typography>
}
