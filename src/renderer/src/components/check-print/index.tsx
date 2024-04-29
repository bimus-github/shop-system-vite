/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, useRef } from 'react'
import { Modal as MuiModal, Button, FormControl } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import './index.css'

import { useReactToPrint } from 'react-to-print'

import { langFormat } from '@renderer/functions/langFormat'
import { useGetRoomProducts } from '@renderer/hooks/room'
import { Print } from '@mui/icons-material'

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

function CheckPrintModal(): JSX.Element {
  const { roomId } = useParams()
  const { data: saledProducts } = useGetRoomProducts(roomId!)
  const printRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const companyName = localStorage.getItem('companyName') || ''
  const phoneNumber = localStorage.getItem('phoneNumber') || ''
  const address = localStorage.getItem('address') || ''

  const handleClose = () => {
    navigate(-1)
  }

  const handlePrint = useReactToPrint({
    content: () => {
      return printRef.current
    },
    pageStyle: '@page {quality: 100%}'
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
        <div className="container">
          <div ref={printRef} className="paper">
            <p className="title">{companyName}</p>
            <p className="small">
              TEL: {phoneNumber} <br />
              {langFormat({ en: 'Address', uzb: 'Manzil', ru: 'Адрес' })}: {address}
            </p>
            {saledProducts.length !== 0 && (
              <>
                <p className="small date">
                  {langFormat({ en: 'Date', uzb: 'Sana', ru: 'Дата' })}:{' '}
                  {new Date().toLocaleString('ru-RU')}
                </p>
                <hr />
                {saledProducts?.map((product, index) => (
                  <div key={product.id} className="item">
                    <p className="name">
                      {index + 1}. {product.name}
                    </p>
                    <p className="price">
                      {product.saled_price.toLocaleString('ru-RU')} X {product.saled_count}
                    </p>
                  </div>
                ))}
                <hr />
                <p className="total">
                  {langFormat({ en: 'Total', uzb: 'Jami', ru: 'Всего' })}:{' '}
                  {saledProducts
                    ?.reduce((a, b) => a + b.saled_price * b.saled_count, 0)
                    .toLocaleString('ru-RU')}
                </p>
              </>
            )}
            <p className="small" style={{ marginBottom: '10px' }}>
              {langFormat({
                uzb: 'Haridingiz uchun raxmat',
                en: 'Thank you for using our service',
                ru: 'Спасибо за использование нашего сервиса'
              })}
            </p>
            <p className="brand">Do'konlarni aftomatlashtirish hizmati: (99) 109-01-00</p>
          </div>
        </div>

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

export default CheckPrintModal
