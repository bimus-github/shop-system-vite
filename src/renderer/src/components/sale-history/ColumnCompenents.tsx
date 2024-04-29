import { Close, Refresh } from '@mui/icons-material'
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import { langFormat } from '@renderer/functions/langFormat'
import { useGetClients } from '@renderer/hooks/client'
import { useUpdateSaledProduct } from '@renderer/hooks/sale'
import { SALE_FORM, Saled_Product_Type } from '@renderer/models/types'
import { MRT_Cell, MRT_Column, MRT_Header, MRT_Row, MRT_TableInstance } from 'material-react-table'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

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
          autoFocus
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

export function FilterByDate(props: FilterByProps): JSX.Element {
  const [now, setNow] = useState(
    new Date().toLocaleDateString('ru-RU', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit'
    })
  )

  useEffect(() => {
    props.column.setFilterValue(now)
  }, [])

  return (
    <TextField
      {...props}
      value={now}
      onChange={(e) => {
        props.column.setFilterValue(e.target.value)
        setNow(e.target.value)
      }}
      variant="standard"
      sx={{ width: '200px' }}
      placeholder={langFormat({
        uzb: 'Sana',
        ru: 'Дата',
        en: 'Date'
      })}
      InputProps={{
        endAdornment: (
          <Close
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              props.column.setFilterValue('')
              setNow('')
            }}
          />
        )
      }}
    />
  )
}

export function FilterBySaleForm(props: FilterByProps): JSX.Element {
  return (
    <Autocomplete
      {...props}
      options={Object.values(SALE_FORM)}
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

            toast((t) => (
              <Box>
                <div>
                  {langFormat({
                    uzb: 'Pul shaklini o`zgartirishni istaysizmi?',
                    ru: 'Изменить счет?',
                    en: 'Change form of payment?'
                  })}
                </div>
                <br />
                <Button onClick={() => toast.dismiss(t.id)}>
                  {langFormat({ uzb: 'Bekor qilish', ru: 'Отмена', en: 'Cancel' })}
                </Button>
                <Button
                  color="error"
                  onClick={async () => {
                    toast.dismiss(t.id)
                    await toast.promise(
                      updateSaledProduct(saledProduct).then((result) => {
                        result && toast.success(result)
                      }),
                      {
                        loading: langFormat({
                          uzb: 'Pul shaklini o`zgartirish...',
                          ru: 'Изменение счета...',
                          en: 'Changing form of payment...'
                        }),
                        success: langFormat({
                          uzb: 'Pul shaklini o`zgartirildi',
                          ru: 'Изменение счета завершено',
                          en: 'Form of payment changed successfully'
                        }),
                        error: langFormat({
                          uzb: 'Pul shaklini o`zgartirishda xatolik yuz berdi',
                          ru: 'Изменение счета произошла ошибка',
                          en: 'Error while changing form of payment'
                        })
                      }
                    )
                  }}
                >
                  {langFormat({ uzb: 'Ha', ru: 'Да', en: 'Yes' })}
                </Button>
              </Box>
            ))
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
  const total = table
    .getFilteredRowModel()
    .rows.reduce(
      (sum, row) =>
        sum +
        row.original.saled_price * row.original.saled_count * (1 - row.original.discount / 100),
      0
    )
  return (
    <Typography fontWeight={'bold'}>
      {total.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
    </Typography>
  )
}

export function ProfitFooter(props: Footer): JSX.Element {
  const { table } = props
  const total = table
    .getFilteredRowModel()
    .rows.reduce(
      (sum, row) =>
        sum +
        (row.original.saled_price * (1 - row.original.discount / 100) - row.original.cost) *
          row.original.saled_count,
      0
    )
    .toLocaleString('ru-RU', { maximumFractionDigits: 0 })
  return <Typography fontWeight={'bold'}>{total}</Typography>
}
