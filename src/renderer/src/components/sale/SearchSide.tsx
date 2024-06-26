/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  colors
} from '@mui/material'
import {
  MRT_ColumnDef,
  MRT_TableInstance,
  MaterialReactTable,
  useMaterialReactTable
} from 'material-react-table'
import { Product_Type, SALE_FORM, Saled_Product_Type } from '../../models/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetProductsInStorage } from '../../hooks/storage'
import { useAddProductToRoom, useGetRoomProducts, useResetRoom } from '../../hooks/room'
import { useGetClients } from '../../hooks/client'
import { langFormat } from '../../functions/langFormat'
import { useNavigate } from 'react-router-dom'
import { Clear } from '@mui/icons-material'

interface SearchSideProps {
  currentPage: number
  handleRefund: (products: Saled_Product_Type[]) => void
  handleSale: (
    products: Saled_Product_Type[],
    discount: number,
    buyerName: string,
    saleForm: SALE_FORM
  ) => void
}

function SearchSide({ currentPage, handleSale, handleRefund }: SearchSideProps): JSX.Element {
  const navigate = useNavigate()
  const [saerchValue, setSearchValue] = useState('')

  const searchRef = useRef<HTMLInputElement>(null)
  const [discount, setDiscount] = useState<number>(0)
  const [buyer, setBuyer] = useState<string>('')
  const columns = useMemo<MRT_ColumnDef<Product_Type>[]>(
    () => [
      {
        accessorKey: 'name',
        header: langFormat({
          uzb: 'Nomi',
          ru: 'Название',
          en: 'Name'
        }),
        size: 200
      },
      {
        accessorKey: 'barcode',
        header: langFormat({
          uzb: 'Barkod',
          ru: 'Штрих-код',
          en: 'Barcode'
        }),
        size: 100
      },
      {
        accessorKey: 'price',
        header: langFormat({
          uzb: 'Narxi',
          ru: 'Цена',
          en: 'Price'
        }),
        size: 100,
        enableGlobalFilter: false
      },
      {
        accessorKey: 'count',
        header: langFormat({
          uzb: 'Soni',
          ru: 'Количество',
          en: 'Count'
        }),
        size: 100,
        enableGlobalFilter: false,
        sortDescFirst: true
      }
    ],
    []
  )

  const { data: clients } = useGetClients()
  const { data: products } = useGetProductsInStorage()

  const { mutateAsync: resetRoom } = useResetRoom(currentPage.toString())

  const { mutateAsync: addProduct } = useAddProductToRoom(currentPage.toString())

  const { data: saledProducts, refetch } = useGetRoomProducts(currentPage.toString())

  const handleClickResetRoom = (): void => {
    resetRoom()
    searchRef.current?.getElementsByTagName('input')[0].focus()
  }

  const handleAddProductToSaleSide = (
    product: Product_Type,
    table: MRT_TableInstance<Product_Type>
  ): void => {
    const newSaledProduct: Saled_Product_Type = {
      ...product,
      saledId: Math.random().toString(36).substring(7),
      buyers_name: '',
      saled_price: product.price,
      saled_count: product.count === 0 ? 0 : 1,
      sale_form: SALE_FORM.NONE,
      discount: 0,
      saled_date: new Date().valueOf()
    }

    addProduct(newSaledProduct).then(() => {
      refetch()
      table.setGlobalFilter('')
      setSearchValue('')
    })
  }

  const table = useMaterialReactTable({
    columns,
    data: products || [],
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableColumnFilterModes: false,
    enableColumnOrdering: false,
    enableBottomToolbar: false,
    enableColumnVirtualization: false,
    enableGlobalFilterModes: false,
    enableColumnFilters: false,
    filterFns: {
      startsWithNoSpace: (row, id, value) => {
        return (row.getValue(id) as string)
          .toLocaleLowerCase()
          .replaceAll(' ', '')
          .includes(value.toLocaleLowerCase().replaceAll(' ', ''))
      }
    },
    initialState: {
      showGlobalFilter: true,
      sorting: [
        {
          id: 'count',
          desc: false
        }
      ]
    },
    muiTableBodyRowProps: ({ row, table }) => ({
      onClick: () => {
        handleAddProductToSaleSide(row.original, table)
        searchRef.current?.getElementsByTagName('input')[0].focus()
      }
    }),
    renderTopToolbar: () => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            ref={searchRef}
            autoFocus
            value={saerchValue}
            placeholder={langFormat({
              uzb: 'Qidirish',
              ru: 'Поиск',
              en: 'Search'
            })}
            sx={{ width: '90%', m: 1 }}
            onChange={(e) => {
              setSearchValue(e.target.value)
              table.setGlobalFilter(e.target.value)
            }}
          />
          <Tooltip title={langFormat({ uzb: 'Tozalash', ru: 'Очистить', en: 'Clear' })}>
            <IconButton
              onClick={() => {
                setSearchValue('')
                table.setGlobalFilter(undefined)
                searchRef.current?.getElementsByTagName('input')[0].focus()
              }}
            >
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>
      )
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '350px'
      }
    }
  })

  const handleSaleAs = (saleForm: SALE_FORM) => {
    if (saledProducts) {
      handleSale(saledProducts, discount, buyer, saleForm)
      setBuyer('')
      setDiscount(0)
      searchRef.current?.getElementsByTagName('input')[0].focus()
    }
  }

  const handlePrintCheck = () => {
    if (saledProducts) {
      navigate('/check-print/' + currentPage)
    }
  }

  useEffect(() => {
    const keyDownFunc = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'F1':
          handleSaleAs(SALE_FORM.CASH)
          break
        case 'F2':
          handleSaleAs(SALE_FORM.LOAN)
          break
        case 'F3':
          handleSaleAs(SALE_FORM.CARD)
          break
        case 'F4':
          handleClickResetRoom()
          break
        case 'F5':
          handleRefund(saledProducts || [])
          break
        case 'F6':
          handlePrintCheck()
          break
        case 'Enter': {
          const row = table.getFilteredRowModel().rows[0].original

          const product: Product_Type = {
            id: row.id,
            barcode: row.barcode,
            cost: row.cost,
            count: row.count,
            name: row.name,
            price: row.price
          }

          // check if search Ref is focused
          if (!searchRef.current) return
          if (!searchRef.current.contains(document.activeElement)) return
          handleAddProductToSaleSide(product, table)
          break
        }
      }
    }
    document.addEventListener('keydown', keyDownFunc)

    return () => {
      document.removeEventListener('keydown', keyDownFunc)
    }
  }, [
    discount,
    buyer,
    handleClickResetRoom,
    handleRefund,
    saledProducts,
    searchRef.current,
    table,
    handleAddProductToSaleSide,
    handleSaleAs
  ])

  const disableMode = useMemo(() => {
    return saledProducts?.find(
      (p) =>
        p.saled_count === 0 ||
        p.saled_count < 0 ||
        p.cost === 0 ||
        p.saled_count > p.count ||
        p.saled_price <= 0
    )
  }, [saledProducts])

  const total = useMemo(() => {
    return saledProducts
      ?.reduce((a, b) => a + b.saled_price * b.saled_count * (1 - discount / 100), 0)
      .toLocaleString('ru')
  }, [saledProducts, discount])

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'primary.textContrast',
          borderRadius: 2,
          mr: 'auto',
          p: 2,
          bgcolor: colors.deepOrange[500],
          width: '100%'
        }}
      >
        <Typography color="white" fontSize={20}>
          <b>{langFormat({ uzb: 'Jami', ru: 'Всего', en: 'Total' })}: </b> {total} so'm
        </Typography>
      </Box>

      <MaterialReactTable table={table} />

      <Box sx={{ display: 'flex', gap: '1rem', width: '100%', mt: 'auto' }}>
        <Autocomplete
          fullWidth
          size="small"
          disablePortal
          value={buyer}
          options={(clients || [])?.map((c) => c.name) || []}
          onInputChange={(_e, newValue) => setBuyer(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label={langFormat({
                uzb: 'Haridor',
                ru: 'Покупатель',
                en: 'Buyer'
              })}
              size="small"
              variant="outlined"
            />
          )}
        />

        <TextField
          fullWidth
          size="small"
          label={langFormat({ uzb: 'Chegirma', ru: 'Скидка', en: 'Discount' })}
          type="number"
          value={discount}
          onChange={(e) => setDiscount(+e.target.value)}
        />
      </Box>
      <ButtonGroup
        fullWidth
        sx={{
          width: '100%',
          gap: '1rem',
          boxShadow: 'none'
        }}
        variant="contained"
        size="small"
      >
        <Button
          onClick={() => handleSaleAs(SALE_FORM.CASH)}
          sx={{ bgcolor: colors.green.A400, fontWeight: '800' }}
          disabled={!!disableMode}
        >
          {langFormat({ uzb: 'Naqd', ru: 'Наличка', en: 'Cash' })} [F1]
        </Button>
        <Button
          onClick={() => handleSaleAs(SALE_FORM.LOAN)}
          sx={{ bgcolor: colors.red.A400, fontWeight: '800' }}
          disabled={!!disableMode}
        >
          {langFormat({ uzb: 'Qarz', ru: 'Долг', en: 'Loan' })} [F2]
        </Button>
        <Button
          onClick={() => handleSaleAs(SALE_FORM.CARD)}
          sx={{ bgcolor: colors.blue.A400, fontWeight: '800' }}
          disabled={!!disableMode}
        >
          {langFormat({ uzb: 'Plastik', ru: 'Пластик', en: 'Plastic' })} [F3]
        </Button>
      </ButtonGroup>
      <ButtonGroup
        fullWidth
        sx={{
          width: '100%',
          gap: '1rem',
          boxShadow: 'none'
        }}
        variant="contained"
        size="small"
      >
        <Button
          onClick={() => handleClickResetRoom()}
          fullWidth
          sx={{ bgcolor: colors.red.A400, fontWeight: '800', color: 'white' }}
        >
          {langFormat({ uzb: 'Tozalash', ru: 'Очистить', en: 'Reset' })} [F4]
        </Button>
        <Button
          onClick={() => handleRefund(saledProducts || [])}
          fullWidth
          sx={{
            bgcolor: colors.deepOrange[500],
            fontWeight: '800',
            color: 'white'
          }}
          disabled={!!disableMode}
        >
          {langFormat({ uzb: 'Qaytarish', ru: 'Возврат', en: 'Refund' })} [F5]
        </Button>
        <Button
          onClick={() => handlePrintCheck()}
          fullWidth
          sx={{
            bgcolor: colors.green[500],
            fontWeight: '800',
            color: 'white'
          }}
          disabled={!!disableMode}
        >
          {langFormat({ uzb: 'Chek', ru: 'Чек', en: 'Check' })} [F6]
        </Button>
      </ButtonGroup>
    </Box>
  )
}

export default SearchSide
