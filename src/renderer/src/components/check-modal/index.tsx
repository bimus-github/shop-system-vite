/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useRef, useState, useTransition } from 'react'
import { Modal as MuiModal, Paper, TextField, Typography, Button, FormControl } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import './print.css'

import { useReactToPrint } from 'react-to-print'

import Barcode from 'react-barcode'
import { Print } from '@mui/icons-material'

import { Product_Type } from '../../models/types'
import { useGetProductsInStorage } from '../../hooks/storage'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function PrintModal(): JSX.Element {
  const transition = useTransition()
  const { productId } = useParams()
  const [extraInfo, setExtraInfo] = useState('')
  const [product, setProduct] = useState<Product_Type>()
  const { data: products } = useGetProductsInStorage()
  const printRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const extra = localStorage.getItem('extraInfo')

    if (extra) {
      setExtraInfo(extra)
    }
  }, [])

  useEffect(() => {
    const product = products?.find((p) => p.id === productId) as Product_Type

    if (product) {
      setProduct(product)
    }
  }, [productId])

  const handleClose = () => {
    navigate(-1)
  }

  const handlePrint = useReactToPrint({
    content: () => {
      return printRef.current
    },
    pageStyle: '@page {quality: 100}'
  })

  useEffect(() => {
    const keydownFonc = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handlePrint()
      }
    }

    document.addEventListener('keydown', keydownFonc)

    return () => {
      document.removeEventListener('keydown', keydownFonc)
    }
  }, [])

  return (
    <MuiModal open={true} onClose={handleClose}>
      <FormControl
        sx={style}
        onSubmit={(e) => {
          e.preventDefault()
          handlePrint()
        }}
      >
        {!product ? (
          <Typography>Mahsulot topilmadi</Typography>
        ) : (
          <Paper
            ref={printRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '45mm',
              height: '27mm',
              lineHeight: '15px'
            }}
          >
            <Typography
              align="center"
              fontSize={18}
              sx={{
                fontWeight: 'bold',
                lineHeight: '15px',
                marginRight: '10px'
              }}
            >
              {product.name}
            </Typography>
            <Barcode width={1.7} height={25} displayValue={false} value={product.barcode} />
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-around',
                alignItems: 'center'
              }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>{product.barcode}</Typography>
              <Typography sx={{ fontWeight: 'bold' }}>{extraInfo}</Typography>
            </div>
          </Paper>
        )}

        <TextField
          sx={{ marginTop: '15px' }}
          value={extraInfo}
          onChange={(e) => {
            setExtraInfo(e.target.value)

            transition[1](() => {
              localStorage.setItem('extraInfo', e.target.value)
            })
          }}
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Qo'shimcha ma'lumot"
          label="Qo'shimcha"
        />

        <Button
          type="submit"
          fullWidth
          size="small"
          sx={{ marginTop: '15px' }}
          variant="contained"
          onClick={handlePrint}
        >
          <Print /> Print
        </Button>
      </FormControl>
    </MuiModal>
  )
}

export default PrintModal
