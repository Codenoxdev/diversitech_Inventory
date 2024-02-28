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
  TableBody,
  Box,
  TextField
} from '@mui/material'
import DTableAitem from '../DTables/TableAitems'
import Link from 'next/link'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { styled } from '@mui/material/styles'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ProductionCom = () => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('')
  const router = useRouter()
  const { plan_no, item_code, item_id, plan_date, frame_id, seat_id } = router.query
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [count, setCount] = useState(0)
  const [rq, setrq] = useState(0)
  const [prod, setprod] = useState(0)
  const [SubDialog, setSubDialog] = useState(false)
  const [count_value, setCount_value] = useState(0)
  const [value, setvalue] = useState(1)
  const [subCount, setsubCount] = useState(0)
  const [datavalue, setdatavalue] = useState([])
  const [inputValue, setInputValue] = useState('')

  // console.log(datavalue.seat_prod_qty + '===check')
  // console.log(datavalue + '===check')
  const [valuecheck, setvaluecheck] = useState(0)

  let valueprod = parseInt(prod) + parseInt(count)

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

      // console.log('API Response:', data)
      setBusPlans(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setBusPlans([])
      setLoading(false)
    }
  }

  console.log(seat_id + 'seat_idseat_idseat_id')

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

  useEffect(() => {
    fetchBusPlans()
    handlecheckdb()
  }, [plan_no])

  // const handleDecrement = () => {
  //   setType('sub')
  //   if (count > 0) {
  //     setCount(count - 1)
  //   }
  // }

  const handleDecrement = () => {
    setType('sub')
    if (count > 0 || count_value > 0) {
      setCount(count - 1)
      setCount_value(count_value - 1)

      // setvalue(value - subCount)

      // setsubCount(subCount + subCount)
      setsubCount(subCount + 1)
    }
  }

  const handleIncrement = () => {
    setType('add')

    // Assuming the maximum count is frame_paint_qty
    const currentRow = busPlans.find(row => row.item_code === item_code)
    if (currentRow) {
      setCount(Math.min(count + 1, currentRow.frame_paint_qty))
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

  const updateProduction = async () => {
    // console.log(item_code, count, plan_no)
    try {
      const response = await fetch('/api/Diversitech/Workers/Assembly/SeatImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_code, count_value, plan_no, type, frame_id })
      })

      if (!response.ok) {
        throw new Error('Failed to update Production')
      }

      const updatedData = await response.json()

      // console.log(updatedData + ' ' + updatedData.message)

      if (updatedData.success) {
        toast.success(updatedData.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
        setShowModal(false)
        setCount_value(0)
        if (subCount) {
          window.location.reload()
        }

        {
          parseInt(rq) === parseInt(count)
            ? setTimeout(() => {
                window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : parseInt(rq) === valueprod
            ? setTimeout(() => {
                window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : null
        }

        // setTimeout(() => {
        //   window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
        // }, 1000)

        // window.location.reload()
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

  const [DialogOpen, setDialogOpen] = useState(false)
  const [selectedArea, setSelectedArea] = useState(null)

  // console.log(selectedArea)

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedArea(null)

    // setInnerDialogOpen(false) // Close the inner dialog when the outer dialog is closed
  }

  const cancelSubQC = () => {
    setCount(count + subCount)
    setCount_value(count_value + subCount)
    setsubCount(0)
    setSubDialog(false)
  }

  const handleMapLinkClick = area => {
    // console.log(area)
    setSelectedArea(area)
    setDialogOpen(true)
  }

  // const imageExists = imageUrl => {
  //   const http = new XMLHttpRequest()
  //   http.open('HEAD', imageUrl, false)
  //   http.send()

  //   return http.status !== 404
  // }

  // // Usage of imageExists function
  // const imageUrl = '/image/Assembly/'
  // const exists = imageExists(imageUrl)
  // if (exists) {
  //   console.log('Image exists!')
  // } else {
  //   console.log('Image does not exist.')
  // }

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
                        disabled={Math.max(filteredRow.frame_paint_qty - count - filteredRow.seat_prod_qty, 0) === 0}
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
          {/* <Grid item xs={12} md={11} justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            {imageExists(`/image/Assembly/${item_code}_FM.png`) ? (
              <img alt='Image' style={{ cursor: 'pointer' }} src={`/image/seatframes/${item_code}_FM.png`} />
            ) : (
              <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
            )}
          </Grid> */}
          <Grid
            item
            xs={12}
            md={11}
            alignItems='center'
            justifyContent='center'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
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
                      e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
                    }}
                  />
                ))}

            {/* {imageExists(`/image/Assembly/${item_code}_FM.png`) ? ( */}
            {/* <img
              alt='Image'
              style={{ cursor: 'pointer' }}
              src={`/image/Assembly/${item_code}.png`}
              onError={e => {
                e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
              }}
            /> */}
            {/* ) : (
              <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
            )} */}
            {/* <img alt='diversitech' src={`/image/Assembly/E121S01202_FM.png`} useMap='#Assemblymap' />
            <map name='Assemblymap'>
              <area
                shape='rect'
                coords='132,388,130,378'
                title='Bag Holder'
                onClick={() => handleMapLinkClick('Bagholder')} // Handle the map area click
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='143,259,150,264'
                title='Rear Grab Handle'
                onClick={() => handleMapLinkClick('Reargrabhandle')} // Handle the map area click
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='209,41,219,46'
                title='Top Handle'
                onClick={() => handleMapLinkClick('Tophandle')} // Handle the map area click
                style={{ cursor: 'pointer' }}
              />
              <area
                shape='rect'
                coords='147,244,180,255'
                title='Tooth Guard'
                onClick={() => handleMapLinkClick('Toothguard')} // Handle the map area click
                style={{ cursor: 'pointer' }}
              />
            </map> */}
          </Grid>
          <Grid item xs={12} md={1}>
            <Button size='medium' type='submit' variant='contained' onClick={() => setOpen(true)}>
              Parts
            </Button>
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
              {selectedArea === 'Tophandle' && (
                <img alt='diversitech' src={`/image/Parts/TopHandle.png`} useMap='#Assemblymap' />
              )}
            </DialogContent>
          </Dialog>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <Grid container justifyContent='space-between' alignItems='space-between'>
              <Grid>
                <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Assembly Parts
                </DialogTitle>
              </Grid>
              <Grid padding='20px'>
                <img
                  style={{ display: 'flex', alignItems: 'right', justifyContent: '' }}
                  alt='New Products'
                  width='50'
                  height='10'
                  src={`/image/SVG/cross.svg`}
                  onClick={() => {
                    setOpen(false)
                  }}
                />
              </Grid>
            </Grid>

            <DialogContent>
              <DTableAitem />
            </DialogContent>
          </Dialog>

          <Grid item xs={12} sx={{ margin: '0 auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align='center'>Part Number</StyledTableCell>
                    <StyledTableCell align='center'>Required Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Available Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Production</StyledTableCell>
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
                    <StyledTableRow>
                      <StyledTableCell align='center' colSpan={6}>
                        <Typography>No Record Available</Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : (
                    busPlans
                      .filter(row => item_code === row.item_code)
                      .map((filteredRow, index) => (
                        <StyledTableRow key={index}>
                          {item_code === filteredRow.item_code ? (
                            <>
                              <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
                              <StyledTableCell align='center'>{filteredRow.seat_plan_qty}</StyledTableCell>
                              <StyledTableCell align='center'>
                                {filteredRow.frame_paint_qty - datavalue.seat_prod_qty}
                              </StyledTableCell>

                              <StyledTableCell align='center'>
                                <Button onClick={() => setSubDialog(true)}>-</Button>
                                {isNaN(parseInt(datavalue.seat_prod_qty))
                                  ? datavalue.seat_prod_qty + count
                                  : valuecheck
                                  ? parseInt(datavalue.seat_prod_qty) + valuecheck + subCount
                                  : parseInt(datavalue.seat_prod_qty) + count_value + subCount}

                                {Math.max(filteredRow.frame_paint_qty - count - filteredRow.seat_prod_qty, 0) ===
                                0 ? null : (
                                  <Button
                                    onClick={() => {
                                      setCount(Math.min(count + 1, filteredRow.frame_paint_qty)),
                                        setCount_value(Math.min(count_value + 1, filteredRow.frame_paint_qty)),
                                        setType('add'),
                                        setrq(filteredRow.frame_paint_qty),
                                        setprod(filteredRow.seat_prod_qty),
                                        setvalue(Math.min(value + 1, filteredRow.frame_paint_qty)),
                                        setvaluecheck(0),
                                        handlecheckdb()

                                      // setrq(filteredRow.frame_paint_qty)
                                      // setprod(filteredRow.seat_prod_qty)
                                      handleIncrement()
                                    }}
                                  >
                                    +
                                  </Button>
                                )}
                              </StyledTableCell>
                              {console.log(value - subCount + ' ' + value + ' ' + subCount)}
                              <StyledTableCell align='center'>
                                {Math.max(filteredRow.frame_paint_qty - count - filteredRow.seat_prod_qty, 0)}
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
                  href={`/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}
                >
                  <Button size='medium' variant='contained'>
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
                  <Button
                    size='medium'
                    onClick={() => {
                      setShowModal(true), setvaluecheck(count_value)
                    }}
                    type='submit'
                    variant='contained'
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
            <Dialog open={showModal} onClose={() => setShowModal(false)}>
              {/* <DialogTitle>Assembly</DialogTitle> */}
              <DialogContent>
                <Typography>Are you sure you want to save..?</Typography>
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid padding='10px'>
                    <Button size='medium' onClick={updateProduction} type='submit' variant='contained'>
                      Yes
                    </Button>
                  </Grid>
                  <Grid padding='20px'>
                    <Button size='medium' type='submit' onClick={() => setShowModal(false)} variant='contained'>
                      No
                    </Button>
                  </Grid>
                </Grid>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>

        <Dialog open={SubDialog}>
          <Grid container justifyContent='space-between' alignItems='space-between'>
            <Grid>
              <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Quantity
              </DialogTitle>
            </Grid>
            <Grid padding='20px'>
              <img
                style={{ display: 'flex', alignItems: 'right', justifyContent: '' }}
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
                <Button size='medium' onClick={updateProduction} type='submit' variant='contained'>
                  Submit
                </Button>
              )}
              {/* </Grid> */}
            </Grid>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

ProductionCom.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ProductionCom

// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/router'
// import Grid from '@mui/material/Grid'
// import Typography from '@mui/material/Typography'
// import Button from '@mui/material/Button'
// import Dialog from '@mui/material/Dialog'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import { Card, CardContent, Paper, Table, TableContainer, TableHead, TableRow, TableBody } from '@mui/material'
// import DTableAitem from '../DTables/TableAitems'
// import Link from 'next/link'
// import TableCell, { tableCellClasses } from '@mui/material/TableCell'
// import { styled } from '@mui/material/styles'
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// const ProductionCom = () => {
//   const [busPlans, setBusPlans] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [type, setType] = useState('')
//   const router = useRouter()
//   const { plan_no, item_code, item_id, plan_date, frame_id, seat_id } = router.query
//   const [open, setOpen] = useState(false)
//   const [showModal, setShowModal] = useState(false)
//   const [count, setCount] = useState(0)
//   const [rq, setrq] = useState(0)
//   const [prod, setprod] = useState(0)
//   const [SubDialog, setSubDialog] = useState(false)
//   const [count_value, setCount_value] = useState(0)
//   const [value, setvalue] = useState(1)
//   const [subCount, setsubCount] = useState(0)
//   const [datavalue, setdatavalue] = useState([])

//   // console.log(datavalue.seat_prod_qty + '===check')
//   // console.log(datavalue + '===check')
//   const [valuecheck, setvaluecheck] = useState(0)

//   let valueprod = parseInt(prod) + parseInt(count)

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

//       // console.log('API Response:', data)
//       setBusPlans(data)
//       setLoading(false)
//     } catch (error) {
//       console.error(error)
//       setBusPlans([])
//       setLoading(false)
//     }
//   }

//   // console.log(seat_id + 'seat_idseat_idseat_id')

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

//   useEffect(() => {
//     fetchBusPlans()
//     handlecheckdb()
//   }, [plan_no])

//   // const handleDecrement = () => {
//   //   setType('sub')
//   //   if (count > 0) {
//   //     setCount(count - 1)
//   //   }
//   // }

//   const handleDecrement = () => {
//     setType('sub')
//     if (count > 0 || count_value > 0) {
//       setCount(count - 1)
//       setCount_value(count_value - 1)

//       // setvalue(value - subCount)

//       // setsubCount(subCount + subCount)
//       setsubCount(subCount + 1)
//     }
//   }

//   const handleIncrement = () => {
//     setType('add')

//     // Assuming the maximum count is frame_paint_qty
//     const currentRow = busPlans.find(row => row.item_code === item_code)
//     if (currentRow) {
//       setCount(Math.min(count + 1, currentRow.frame_paint_qty))
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

//   const updateProduction = async () => {
//     // console.log(item_code, count, plan_no)
//     try {
//       const response = await fetch('/api/Diversitech/Workers/Assembly/SeatImport', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ item_code, count_value, plan_no, type, frame_id })
//       })

//       if (!response.ok) {
//         throw new Error('Failed to update Production')
//       }

//       const updatedData = await response.json()

//       // console.log(updatedData + ' ' + updatedData.message)

//       if (updatedData.success) {
//         toast.success(updatedData.message, {
//           position: toast.POSITION.TOP_RIGHT,
//           autoClose: 1500
//         })
//         setShowModal(false)
//         setCount_value(0)
//         if (subCount) {
//           window.location.reload()
//         }

//         {
//           parseInt(rq) === parseInt(count)
//             ? setTimeout(() => {
//                 window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//               }, 1000)
//             : parseInt(rq) === valueprod
//             ? setTimeout(() => {
//                 window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//               }, 1000)
//             : null
//         }

//         // setTimeout(() => {
//         //   window.location.href = `/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
//         // }, 1000)

//         // window.location.reload()
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

//   const [DialogOpen, setDialogOpen] = useState(false)
//   const [selectedArea, setSelectedArea] = useState(null)

//   // console.log(selectedArea)

//   const handleDialogClose = () => {
//     setDialogOpen(false)
//     setSelectedArea(null)

//     // setInnerDialogOpen(false) // Close the inner dialog when the outer dialog is closed
//   }

//   const cancelSubQC = () => {
//     setCount(count + subCount)
//     setCount_value(count_value + subCount)
//     setsubCount(0)
//     setSubDialog(false)
//   }

//   const handleMapLinkClick = area => {
//     // console.log(area)
//     setSelectedArea(area)
//     setDialogOpen(true)
//   }

//   // const imageExists = imageUrl => {
//   //   const http = new XMLHttpRequest()
//   //   http.open('HEAD', imageUrl, false)
//   //   http.send()

//   //   return http.status !== 404
//   // }

//   // // Usage of imageExists function
//   // const imageUrl = '/image/Assembly/'
//   // const exists = imageExists(imageUrl)
//   // if (exists) {
//   //   console.log('Image exists!')
//   // } else {
//   //   console.log('Image does not exist.')
//   // }

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
//           {/* <Grid item xs={12} md={11} justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
//             {imageExists(`/image/Assembly/${item_code}_FM.png`) ? (
//               <img alt='Image' style={{ cursor: 'pointer' }} src={`/image/seatframes/${item_code}_FM.png`} />
//             ) : (
//               <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
//             )}
//           </Grid> */}
//           <Grid
//             item
//             xs={12}
//             md={11}
//             alignItems='center'
//             justifyContent='center'
//             style={{ display: 'flex', justifyContent: 'center' }}
//           >
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
//                       e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
//                     }}
//                   />
//                 ))}

//             {/* {imageExists(`/image/Assembly/${item_code}_FM.png`) ? ( */}
//             {/* <img
//               alt='Image'
//               style={{ cursor: 'pointer' }}
//               src={`/image/Assembly/${item_code}.png`}
//               onError={e => {
//                 e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
//               }}
//             /> */}
//             {/* ) : (
//               <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
//             )} */}
//             {/* <img alt='diversitech' src={`/image/Assembly/E121S01202_FM.png`} useMap='#Assemblymap' />
//             <map name='Assemblymap'>
//               <area
//                 shape='rect'
//                 coords='132,388,130,378'
//                 title='Bag Holder'
//                 onClick={() => handleMapLinkClick('Bagholder')} // Handle the map area click
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='143,259,150,264'
//                 title='Rear Grab Handle'
//                 onClick={() => handleMapLinkClick('Reargrabhandle')} // Handle the map area click
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='209,41,219,46'
//                 title='Top Handle'
//                 onClick={() => handleMapLinkClick('Tophandle')} // Handle the map area click
//                 style={{ cursor: 'pointer' }}
//               />
//               <area
//                 shape='rect'
//                 coords='147,244,180,255'
//                 title='Tooth Guard'
//                 onClick={() => handleMapLinkClick('Toothguard')} // Handle the map area click
//                 style={{ cursor: 'pointer' }}
//               />
//             </map> */}
//           </Grid>
//           <Grid item xs={12} md={1}>
//             <Button size='medium' type='submit' variant='contained' onClick={() => setOpen(true)}>
//               Parts
//             </Button>
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
//               {selectedArea === 'Tophandle' && (
//                 <img alt='diversitech' src={`/image/Parts/TopHandle.png`} useMap='#Assemblymap' />
//               )}
//             </DialogContent>
//           </Dialog>
//           <Dialog open={open} onClose={() => setOpen(false)}>
//             <Grid container justifyContent='space-between' alignItems='space-between'>
//               <Grid>
//                 <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   Assembly Parts
//                 </DialogTitle>
//               </Grid>
//               <Grid padding='20px'>
//                 <img
//                   style={{ display: 'flex', alignItems: 'right', justifyContent: '' }}
//                   alt='New Products'
//                   width='50'
//                   height='10'
//                   src={`/image/SVG/cross.svg`}
//                   onClick={() => {
//                     setOpen(false)
//                   }}
//                 />
//               </Grid>
//             </Grid>

//             <DialogContent>
//               <DTableAitem />
//             </DialogContent>
//           </Dialog>

//           <Grid item xs={12} sx={{ margin: '0 auto' }}>
//             <TableContainer component={Paper}>
//               <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
//                 <TableHead>
//                   <StyledTableRow>
//                     <StyledTableCell align='center'>Part Number</StyledTableCell>
//                     <StyledTableCell align='center'>Required Quantity</StyledTableCell>
//                     <StyledTableCell align='center'>Available Quantity</StyledTableCell>
//                     <StyledTableCell align='center'>Production</StyledTableCell>
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
//                     <StyledTableRow>
//                       <StyledTableCell align='center' colSpan={6}>
//                         <Typography>No Record Available</Typography>
//                       </StyledTableCell>
//                     </StyledTableRow>
//                   ) : (
//                     busPlans
//                       .filter(row => item_code === row.item_code)
//                       .map((filteredRow, index) => (
//                         <StyledTableRow key={index}>
//                           {item_code === filteredRow.item_code ? (
//                             <>
//                               <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
//                               <StyledTableCell align='center'>{filteredRow.seat_plan_qty}</StyledTableCell>
//                               <StyledTableCell align='center'>
//                                 {filteredRow.frame_paint_qty - datavalue.seat_prod_qty}
//                               </StyledTableCell>

//                               <StyledTableCell align='center'>
//                                 <Button onClick={() => setSubDialog(true)}>-</Button>
//                                 {isNaN(parseInt(datavalue.seat_prod_qty))
//                                   ? datavalue.seat_prod_qty + count
//                                   : valuecheck
//                                   ? parseInt(datavalue.seat_prod_qty) + valuecheck + subCount
//                                   : parseInt(datavalue.seat_prod_qty) + count_value + subCount}

//                                 {Math.max(filteredRow.frame_paint_qty - count - filteredRow.seat_prod_qty, 0) ===
//                                 0 ? null : (
//                                   <Button
//                                     onClick={() => {
//                                       setCount(Math.min(count + 1, filteredRow.frame_paint_qty)),
//                                         setCount_value(Math.min(count_value + 1, filteredRow.frame_paint_qty)),
//                                         setType('add'),
//                                         setrq(filteredRow.frame_paint_qty),
//                                         setprod(filteredRow.seat_prod_qty),
//                                         setvalue(Math.min(value + 1, filteredRow.frame_paint_qty)),
//                                         setvaluecheck(0),
//                                         handlecheckdb()

//                                       // setrq(filteredRow.frame_paint_qty)
//                                       // setprod(filteredRow.seat_prod_qty)
//                                       handleIncrement()
//                                     }}
//                                   >
//                                     +
//                                   </Button>
//                                 )}
//                               </StyledTableCell>
//                               {/* {console.log(value - subCount + ' ' + value + ' ' + subCount)} */}
//                               <StyledTableCell align='center'>
//                                 {Math.max(filteredRow.frame_paint_qty - count - filteredRow.seat_prod_qty, 0)}
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
//                   href={`/components/Production/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}
//                 >
//                   <Button size='medium' variant='contained'>
//                     Back
//                   </Button>
//                 </Link>
//               </Grid>
//               <Grid padding='20px'>
//                 {count === 0 ? (
//                   <Button size='medium' disabled type='submit' variant='contained'>
//                     Submit
//                   </Button>
//                 ) : (
//                   <Button
//                     size='medium'
//                     onClick={() => {
//                       setShowModal(true), setvaluecheck(count_value)
//                     }}
//                     type='submit'
//                     variant='contained'
//                   >
//                     Submit
//                   </Button>
//                 )}
//               </Grid>
//             </Grid>
//             <Dialog open={showModal} onClose={() => setShowModal(false)}>
//               {/* <DialogTitle>Assembly</DialogTitle> */}
//               <DialogContent>
//                 <Typography>Are you sure you want to save..?</Typography>
//                 <Grid container justifyContent='center' alignItems='center'>
//                   <Grid padding='10px'>
//                     <Button size='medium' onClick={updateProduction} type='submit' variant='contained'>
//                       Yes
//                     </Button>
//                   </Grid>
//                   <Grid padding='20px'>
//                     <Button size='medium' type='submit' onClick={() => setShowModal(false)} variant='contained'>
//                       No
//                     </Button>
//                   </Grid>
//                 </Grid>
//               </DialogContent>
//             </Dialog>
//           </Grid>
//         </Grid>

//         <Dialog open={SubDialog}>
//           <Grid container justifyContent='space-between' alignItems='space-between'>
//             <Grid>
//               <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                 Quantity
//               </DialogTitle>
//             </Grid>
//             <Grid padding='20px'>
//               <img
//                 style={{ display: 'flex', alignItems: 'right', justifyContent: '' }}
//                 alt='New Products'
//                 width='50'
//                 height='10'
//                 src={`/image/SVG/cross.svg`}
//                 onClick={cancelSubQC}
//               />
//             </Grid>
//           </Grid>
//           <DialogContent>
//             <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'space-evenly' }}>
//               <Grid>
//                 {count === 0 || count_value === 0 ? (
//                   <Button size='medium' disabled>
//                     +
//                   </Button>
//                 ) : (
//                   <Button variant='contained' onClick={handleDecrement}>
//                     +
//                   </Button>
//                 )}
//               </Grid>
//               <Grid>
//                 <Typography>{subCount}</Typography>
//               </Grid>
//             </Grid>
//             <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', padding: '4px' }}>
//               {subCount === 0 || count === 0 || count_value === 0 ? (
//                 <Button size='medium' disabled type='submit' variant='contained'>
//                   Submit
//                 </Button>
//               ) : (
//                 <Button size='medium' onClick={updateProduction} type='submit' variant='contained'>
//                   Submit
//                 </Button>
//               )}
//               {/* </Grid> */}
//             </Grid>
//           </DialogContent>
//         </Dialog>
//       </CardContent>
//     </Card>
//   )
// }

// ProductionCom.acl = {
//   action: 'read',
//   subject: 'acl-page'
// }

// export default ProductionCom
