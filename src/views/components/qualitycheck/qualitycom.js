import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import {
  Card,
  CardContent,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableBody,
  TableSortLabel,
  Box,
  TextField
} from '@mui/material'
import Link from 'next/link'

// import QualityTable from './qualityTable'
import Barcode from 'react-barcode'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BWIP from 'bwip-js'

// import { transporter } from 'src/configs/nodemailer'

// const data = [
//   { part_number: 'E121M01303', name: 'TOP HANDLE' },
//   { part_number: 'E121B01287', name: 'Bagholder' },
//   { part_number: 'D100U02009', name: 'Reargrabhandle' }
// ]

const QualityCom = () => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { plan_no, item_code, item_id, plan_date, frame_id, seat_id } = router.query

  const [selected, setSelected] = useState([])
  const [rows, setRows] = useState([])
  const [type, setType] = useState('')
  const [open, setOpen] = useState(false)
  const [SubDialog, setSubDialog] = useState(false)
  const [countMap, setCountMap] = useState({})
  const [count, setCount] = useState(0)
  const [subCount, setsubCount] = useState(0)
  const filteredRow = busPlans.find(row => item_code === row.item_code)

  const [count_value, setCount_value] = useState(0)
  const [value, setvalue] = useState(1)
  const [datavalue, setdatavalue] = useState([])
  console.log(datavalue.qc_qty)
  const [valuecheck, setvaluecheck] = useState(0)
  const [inputValue, setInputValue] = useState('')

  // Function to fetch data from the API based on the plan_no
  const fetchBusPlans = async () => {
    try {
      const response = plan_no
        ? await fetch(
            `/api/Diversitech/Workers/Assembly/Seat/?plan_no=${encodeURIComponent(
              plan_no
            )}&item_id=${encodeURIComponent(item_id)}`
          )
        : await fetch('/api/Diversitech/Workers/Assembly/Seat/')
      if (!response.ok) {
        throw new Error('Failed to fetch data from the API')
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setBusPlans(data)
      } else {
        console.error('API Response is not an array:', data)
        setBusPlans([])
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setBusPlans([])
      setLoading(false)
    }
  }

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

  const fetchPartData = async () => {
    try {
      const response = await fetch(`/api/Diversitech/Workers/Assembly/SeatPart/?seat_id=${seat_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setRows(data)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartData()
    handlecheckdb()
    fetchBusPlans()
    if (rows.length > 0) {
      const allItemCodes = rows.map(row => row.item_code)
      setSelected(allItemCodes)
    }
  }, [seat_id, plan_no])

  // Function to handle the increment and decrement of count for a specific item
  // const handleCountChange = (itemCode, newCount) => {
  //   setCountMap(prevCountMap => ({
  //     ...prevCountMap,
  //     [itemCode]: newCount
  //   }))
  // }

  const updateQcProdQty = async () => {
    setsubmitopen(false)
    setSubDialog(false)
    setvalue(1)
    try {
      const response = await fetch('/api/Diversitech/Workers/Qualitycheck/QcImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_code, count_value, plan_no, type, frame_id, subCount })
      })

      if (!response.ok) {
        throw new Error('Failed to update qc_qty')
      }
      const updatedData = await response.json()

      // console.log(updatedData + ' ' + updatedData.message)
      if (updatedData.success) {
        toast.success(updatedData.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
        printBarcode()
        setsubmitopen(false)
        setCount_value(0)
        if (subCount) {
          window.location.reload()
        }

        // setTimeout(() => {
        //   window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
        // }, 1000)
      } else {
        setCount(0)
        toast.error(updatedData.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      }

      if (updatedData.error) {
        toast.error(updatedData.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDecrement = () => {
    if (count > 0 || count_value > 0) {
      setCount(count - 1)
      setCount_value(count_value - 1)
      setvalue(value - subCount)
      setsubCount(subCount + 1)
    }
  }

  // const printBarcode = () => {
  //   setOpen(false)
  //   window.print()
  //   {
  //     parseInt(rq) === parseInt(count)
  //       ? setTimeout(() => {
  //           window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
  //         }, 1000)
  //       : parseInt(rq) === valueprod
  //       ? setTimeout(() => {
  //           window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
  //         }, 1000)
  //       : null
  //   }
  // }

  // const getCurrentDate = () => {
  //   const currentDate = new Date()
  //   const formattedDate = currentDate.toISOString().slice(0, 10) // Format as YYYY-MM-DD

  //   return formattedDate
  // }

  const [DialogOpen, setDialogOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)
  const [submitopen, setsubmitopen] = useState(false)
  const [rq, setrq] = useState(0)
  const [prod, setprod] = useState(0)

  let valueprod = parseInt(prod) + parseInt(count)

  // console.log(selectedArea)

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedArea(null)

    // setInnerDialogOpen(false) // Close the inner dialog when the outer dialog is closed
  }

  const handleMapLinkClick = (area, id) => {
    setSelectedArea(area)
    setDialogOpen(true)
  }

  // const printBarcodeWithBartender = (barcodeValue, currentDate) => {
  //   console.log(barcodeValue, currentDate)
  //   const bartenderEndpoint = 'http://localhost:5000/api/print'

  //   const bartenderData = {
  //     Template: 'your_template_name',
  //     PrintJobName: 'Barcode_Print',
  //     Parameters: {
  //       BarcodeValue: barcodeValue,
  //       CurrentDate: currentDate
  //     }
  //   }
  //   console.log(bartenderData, bartenderEndpoint)

  //   fetch
  //     .post(bartenderEndpoint, bartenderData)
  //     .then(response => {
  //       console.log('Print job sent to Bartender:', response.data)
  //     })
  //     .catch(error => {
  //       console.error('Error sending print job to Bartender:', error)
  //     })
  // }

  function setPrintSize() {
    const width = document.getElementById('width').value
    const height = document.getElementById('height').value
    const content = document.querySelector('.content')
    content.style.width = width + 'mm'
    content.style.height = height + 'mm'
    window.print()
  }

  const [barcodeData, setBarcodeData] = useState('')
  const [barcodeImage, setBarcodeImage] = useState('')

  const printBarcode = () => {
    const barcodeValue = filteredRow.vecv_part_no // Assuming vecv_part_no is the barcode value
    const currentDate = new Date().toLocaleDateString() // Get the current date
    // const dataWithDate = `${barcodeValue}-${currentDate}`
    // setBarcodeData(barcodeValue)

    // // Generate barcode image using bwip-js
    // BWIP.toBuffer(
    //   {
    //     bcid: 'code128',
    //     text: dataWithDate,
    //     scale: 3,
    //     height: 10,
    //     includetext: true
    //   },
    //   (err, png) => {
    //     if (err) {
    //       console.error(err)
    //     } else {
    //       // Convert buffer to data URL
    //       const dataUrl = `data:image/png;base64,${png.toString('base64')}`
    //       setBarcodeImage(dataUrl)
    //       downloadBarcode()
    //     }
    //   }
    // )

    const printWindow = window.open('', '', 'width=46.7mm,height=25mm')

    printWindow.document.write(`
      <html>
        <head>
          <title>Barcode Print</title>
          <style>
          body {
            text-align: center;
            width: 46.7mm;
            height: 25mm;
            margin: 0;
            padding: 0;
          }
          .content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: left;
            align-items: left;
          }
          .date {
            font-size: 18px;
            margin-bottom: 10px;
          }
          img {
            max-width: 100%;
            max-height: 100%;
          }
          </style>
        </head>
        <body>
          <div class="date">Date: ${currentDate}
          <img src="https://barcodeapi.org/api/${barcodeValue}" /></div>
        </body>
      </html>
    `)
    printWindow.document.addEventListener('load', () => {
      printWindow.print()
      printWindow.close()
    })
  }

  // const handleInputChange = e => {
  //   setBarcodeData(e.target.value)
  // }

  const downloadBarcode = () => {
    const downloadLink = document.createElement('a')
    downloadLink.href = barcodeImage
    downloadLink.download = 'barcode.png'
    downloadLink.click()
  }

  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('item_code')

  const handleRequestSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }
  const sortedData = stableSort(rows, getComparator(order, orderBy))
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }

    return 0
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy)
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index])
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order

      return a[1] - b[1]
    })

    return stabilizedThis.map(el => el[0])
  }

  const handleCheckboxClick = (event, item_code) => {
    if (selected.includes(item_code)) {
      setSelected(prevSelected => prevSelected.filter(code => code !== item_code))
    } else {
      setSelected(prevSelected => [...prevSelected, item_code])
    }
  }

  const handleIncrement = data => {
    setType('add')

    // Assuming the maximum count is frame_paint_qty
    const currentRow = busPlans.find(row => row.item_code === item_code)
    if (currentRow) {
      setCount(Math.min(count + 1, currentRow.seat_prod_qty))
    }

    // setrq(data.seat_prod_qty), setprod(data.qc_qty)
  }

  const cancelSubQC = () => {
    setCount(count + subCount)
    setCount_value(count_value + subCount)
    setsubCount(0)
    setSubDialog(false)
  }

  const handlecheckdb = async () => {
    try {
      const requestOptions = {
        method: 'POST', // or 'GET' depending on your API endpoint requirements
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value, seat_id, plan_no }) // Include the JSON payload here
      }

      const response = await fetch('/api/Diversitech/Workers/Assembly/Checkseat/', requestOptions)

      if (!response.ok) {
        throw new Error('Failed to fetch model data')
      }

      const data = await response.json()

      if (data.success) {
        setdatavalue(data.message)
      } else {
        toast.error(data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      }

      if (data.error) {
        toast.error(updatedData.error, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      }
    } catch (error) {
      console.error('Error fetching model data:', error)
    }
  }

  const handleInputChange = event => {
    const value = event.target.value
    setInputValue(value)

    if (value !== item_code) {
      alert('Invalid part number!')

      const timeout = setTimeout(() => {
        setInputValue('')
      }, 1000)

      return () => clearTimeout(timeout)
    } else {
      setCount_value(count_value + 1)
      setCount(count + 1)

      const timeout = setTimeout(() => {
        setInputValue('')
      }, 1000)

      return () => clearTimeout(timeout)
    }
  }

  return (
    <Card>
      <ToastContainer />
      <CardContent>
        {plan_no && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='h7'>Plan Number: {plan_no}</Typography>
              <Typography variant='h7' style={{ marginTop: '8px' }}>
                Date: {plan_date}
              </Typography>
            </div>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              {busPlans.length ? (
                busPlans
                  .filter(row => item_code === row.item_code)
                  .map((filteredRow, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
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
                        disabled={Math.max(filteredRow.seat_prod_qty - count - filteredRow.qc_qty, 0) === 0}
                      />
                    </div>
                  ))
              ) : (
                <Typography>No Data Available</Typography>
              )}
            </Box>

            <div>
              <Typography variant='h5'>Item Code: {item_code}</Typography>
            </div>
          </div>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
            {Array.isArray(busPlans) &&
              busPlans
                .filter(row => item_code === row.item_code)
                .map((rowData, index) => (
                  <img
                    key={index}
                    alt='diversitech'
                    style={{ cursor: 'pointer', maxWidth: '100%', height: 'auto' }}
                    src={JSON.parse(rowData.image_url).file2}
                    onError={e => {
                      e.target.src = '/image/logo/unavailable.png'
                    }}
                  />
                ))}
            {/* <img
              alt='diversitech'
              src={`/image/Assembly/${item_code}.png`}
              useMap='#Assemblymap'
              onError={e => {
                e.target.src = '/image/logo/unavailable.png'
              }}
            />
            <map name='Assemblymap'>
              <area
                shape='rect'
                coords='132,388,130,378'
                title='Bag Holder'
                onClick={() => handleMapLinkClick('Bagholder')}
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='143,259,150,264'
                title='Rear Grab Handle'
                onClick={() => handleMapLinkClick('Reargrabhandle')}
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='209,41,219,46'
                title='Top Handle'
                onClick={() => handleMapLinkClick('TOP HANDLE')}
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='147,244,180,255'
                title='Tooth Guard'
                onClick={() => handleMapLinkClick('Toothguard')}
                style={{ cursor: 'pointer' }}
              />
            </map> */}
          </Grid>

          <Dialog open={DialogOpen} onClose={handleDialogClose}>
            <DialogContent>
              <Typography>{selectedArea}</Typography>
              {selectedArea === 'Bagholder' && (
                <img alt='diversitech' src={`/image/Parts/Bagholder.png`} useMap='#Assemblymap' />
              )}
              {selectedArea === 'Reargrabhandle' && (
                <img alt='diversitech' src={`/image/Parts/Reargrabhandle.png`} useMap='#Assemblymap' />
              )}
              {selectedArea === 'Toothguard' && (
                <img alt='diversitech' src={`/image/Parts/Toothguard.png`} useMap='#Assemblymap' />
              )}
              {selectedArea === 'TOP HANDLE' && (
                <img alt='diversitech' src={`/image/Parts/TopHandle.png`} useMap='#Assemblymap' />
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={SubDialog}>
            <Grid container justifyContent='space-between' alignItems='space-between'>
              <Grid>
                <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Quantity
                </DialogTitle>
              </Grid>
              <Grid padding='20px'>
                <img
                  style={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }}
                  alt='New Products'
                  width='50'
                  height='10'
                  src={`/image/SVG/cross.svg`}
                  onClick={cancelSubQC}
                />
              </Grid>
            </Grid>
            <DialogContent>
              <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Grid>
                  {count === 0 || count_value === 0 ? (
                    <Button size='medium' disabled>
                      +
                    </Button>
                  ) : (
                    <Button variant='contained' onClick={handleDecrement}>
                      +
                    </Button>
                  )}
                </Grid>
                <Grid>
                  <Typography>{subCount}</Typography>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', padding: '4px' }}>
                {subCount === 0 || count === 0 || count_value === 0 ? (
                  <Button size='medium' disabled type='submit' variant='contained'>
                    Submit
                  </Button>
                ) : (
                  <Button size='medium' onClick={updateQcProdQty} type='submit' variant='contained'>
                    Submit
                  </Button>
                )}
                {/* </Grid> */}
              </Grid>
            </DialogContent>
          </Dialog>

          <Grid item xs={12} md={4}>
            <Grid>
              <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell />
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'item_code'}
                          direction={order}
                          onClick={() => handleRequestSort('item_code')}
                        >
                          Part No.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell>
                        <TableSortLabel
                          active={orderBy === 'item_description'}
                          direction={order}
                          onClick={() => handleRequestSort('item_description')}
                        >
                          Description
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.item_id}>
                        <TableCell>
                          <Checkbox
                            checked={true} // checked={selected.indexOf(row.item_code) !== -1}
                            onChange={event => handleCheckboxClick(event, row.item_code)}
                          />
                        </TableCell>
                        <TableCell>{row.item_code}</TableCell>
                        <TableCell>{row.item_description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <QualityTable data={data} /> */}
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ margin: '0 auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align='center'>Part Number</StyledTableCell>
                    <StyledTableCell align='center'>Vecv Number</StyledTableCell>
                    <StyledTableCell align='center'>Required Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Available Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Quality Check</StyledTableCell>
                    <StyledTableCell align='center'>Short</StyledTableCell>
                    {/* <TableCell align='center'>Seat Quantity</TableCell> */}
                  </StyledTableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <StyledTableRow>
                      <StyledTableCell align='center' colSpan={6}>
                        <Typography>Loading...</Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : busPlans.length === 0 ? (
                    <>
                      {' '}
                      <StyledTableRow>
                        <StyledTableCell align='center' colSpan={6}>
                          <Typography>No Record Available</Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    </>
                  ) : (
                    busPlans
                      .filter(row => item_code === row.item_code)
                      .map((filteredRow, index) => (
                        <StyledTableRow key={index}>
                          {item_code === filteredRow.item_code ? (
                            <>
                              <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
                              <StyledTableCell align='center'>{filteredRow.vecv_part_no}</StyledTableCell>
                              <StyledTableCell align='center'>{filteredRow.seat_plan_qty}</StyledTableCell>
                              <StyledTableCell align='center'>
                                {filteredRow.seat_prod_qty - datavalue.qc_qty}
                              </StyledTableCell>

                              <StyledTableCell align='center'>
                                <Button onClick={() => setSubDialog(true)}>-</Button>
                                {isNaN(parseInt(datavalue.qc_qty))
                                  ? datavalue.qc_qty + count
                                  : valuecheck
                                  ? parseInt(datavalue.qc_qty) + valuecheck + subCount
                                  : parseInt(datavalue.qc_qty) + count_value + subCount}
                                {/* {isNaN(parseInt(filteredRow.qc_qty)) ? 0 + count : parseInt(filteredRow.qc_qty) + count} */}
                                {Math.max(filteredRow.seat_prod_qty - count - filteredRow.qc_qty, 0) === 0 ? null : (
                                  <Button
                                    onClick={() => {
                                      setCount(Math.min(count + 1, filteredRow.seat_prod_qty)),
                                        setCount_value(Math.min(count_value + 1, filteredRow.seat_prod_qty)),
                                        setType('add'),
                                        setrq(filteredRow.seat_prod_qty),
                                        setprod(filteredRow.qc_qty),
                                        setvalue(Math.min(value + 1, filteredRow.seat_prod_qty)),
                                        setvaluecheck(0),
                                        handlecheckdb()

                                      // handleIncrement()

                                      // setrq(filteredRow.seat_prod_qty)
                                      // setprod(filteredRow.qc_qty)
                                    }}
                                    disabled={parseInt(datavalue.qc_qty) + count === filteredRow.seat_prod_qty}
                                  >
                                    +
                                  </Button>
                                )}
                              </StyledTableCell>

                              <StyledTableCell align='center'>
                                {Math.max(filteredRow.seat_prod_qty - count - filteredRow.qc_qty, 0)}
                              </StyledTableCell>

                              {/* <TableCell align='center'>{filteredRow.seat_prod_qty}</TableCell> */}
                            </>
                          ) : (
                            <>
                              <StyledTableCell colSpan={4} />
                            </>
                          )}
                        </StyledTableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Grid container padding='20px' justifyContent='center' alignItems='center'>
              <Grid>
                <Link
                  href={`/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}
                >
                  <Button size='medium' variant='contained'>
                    Back
                  </Button>
                </Link>
              </Grid>
              <Grid padding='20px'>
                {busPlans
                  .filter(row => item_code === row.item_code)
                  .map(filteredRow => (
                    <div key={filteredRow.id}>
                      {count === 0 ? (
                        <Button size='medium' disabled type='submit' variant='contained'>
                          Submit
                        </Button>
                      ) : (
                        <Button
                          size='medium'
                          onClick={() => {
                            setsubmitopen(true), setvaluecheck(count_value)
                          }}
                          type='submit'
                          variant='contained'
                        >
                          Submit
                        </Button>
                      )}
                    </div>
                  ))}
              </Grid>
            </Grid>

            <Dialog open={submitopen} onClose={() => setsubmitopen(false)}>
              {/* <DialogTitle>Paints</DialogTitle> */}
              <DialogContent>
                <Typography>Are you sure you want to save..?</Typography>
                <Grid container justifyContent='center' alignItems='center'>
                  {/* <Grid padding='10px'> */}
                  <Grid padding='10px'>
                    <Button size='medium' onClick={updateQcProdQty} type='submit' variant='contained'>
                      Yes
                    </Button>
                    {/* <Button
                      size='medium'
                      onClick={() => {
                        updateQcProdQty()
                      }}
                      type='submit'
                      variant='contained'
                    >
                      Yes
                    </Button> */}
                  </Grid>
                  <Grid padding='20px'>
                    <Button size='medium' type='submit' onClick={() => setsubmitopen(false)} variant='contained'>
                      No
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default QualityCom

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Grid from '@mui/material/Grid'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Dialog from '@mui/material/Dialog'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import {
//   Card,
//   CardContent,
//   Paper,
//   Table,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Checkbox,
//   TableBody,
//   TableSortLabel
// } from '@mui/material'
// import Link from 'next/link'

// // import QualityTable from './qualityTable'
// import Barcode from 'react-barcode'
// import TableCell, { tableCellClasses } from '@mui/material/TableCell'
// import { styled } from '@mui/material/styles'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import BWIP from 'bwip-js'

// // import { transporter } from 'src/configs/nodemailer'

// // const data = [
// //   { part_number: 'E121M01303', name: 'TOP HANDLE' },
// //   { part_number: 'E121B01287', name: 'Bagholder' },
// //   { part_number: 'D100U02009', name: 'Reargrabhandle' }
// // ]

// const QualityCom = () => {
//   const [busPlans, setBusPlans] = useState([])
//   const [loading, setLoading] = useState(true)
//   const router = useRouter()
//   const { plan_no, item_code, item_id, plan_date, frame_id, seat_id } = router.query

//   const [selected, setSelected] = useState([])
//   const [rows, setRows] = useState([])
//   const [type, setType] = useState('')
//   const [open, setOpen] = useState(false)
//   const [SubDialog, setSubDialog] = useState(false)
//   const [countMap, setCountMap] = useState({})
//   const [count, setCount] = useState(0)
//   const [subCount, setsubCount] = useState(0)
//   const filteredRow = busPlans.find(row => item_code === row.item_code)

//   const [count_value, setCount_value] = useState(0)
//   const [value, setvalue] = useState(1)
//   const [datavalue, setdatavalue] = useState([])

//   // console.log(datavalue.qc_qty)
//   const [valuecheck, setvaluecheck] = useState(0)

//   // Function to fetch data from the API based on the plan_no
//   const fetchBusPlans = async () => {
//     try {
//       const response = plan_no
//         ? await fetch(
//             `/api/Diversitech/Workers/Assembly/Seat/?plan_no=${encodeURIComponent(
//               plan_no
//             )}&item_id=${encodeURIComponent(item_id)}`
//           )
//         : await fetch('/api/Diversitech/Workers/Assembly/Seat/')
//       if (!response.ok) {
//         throw new Error('Failed to fetch data from the API')
//       }
//       const data = await response.json()
//       if (Array.isArray(data)) {
//         setBusPlans(data)
//       } else {
//         console.error('API Response is not an array:', data)
//         setBusPlans([])
//       }
//       setLoading(false)
//     } catch (error) {
//       console.error(error)
//       setBusPlans([])
//       setLoading(false)
//     }
//   }

//   const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//       color: theme.palette.common.white,
//       backgroundColor: theme.palette.primary.main
//     },
//     [`&.${tableCellClasses.body}`]: {
//       fontSize: 14
//     }
//   }))

//   const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     '&:nth-of-type(odd)': {
//       backgroundColor: theme.palette.action.hover
//     },

//     '&:last-of-type td, &:last-of-type th': {
//       border: 0
//     }
//   }))

//   const fetchPartData = async () => {
//     try {
//       const response = await fetch(`/api/Diversitech/Workers/Assembly/SeatPart/?seat_id=${seat_id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })
//       if (!response.ok) {
//         throw new Error('Network response was not ok')
//       }
//       const data = await response.json()
//       setRows(data)
//       setLoading(false)
//     } catch (error) {
//       console.error('Error:', error)
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchPartData()
//     handlecheckdb()
//     fetchBusPlans()
//     if (rows.length > 0) {
//       const allItemCodes = rows.map(row => row.item_code)
//       setSelected(allItemCodes)
//     }
//   }, [seat_id, plan_no])

//   // Function to handle the increment and decrement of count for a specific item
//   // const handleCountChange = (itemCode, newCount) => {
//   //   setCountMap(prevCountMap => ({
//   //     ...prevCountMap,
//   //     [itemCode]: newCount
//   //   }))
//   // }

//   const updateQcProdQty = async () => {
//     setsubmitopen(false)
//     setSubDialog(false)
//     setvalue(1)
//     try {
//       const response = await fetch('/api/Diversitech/Workers/Qualitycheck/QcImport', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ item_code, count_value, plan_no, type, frame_id, subCount })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update qc_qty')
//       }
//       const updatedData = await response.json()

//       // console.log(updatedData + ' ' + updatedData.message)
//       if (updatedData.success) {
//         toast.success(updatedData.message, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//         printBarcode()
//         setsubmitopen(false)
//         setCount_value(0)
//         if (subCount) {
//           window.location.reload()
//         }

//         // setTimeout(() => {
//         //   window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//         // }, 1000)
//       } else {
//         setCount(0)
//         toast.error(updatedData.message, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//       }

//       if (updatedData.error) {
//         toast.error(updatedData.error, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//       }
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   const handleDecrement = () => {
//     if (count > 0 || count_value > 0) {
//       setCount(count - 1)
//       setCount_value(count_value - 1)
//       setvalue(value - subCount)
//       setsubCount(subCount + 1)
//     }
//   }

//   // const printBarcode = () => {
//   //   setOpen(false)
//   //   window.print()
//   //   {
//   //     parseInt(rq) === parseInt(count)
//   //       ? setTimeout(() => {
//   //           window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//   //         }, 1000)
//   //       : parseInt(rq) === valueprod
//   //       ? setTimeout(() => {
//   //           window.location.href = `/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//   //         }, 1000)
//   //       : null
//   //   }
//   // }

//   // const getCurrentDate = () => {
//   //   const currentDate = new Date()
//   //   const formattedDate = currentDate.toISOString().slice(0, 10) // Format as YYYY-MM-DD

//   //   return formattedDate
//   // }

//   const [DialogOpen, setDialogOpen] = useState(false)
//   const [selectedArea, setSelectedArea] = useState(null)
//   const [submitopen, setsubmitopen] = useState(false)
//   const [rq, setrq] = useState(0)
//   const [prod, setprod] = useState(0)

//   let valueprod = parseInt(prod) + parseInt(count)

//   // console.log(selectedArea)

//   const handleDialogClose = () => {
//     setDialogOpen(false)
//     setSelectedArea(null)

//     // setInnerDialogOpen(false) // Close the inner dialog when the outer dialog is closed
//   }

//   const handleMapLinkClick = (area, id) => {
//     setSelectedArea(area)
//     setDialogOpen(true)
//   }

//   // const printBarcodeWithBartender = (barcodeValue, currentDate) => {
//   //   console.log(barcodeValue, currentDate)
//   //   const bartenderEndpoint = 'http://localhost:5000/api/print'

//   //   const bartenderData = {
//   //     Template: 'your_template_name',
//   //     PrintJobName: 'Barcode_Print',
//   //     Parameters: {
//   //       BarcodeValue: barcodeValue,
//   //       CurrentDate: currentDate
//   //     }
//   //   }
//   //   console.log(bartenderData, bartenderEndpoint)

//   //   fetch
//   //     .post(bartenderEndpoint, bartenderData)
//   //     .then(response => {
//   //       console.log('Print job sent to Bartender:', response.data)
//   //     })
//   //     .catch(error => {
//   //       console.error('Error sending print job to Bartender:', error)
//   //     })
//   // }

//   function setPrintSize() {
//     const width = document.getElementById('width').value
//     const height = document.getElementById('height').value
//     const content = document.querySelector('.content')
//     content.style.width = width + 'mm'
//     content.style.height = height + 'mm'
//     window.print()
//   }

//   const [barcodeData, setBarcodeData] = useState('')
//   const [barcodeImage, setBarcodeImage] = useState('')

//   const printBarcode = () => {
//     const barcodeValue = filteredRow.vecv_part_no // Assuming vecv_part_no is the barcode value
//     const currentDate = new Date().toLocaleDateString() // Get the current date
//     // const dataWithDate = `${barcodeValue}-${currentDate}`
//     // setBarcodeData(barcodeValue)

//     // // Generate barcode image using bwip-js
//     // BWIP.toBuffer(
//     //   {
//     //     bcid: 'code128',
//     //     text: dataWithDate,
//     //     scale: 3,
//     //     height: 10,
//     //     includetext: true
//     //   },
//     //   (err, png) => {
//     //     if (err) {
//     //       console.error(err)
//     //     } else {
//     //       // Convert buffer to data URL
//     //       const dataUrl = `data:image/png;base64,${png.toString('base64')}`
//     //       setBarcodeImage(dataUrl)
//     //       downloadBarcode()
//     //     }
//     //   }
//     // )

//     const printWindow = window.open('', '', 'width=46.7mm,height=25mm')

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Barcode Print</title>
//           <style>
//           body {
//             text-align: center;
//             width: 46.7mm;
//             height: 25mm;
//             margin: 0;
//             padding: 0;
//           }
//           .content {
//             width: 100%;
//             height: 100%;
//             display: flex;
//             flex-direction: column;
//             justify-content: left;
//             align-items: left;
//           }
//           .date {
//             font-size: 18px;
//             margin-bottom: 10px;
//           }
//           img {
//             max-width: 100%;
//             max-height: 100%;
//           }
//           </style>
//         </head>
//         <body>
//           <div class="date">Date: ${currentDate}
//           <img src="https://barcodeapi.org/api/${barcodeValue}" /></div>
//         </body>
//       </html>
//     `)
//     printWindow.document.addEventListener('load', () => {
//       printWindow.print()
//       printWindow.close()
//     })
//   }

//   // const handleInputChange = e => {
//   //   setBarcodeData(e.target.value)
//   // }

//   const downloadBarcode = () => {
//     const downloadLink = document.createElement('a')
//     downloadLink.href = barcodeImage
//     downloadLink.download = 'barcode.png'
//     downloadLink.click()
//   }

//   const [order, setOrder] = useState('asc')
//   const [orderBy, setOrderBy] = useState('item_code')

//   const handleRequestSort = property => {
//     const isAsc = orderBy === property && order === 'asc'
//     setOrder(isAsc ? 'desc' : 'asc')
//     setOrderBy(property)
//   }
//   const sortedData = stableSort(rows, getComparator(order, orderBy))
//   function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//       return -1
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1
//     }

//     return 0
//   }

//   function getComparator(order, orderBy) {
//     return order === 'desc'
//       ? (a, b) => descendingComparator(a, b, orderBy)
//       : (a, b) => -descendingComparator(a, b, orderBy)
//   }

//   function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index])
//     stabilizedThis.sort((a, b) => {
//       const order = comparator(a[0], b[0])
//       if (order !== 0) return order

//       return a[1] - b[1]
//     })

//     return stabilizedThis.map(el => el[0])
//   }

//   const handleCheckboxClick = (event, item_code) => {
//     if (selected.includes(item_code)) {
//       setSelected(prevSelected => prevSelected.filter(code => code !== item_code))
//     } else {
//       setSelected(prevSelected => [...prevSelected, item_code])
//     }
//   }

//   const handleIncrement = data => {
//     setType('add')

//     // Assuming the maximum count is frame_paint_qty
//     const currentRow = busPlans.find(row => row.item_code === item_code)
//     if (currentRow) {
//       setCount(Math.min(count + 1, currentRow.seat_prod_qty))
//     }

//     // setrq(data.seat_prod_qty), setprod(data.qc_qty)
//   }

//   const cancelSubQC = () => {
//     setCount(count + subCount)
//     setCount_value(count_value + subCount)
//     setsubCount(0)
//     setSubDialog(false)
//   }

//   const handlecheckdb = async () => {
//     try {
//       const requestOptions = {
//         method: 'POST', // or 'GET' depending on your API endpoint requirements
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ value, seat_id, plan_no }) // Include the JSON payload here
//       }

//       const response = await fetch('/api/Diversitech/Workers/Assembly/Checkseat/', requestOptions)

//       if (!response.ok) {
//         throw new Error('Failed to fetch model data')
//       }

//       const data = await response.json()

//       if (data.success) {
//         setdatavalue(data.message)
//       } else {
//         toast.error(data.message, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//       }

//       if (data.error) {
//         toast.error(updatedData.error, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//       }
//     } catch (error) {
//       console.error('Error fetching model data:', error)
//     }
//   }

//   return (
//     <Card>
//       <ToastContainer />
//       <CardContent>
//         {plan_no && (
//           <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <div>
//               <Typography variant='h5'>Plan Number: {plan_no}</Typography>
//             </div>

//             <div>
//               <Typography variant='h5'>Item Code: {item_code}</Typography>
//             </div>

//             <div>
//               <Typography variant='h6'>Date: {plan_date}</Typography>
//             </div>
//           </div>
//         )}
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center' }}>
//             {Array.isArray(busPlans) &&
//               busPlans
//                 .filter(row => item_code === row.item_code)
//                 .map((rowData, index) => (
//                   <img
//                     key={index}
//                     alt='diversitech'
//                     style={{ cursor: 'pointer' }}
//                     src={JSON.parse(rowData.image_url).file2}
//                     onError={e => {
//                       e.target.src = '/image/logo/unavailable.png'
//                     }}
//                   />
//                 ))}
//             {/* <img
//               alt='diversitech'
//               src={`/image/Assembly/${item_code}.png`}
//               useMap='#Assemblymap'
//               onError={e => {
//                 e.target.src = '/image/logo/unavailable.png'
//               }}
//             />
//             <map name='Assemblymap'>
//               <area
//                 shape='rect'
//                 coords='132,388,130,378'
//                 title='Bag Holder'
//                 onClick={() => handleMapLinkClick('Bagholder')}
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='143,259,150,264'
//                 title='Rear Grab Handle'
//                 onClick={() => handleMapLinkClick('Reargrabhandle')}
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='209,41,219,46'
//                 title='Top Handle'
//                 onClick={() => handleMapLinkClick('TOP HANDLE')}
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='147,244,180,255'
//                 title='Tooth Guard'
//                 onClick={() => handleMapLinkClick('Toothguard')}
//                 style={{ cursor: 'pointer' }}
//               />
//             </map> */}
//           </Grid>

//           <Dialog open={DialogOpen} onClose={handleDialogClose}>
//             <DialogContent>
//               <Typography>{selectedArea}</Typography>
//               {selectedArea === 'Bagholder' && (
//                 <img alt='diversitech' src={`/image/Parts/Bagholder.png`} useMap='#Assemblymap' />
//               )}
//               {selectedArea === 'Reargrabhandle' && (
//                 <img alt='diversitech' src={`/image/Parts/Reargrabhandle.png`} useMap='#Assemblymap' />
//               )}
//               {selectedArea === 'Toothguard' && (
//                 <img alt='diversitech' src={`/image/Parts/Toothguard.png`} useMap='#Assemblymap' />
//               )}
//               {selectedArea === 'TOP HANDLE' && (
//                 <img alt='diversitech' src={`/image/Parts/TopHandle.png`} useMap='#Assemblymap' />
//               )}
//             </DialogContent>
//           </Dialog>

//           <Dialog open={SubDialog}>
//             <Grid container justifyContent='space-between' alignItems='space-between'>
//               <Grid>
//                 <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   Quantity
//                 </DialogTitle>
//               </Grid>
//               <Grid padding='20px'>
//                 <img
//                   style={{ display: 'flex', alignItems: 'right', justifyContent: 'right' }}
//                   alt='New Products'
//                   width='50'
//                   height='10'
//                   src={`/image/SVG/cross.svg`}
//                   onClick={cancelSubQC}
//                 />
//               </Grid>
//             </Grid>
//             <DialogContent>
//               <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
//                 <Grid>
//                   {count === 0 || count_value === 0 ? (
//                     <Button size='medium' disabled>
//                       +
//                     </Button>
//                   ) : (
//                     <Button variant='contained' onClick={handleDecrement}>
//                       +
//                     </Button>
//                   )}
//                 </Grid>
//                 <Grid>
//                   <Typography>{subCount}</Typography>
//                 </Grid>
//               </Grid>
//               <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', padding: '4px' }}>
//                 {subCount === 0 || count === 0 || count_value === 0 ? (
//                   <Button size='medium' disabled type='submit' variant='contained'>
//                     Submit
//                   </Button>
//                 ) : (
//                   <Button size='medium' onClick={updateQcProdQty} type='submit' variant='contained'>
//                     Submit
//                   </Button>
//                 )}
//                 {/* </Grid> */}
//               </Grid>
//             </DialogContent>
//           </Dialog>

//           <Grid item xs={12} md={4}>
//             <Grid>
//               <TableContainer component={Paper} style={{ maxHeight: '400px', overflowY: 'auto' }}>
//                 <Table>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell />
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === 'item_code'}
//                           direction={order}
//                           onClick={() => handleRequestSort('item_code')}
//                         >
//                           Part No.
//                         </TableSortLabel>
//                       </TableCell>
//                       <TableCell>
//                         <TableSortLabel
//                           active={orderBy === 'item_description'}
//                           direction={order}
//                           onClick={() => handleRequestSort('item_description')}
//                         >
//                           Description
//                         </TableSortLabel>
//                       </TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {rows.map(row => (
//                       <TableRow key={row.item_id}>
//                         <TableCell>
//                           <Checkbox
//                             checked={true} // checked={selected.indexOf(row.item_code) !== -1}
//                             onChange={event => handleCheckboxClick(event, row.item_code)}
//                           />
//                         </TableCell>
//                         <TableCell>{row.item_code}</TableCell>
//                         <TableCell>{row.item_description}</TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//               {/* <QualityTable data={data} /> */}
//             </Grid>
//           </Grid>

//           <Grid item xs={12} sx={{ margin: '0 auto' }}>
//             <TableContainer component={Paper}>
//               <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
//                 <TableHead>
//                   <StyledTableRow>
//                     <StyledTableCell align='center'>Part Number</StyledTableCell>
//                     <StyledTableCell align='center'>Vecv Number</StyledTableCell>
//                     <StyledTableCell align='center'>Required Quantity</StyledTableCell>
//                     <StyledTableCell align='center'>Available Quantity</StyledTableCell>
//                     <StyledTableCell align='center'>Quality Check</StyledTableCell>
//                     <StyledTableCell align='center'>Short</StyledTableCell>
//                     {/* <TableCell align='center'>Seat Quantity</TableCell> */}
//                   </StyledTableRow>
//                 </TableHead>

//                 <TableBody>
//                   {loading ? (
//                     <StyledTableRow>
//                       <StyledTableCell align='center' colSpan={6}>
//                         <Typography>Loading...</Typography>
//                       </StyledTableCell>
//                     </StyledTableRow>
//                   ) : busPlans.length === 0 ? (
//                     <>
//                       {' '}
//                       <StyledTableRow>
//                         <StyledTableCell align='center' colSpan={6}>
//                           <Typography>No Record Available</Typography>
//                         </StyledTableCell>
//                       </StyledTableRow>
//                     </>
//                   ) : (
//                     busPlans
//                       .filter(row => item_code === row.item_code)
//                       .map((filteredRow, index) => (
//                         <StyledTableRow key={index}>
//                           {item_code === filteredRow.item_code ? (
//                             <>
//                               <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
//                               <StyledTableCell align='center'>{filteredRow.vecv_part_no}</StyledTableCell>
//                               <StyledTableCell align='center'>{filteredRow.seat_plan_qty}</StyledTableCell>
//                               <StyledTableCell align='center'>
//                                 {filteredRow.seat_prod_qty - datavalue.qc_qty}
//                               </StyledTableCell>

//                               <StyledTableCell align='center'>
//                                 <Button onClick={() => setSubDialog(true)}>-</Button>
//                                 {isNaN(parseInt(datavalue.qc_qty))
//                                   ? datavalue.qc_qty + count
//                                   : valuecheck
//                                   ? parseInt(datavalue.qc_qty) + valuecheck + subCount
//                                   : parseInt(datavalue.qc_qty) + count_value + subCount}
//                                 {/* {isNaN(parseInt(filteredRow.qc_qty)) ? 0 + count : parseInt(filteredRow.qc_qty) + count} */}
//                                 {Math.max(filteredRow.seat_prod_qty - count - filteredRow.qc_qty, 0) === 0 ? null : (
//                                   <Button
//                                     onClick={() => {
//                                       setCount(Math.min(count + 1, filteredRow.seat_prod_qty)),
//                                         setCount_value(Math.min(count_value + 1, filteredRow.seat_prod_qty)),
//                                         setType('add'),
//                                         setrq(filteredRow.seat_prod_qty),
//                                         setprod(filteredRow.qc_qty),
//                                         setvalue(Math.min(value + 1, filteredRow.seat_prod_qty)),
//                                         setvaluecheck(0),
//                                         handlecheckdb()

//                                       // handleIncrement()

//                                       // setrq(filteredRow.seat_prod_qty)
//                                       // setprod(filteredRow.qc_qty)
//                                     }}
//                                     disabled={parseInt(datavalue.qc_qty) + count === filteredRow.seat_prod_qty}
//                                   >
//                                     +
//                                   </Button>
//                                 )}
//                               </StyledTableCell>

//                               <StyledTableCell align='center'>
//                                 {Math.max(filteredRow.seat_prod_qty - count - filteredRow.qc_qty, 0)}
//                               </StyledTableCell>

//                               {/* <TableCell align='center'>{filteredRow.seat_prod_qty}</TableCell> */}
//                             </>
//                           ) : (
//                             <>
//                               <StyledTableCell colSpan={4} />
//                             </>
//                           )}
//                         </StyledTableRow>
//                       ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <Grid container padding='20px' justifyContent='center' alignItems='center'>
//               <Grid>
//                 <Link
//                   href={`/components/qualitycheck/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}
//                 >
//                   <Button size='medium' variant='contained'>
//                     Back
//                   </Button>
//                 </Link>
//               </Grid>
//               <Grid padding='20px'>
//                 {busPlans
//                   .filter(row => item_code === row.item_code)
//                   .map(filteredRow => (
//                     <div key={filteredRow.id}>
//                       {count === 0 ? (
//                         <Button size='medium' disabled type='submit' variant='contained'>
//                           Submit
//                         </Button>
//                       ) : (
//                         <Button
//                           size='medium'
//                           onClick={() => {
//                             setsubmitopen(true), setvaluecheck(count_value)
//                           }}
//                           type='submit'
//                           variant='contained'
//                         >
//                           Submit
//                         </Button>
//                       )}
//                     </div>
//                   ))}
//               </Grid>
//             </Grid>

//             <Dialog open={submitopen} onClose={() => setsubmitopen(false)}>
//               {/* <DialogTitle>Paints</DialogTitle> */}
//               <DialogContent>
//                 <Typography>Are you sure you want to save..?</Typography>
//                 <Grid container justifyContent='center' alignItems='center'>
//                   {/* <Grid padding='10px'> */}
//                   <Grid padding='10px'>
//                     <Button size='medium' onClick={updateQcProdQty} type='submit' variant='contained'>
//                       Yes
//                     </Button>
//                     {/* <Button
//                       size='medium'
//                       onClick={() => {
//                         updateQcProdQty()
//                       }}
//                       type='submit'
//                       variant='contained'
//                     >
//                       Yes
//                     </Button> */}
//                   </Grid>
//                   <Grid padding='20px'>
//                     <Button size='medium' type='submit' onClick={() => setsubmitopen(false)} variant='contained'>
//                       No
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </DialogContent>
//             </Dialog>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   )
// }

// export default QualityCom
