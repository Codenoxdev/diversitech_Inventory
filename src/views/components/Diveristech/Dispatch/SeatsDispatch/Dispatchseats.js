import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Link from 'next/link'
import {
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  FormHelperText
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SearchIcon from '@mui/icons-material/Search'
import TableSortLabel from '@mui/material/TableSortLabel'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Invoice from '../Invoice/invoice'
import { Controller, useForm } from 'react-hook-form'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },

  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const WDTable = () => {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [Dispatchseats, setDispatchseats] = useState([])

  // console.log(Dispatchseats + 'dISPATCH VALUE')
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code') // Default sorting column
  const [inc, setInc] = useState('asc')
  const [open, setOpen] = useState(false)
  const [count, setcount] = useState(0)
  const Router = useRouter()
  const { dispatch_no, seats_no, dispatch_date } = Router.query
  let plan_no = dispatch_no
  const [invoicePrinted, setInvoicePrinted] = useState(true)
  const [openPopup, setOpenPopup] = useState(false)
  const pdfContainerRef = useRef()
  const [popuppath, setpopuppath] = useState('')
  const [popupopen, setpopupopen] = useState(false)

  const imagepopup = row => {
    setpopuppath(JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`)
  }

  const handleShowInvoice = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  // const handlePrintInvoice = () => {
  //   window.print()
  // }

  const handleDownloadPDF = async () => {
    try {
      const options = {
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      }
      const pdfDoc = new jsPDF(options)
      const pdfContainer = pdfContainerRef.current
      if (pdfContainer) {
        const pdfElement = (
          <React.Fragment>
            <div ref={pdfContainerRef}>
              <Invoice />
            </div>
          </React.Fragment>
        )
        const canvas = await html2canvas(pdfContainer, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        pdfDoc.addImage(imgData, 'PNG', 10, 10, 190, 0)
        pdfDoc.save('invoice.pdf')
      } else {
        console.error('Unable to get the target element.')
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  // console.log(inputValue + 'dispatch plan Number')

  const DispatchseatSubmit = () => {
    setOpen(false)

    // console.log('123check =' + Dispatchseats, plan_no)
    try {
      if (!Dispatchseats) {
        toast.success('Please select Buses', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500 // Display the toast for 1.5 seconds
        })
      }

      const response = fetch('/api/Diversitech/Workers/Dispatch/Seats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Dispatchseats, plan_no })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data.message)

          if (data.success) {
            toast.success(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500 // Display the toast for 1.5 seconds
            })
            setTimeout(() => {
              window.location.href = `/components/Diversitech/Workers/Dispatch/Busplan/?dispatch_no=${dispatch_no}&dispatch_date=${dispatch_date}`
            }, 1000)
          } else {
            toast.error(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })

            if (data.error) {
              toast.error(data.error, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              })
            }

            // console.error('Dispatch failed:', data.message)
          }
        })
        .catch(error => {
          console.error(error)
        })
    } catch (err) {
      console.error('Error sending data:', err)
    }
  }

  // const handleInputChange = event => {
  //   const value = event.target.value
  //   setInputValue(value)
  //   setcount(1)
  //   if (inputValue !== '') {
  //     const timeout = setTimeout(() => {
  //       setInputValue('')
  //     }, 1000)

  //     return () => clearTimeout(timeout)
  //   }
  // }

  const handleInputChange = event => {
    const value = event.target.value
    setInputValue(value)
    const validPartNumber = Dispatchseats.some(row => row.vecv_part_no === value)
    if (validPartNumber) {
      setcount(1)
      setError('Barcode', null)

      const timeout = setTimeout(() => {
        setInputValue('')
      }, 1000)

      return () => clearTimeout(timeout)
    } else {
      setError('Barcode', {
        type: 'manual',
        message: 'Invalid part number!'
      })

      const timeout = setTimeout(() => {
        setInputValue('')
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    // defaultValues,
    mode: 'onBlur'

    // resolver: yupResolver(schema)
  })

  React.useEffect(() => {
    try {
      fetch('/api/Diversitech/Workers/Dispatch/Dispatchseats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no, seats_no })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data from the API')
          }

          return response.json()
        })
        .then(data => {
          // console.log('API Response:', data)
          // console.log(data + '=========data')
          setDispatchseats(data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      // console.error(error)
      setDispatchseats([])
    }
  }, [plan_no])

  React.useEffect(() => {
    if (inputValue !== '') {
      setDispatchseats(prevDispatchseats =>
        prevDispatchseats.map(row =>
          row.vecv_part_no === inputValue &&
          row.dispatch_quantity < row.available_quantity &&
          row.available_quantity > 0 &&
          row.dispatch_quantity < row.request_quantity
            ? { ...row, dispatch_quantity: Math.floor(row.dispatch_quantity) + count }
            : row
        )
      )

      // )
    }
  }, [inputValue])

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const sortedBusPlans = Dispatchseats.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'item_code') {
      return isAsc ? a.vecv_part_no.localeCompare(b.vecv_part_no) : b.item_code.localeCompare(a.vecv_part_no)
    }
    if (dec === 'item_description') {
      return isAsc ? a.vecv_part_no.localeCompare(b.vecv_part_no) : b.item_code.localeCompare(a.vecv_part_no)
    }
    if (dec === 'quantity') {
      return isAsc ? a.quantity.localeCompare(b.quantity) : b.quantity.localeCompare(a.quantity)
    }
    if (dec === 'request_quantity') {
      return isAsc
        ? a.request_quantity.localeCompare(b.request_quantity)
        : b.request_quantity.localeCompare(a.request_quantity)
    }
    if (dec === 'dispatch_quantity') {
      return isAsc
        ? a.dispatch_quantity.localeCompare(b.dispatch_quantity)
        : b.dispatch_quantity.localeCompare(a.dispatch_quantity)
    }
    if (dec === 'available_quantity') {
      return isAsc
        ? a.available_quantity.localeCompare(b.available_quantity)
        : b.available_quantity.localeCompare(a.available_quantity)
    }

    return 0
  })

  return (
    <>
      <ToastContainer />
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Button size='medium' onClick={handleShowInvoice} variant='contained'>
          Show Invoice
        </Button>

        {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold', padding: '5px' }}>
            Barcode
          </Typography>

          <TextField
            type='Barcode'
            label='Scan Barcode'
            id='form-props-Barcode-input'
            autoComplete='current-Barcode'
            value={inputValue}
            onChange={handleInputChange}
          />
        </Box> */}
        <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'bold', padding: '5px' }}>
              Barcode
            </Typography>

            {/* <TextField
            type='Barcode'
            label='Scan Barcode'
            id='form-props-Barcode-input'
            autoComplete='current-Barcode'
            value={inputValue}
            onChange={handleInputChange}
          /> */}

            <Controller
              name='Barcode'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  autoFocus
                  label='Scan Barcode'
                  value={inputValue}
                  onBlur={onBlur}
                  onChange={handleInputChange}
                  helperText={
                    errors.Barcode && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.Barcode.message}</FormHelperText>
                    )
                  }
                />
              )}
            />
            {/* {errors.Barcode && <FormHelperText sx={{ color: 'error.main' }}>{errors.Barcode.message}</FormHelperText>} */}
          </Box>
        </form>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'right' }}>
          <TextField
            style={{ width: '150px' }}
            label='Search'
            variant='standard'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon /> }}
          />
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Vecv No
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Description
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'quantity'}
                  direction={inc === 'quantity' ? inc : inc}
                  onClick={() => handleSortRequest('quantity')}
                >
                  Qty Per Bus
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Image
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'quantity'}
                  direction={inc === 'quantity' ? inc : inc}
                  onClick={() => handleSortRequest('quantity')}
                >
                  Required Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'request_quantity'}
                  direction={inc === 'request_quantity' ? inc : inc}
                  onClick={() => handleSortRequest('request_quantity')}
                >
                  Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'available_quantity'}
                  direction={inc === 'available_quantity' ? inc : inc}
                  onClick={() => handleSortRequest('available_quantity')}
                >
                  available Quantity
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={7}>
                  <Typography>Loading...</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : Dispatchseats.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={7}>
                  <Typography>No data available</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              sortedBusPlans
                .filter(row => !searchTerm || row.vecv_part_no.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((row, index) =>
                  !searchTerm || row.vecv_part_no.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <StyledTableRow key={row.item_id}>
                      <StyledTableCell component='th' scope='row' align='left'>
                        {row.vecv_part_no}
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.quantity}</StyledTableCell>
                      {/* {row.image_url ? ( */}
                      <StyledTableCell align='right'>
                        <img
                          alt='Dispatch'
                          width='50px'
                          src={JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`}
                          onClick={() => {
                            imagepopup(row), setpopupopen(true)
                          }}
                        />
                      </StyledTableCell>
                      {/* ) : (
                        <StyledTableCell align='right'>
                          <img
                            alt='Dispatch'
                            width='50px'
                            src={`/image/logo/unavailable.png`}
                            onClick={() => {
                              imagepopup(row), setpopupopen(true)
                            }}
                          />
                        </StyledTableCell>
                      )} */}
                      {/* <StyledTableCell align='right'>
                        <img
                          alt='Dispatch'
                          width='50px'
                          src={`${row.image_path}${row.item_code}.png`}
                          onClick={() => {
                            imagepopup(row), setpopupopen(true)
                          }}
                        />
                      </StyledTableCell> */}
                      <StyledTableCell align='right'>{row.request_quantity}</StyledTableCell>
                      <StyledTableCell align='right'>{row.dispatch_quantity}</StyledTableCell>
                      <StyledTableCell align='right'>{row.available_quantity}</StyledTableCell>
                    </StyledTableRow>
                  ) : null
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid padding='20px'>
          <Link
            href={`/components/Diversitech/Workers/Dispatch/Busplan/?dispatch_no=${dispatch_no}&dispatch_date=${dispatch_date}`}
          >
            <Button size='medium' type='submit' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
        <Grid padding='20px'>
          {count === 0 ? (
            <Button size='medium' disabled type='submit' variant='contained'>
              Submit
            </Button>
          ) : (
            <Button size='medium' type='submit' variant='contained' onClick={() => setOpen(true)}>
              Submit
            </Button>
          )}
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* <DialogTitle>Confirmation</DialogTitle> */}
        <DialogContent>
          <Typography>Are you sure you want to save?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid padding='20px'>
              <Button size='medium' onClick={DispatchseatSubmit} variant='contained'>
                Yes
              </Button>
            </Grid>
            <Grid padding='10px'>
              <Button size='medium' onClick={() => setOpen(false)} type='submit' variant='contained'>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog open={openPopup} onClose={handleClosePopup} maxWidth='lg' fullWidth={true}>
        <DialogContent>
          <div ref={pdfContainerRef}>
            {' '}
            {/* Use the container element */}
            <Invoice />
          </div>
        </DialogContent>
        <Grid container justifyContent='center' alignItems='center'>
          <Grid padding='20px'>
            <Button size='medium' onClick={() => handleClosePopup(false)} type='submit' variant='contained'>
              Back
            </Button>
          </Grid>
          {/* {invoicePrinted ? (
            <Grid padding='10px'>
              <Button size='medium' onClick={handlePrintInvoice} variant='contained'>
                Print
              </Button>
            </Grid>
          ) : (
            <Grid padding='10px'>
              <Button size='medium' disabled variant='contained'>
                Print
              </Button>
            </Grid>
          )} */}
          <Grid padding='10px'>
            <Button size='medium' onClick={handleDownloadPDF} variant='contained'>
              PDF
            </Button>
          </Grid>
        </Grid>
      </Dialog>

      <Dialog open={popupopen} onClose={() => setpopupopen(false)}>
        {' '}
        <DialogContent>
          <img alt='Image' width='150px' height='150px' style={{ cursor: 'pointer' }} src={`${popuppath}`} />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default WDTable
