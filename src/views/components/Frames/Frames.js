import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { Card, CardContent, Paper, Table, TableContainer, TableHead, TableRow, TableBody } from '@mui/material'

// import DTableFitem from '../DTables/TableFitems'
import DTableAitem from '../DTables/TableAitems'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const FrameCom = () => {
  const [busPlans, setBusPlans] = useState([])
  const [modelData, setModelData] = useState({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { plan_no, item_code, item_id, plan_date, seat_id, part_id } = router.query

  // console.log(plan_no, item_code, item_id, plan_date, seat_id, part_id + '==============')

  // const [FCode, setFCode] = useState(item_code)
  // console.log(plan_no, item_code, item_id, plan_date + ' item_code')
  const [open, setOpen] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [count, setCount] = useState(0)
  const [count_value, setCount_value] = useState(0)
  const [value, setvalue] = useState(1)
  const [datavalue, setdatavalue] = useState([])

  // console.log(datavalue.frame_prod_qty)
  const [valuecheck, setvaluecheck] = useState(0)
  const [type, setType] = useState('')
  const [rq, setrq] = useState(0)
  const [subCount, setsubCount] = useState(0)
  const [prod, setprod] = useState(0)
  const [SubDialog, setSubDialog] = useState(false)

  // console.log(datavalue.frame_prod_qty + '=====datavalue')

  // console.log('After' + count_value)
  let valueprod = parseInt(prod) + parseInt(count)

  // let valuecount = parseInt(count) + valueprod

  // console.log('rq----' + parseInt(rq) + '=======' + valueprod + '====' + parseInt(count))

  // console.log(rq === parseInt(prod.toString()) + parseInt(count.toString()) + 'condition')

  const cancelSubQC = () => {
    setCount(count + subCount)
    setCount_value(count_value + subCount)
    setsubCount(0)
    setSubDialog(false)
  }

  const fetchBusPlans = async () => {
    try {
      const response = fetch('/api/Diversitech/Workers/Frame/Frame/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id, count, plan_no, type })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data)
          setBusPlans(data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
      setBusPlans([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusPlans()

    // fetchModelData()
    handlecheckdb()
  }, [plan_no, item_code])

  const updateFrameProdQty = async () => {
    try {
      const response = await fetch('/api/Diversitech/Workers/Frame/FrameImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_code, count_value, plan_no, type, seat_id })
      })

      if (!response.ok) {
        throw new Error('Failed to update frame_prod_qty')
      }

      const updatedData = await response.json()

      // console.log(updatedData + ' ' + updatedData.message)

      if (updatedData.success) {
        toast.success(updatedData.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
        setShowModal(false)

        // setvalue(1)
        setCount_value(0)
        if (subCount) {
          window.location.reload()
        }

        // setCount(0)
        {
          parseInt(rq) === parseInt(count)
            ? setTimeout(() => {
                window.location.href = `/components/Frames/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : parseInt(rq) === valueprod
            ? setTimeout(() => {
                window.location.href = `/components/Frames/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : null
        }

        // setTimeout(() => {
        //   window.location.reload()
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

      // // const updatedRow = busPlans.find(row => row.item_code === item_code)
      // // if (updatedRow) {
      // //   updatedRow.frame_prod_qty = Math.max(updatedRow.frame_plan_qty - count, 0)
      // setBusPlans(updatedData)
    } catch (error) {
      console.error(error)
    }
  }

  // const fetchModelData = async () => {
  //   try {
  //     const requestOptions = {
  //       method: 'POST', // or 'GET' depending on your API endpoint requirements
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ plan_no, item_code, item_id, part_id }) // Include the JSON payload here
  //     }

  //     const response = await fetch('/api/Diversitech/Workers/Frame/FrameParts/', requestOptions)

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch model data')
  //     }

  //     const data = await response.json()

  //     // console.log('Fetched data:', data)
  //     setModelData(data)
  //     setLoading(false)

  //     // Log modelData after setting it
  //   } catch (error) {
  //     console.error('Error fetching model data:', error)
  //   }
  // }

  // console.log('modelData:', modelData)

  // const handleDecrement = () => {
  //   setType('sub')
  //   if (count > 0) {
  //     setCount(count - 1)
  //   }
  // }

  const handleDecrement = () => {
    // setType('sub')
    if (count > 0 || count_value > 0) {
      setCount(count - 1)
      setCount_value(count_value - 1)

      // setvalue(value - subCount)
      setsubCount(subCount + 1)
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

  const handlecheckdb = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value, seat_id, plan_no })
      }

      const response = await fetch('/api/Diversitech/Workers/Frame/Checkframe/', requestOptions)

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

  // const imageExists = imageUrl => {
  //   const http = new XMLHttpRequest()
  //   http.open('HEAD', imageUrl, false)
  //   http.send()

  //   return http.status !== 404
  // }

  // // Usage of imageExists function
  // const imageUrl = '/image/seatframes/'
  // const exists = imageExists(imageUrl)
  // if (exists) {
  //   console.log('Image exists!')
  // } else {
  //   console.log('Image does not exist.')
  // }

  return (
    <Card>
      <ToastContainer />
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Plan Number: {plan_no}</Typography>
          </div>

          <div>
            <Typography variant='h5'>Item Code: {item_code}</Typography>
          </div>

          <div>
            <Typography variant='h6'>Date: {plan_date}</Typography>
          </div>
        </div>
      )}
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={11} justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            {/* {imageExists(`/image/seatframes/${item_code}_FM.png`) ? ( */}
            {/* {busPlans
              .filter(row => item_code === row.item_code)
              .map((rowData, index) => (
                <img
                  key={index}
                  alt='diversitech'
                  style={{ cursor: 'pointer' }}
                  src={JSON.parse(rowData.frame_img_url).file2}
                  onError={e => {
                    e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
                  }}
                />
              ))} */}
            {Array.isArray(busPlans) &&
              busPlans
                .filter(row => item_code === row.item_code)
                .map((rowData, index) => (
                  <img
                    key={index}
                    alt='diversitech'
                    style={{ cursor: 'pointer' }}
                    src={JSON.parse(rowData.frame_img_url).file2}
                    onError={e => {
                      e.target.src = '/image/logo/unavailable.png' // Set a default image if the original image doesn't exist
                    }}
                  />
                ))}
            {/* ) : (
              <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
            )} */}
          </Grid>
          <Grid item xs={12} md={1}>
            <Button size='medium' type='submit' variant='contained' onClick={() => setOpen(true)}>
              Parts
            </Button>
          </Grid>

          <Dialog open={open} onClose={() => setOpen(false)}>
            <Grid container justifyContent='space-between' alignItems='space-between'>
              <Grid>
                <DialogTitle style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Frame Parts
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

            <DialogContent style={{ maxWidth: '4000px', maxHeight: '500px', overflowY: 'auto' }}>
              <DTableAitem modelData={modelData} />
            </DialogContent>
          </Dialog>
        </Grid>

        <Grid container spacing={2} sx={{ margin: '0 auto' }}>
          <Grid item xs={12} md={4}>
            <Table sx={{ minWidth: 100, border: '1px solid #000' }} aria-label='simple table'>
              {busPlans.length > 0 ? (
                busPlans
                  .filter(row => item_code === row.item_code)
                  .map((rowData, index) => (
                    <React.Fragment key={index}>
                      <StyledTableRow>
                        <StyledTableCell>Model</StyledTableCell>
                        <StyledTableCell>{rowData.frame_model}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>FRAME DRAWING NUMBER</StyledTableCell>
                        <StyledTableCell>{rowData.item_code}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>LEG PART NUMBER</StyledTableCell>
                        <StyledTableCell>{rowData.legpart_no}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>WELDING FIXTURE NUMBER</StyledTableCell>
                        <StyledTableCell>{rowData.welding_no}</StyledTableCell>
                      </StyledTableRow>
                      <StyledTableRow>
                        <StyledTableCell>MTG CD GAUGE NUMBER</StyledTableCell>
                        <StyledTableCell>{rowData.mtgauge_no}</StyledTableCell>
                      </StyledTableRow>
                    </React.Fragment>
                  ))
              ) : (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={6}>
                    <Typography>No Data Available</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </Table>
          </Grid>
          <Grid item xs={12} md={8} sx={{ margin: '0 auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align='center'>Part Number</StyledTableCell>
                    <StyledTableCell align='center'>Required Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Produced</StyledTableCell>
                    <StyledTableCell align='center'>Short</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {busPlans.length ? (
                    busPlans
                      .filter(row => item_code === row.item_code)
                      .map((filteredRow, index) => (
                        <StyledTableRow key={index}>
                          {item_code === filteredRow.item_code ? (
                            <>
                              <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
                              <StyledTableCell align='center'>{filteredRow.frame_plan_qty}</StyledTableCell>
                              <StyledTableCell align='center'>
                                <Button onClick={() => setSubDialog(true)}>-</Button>
                                {isNaN(parseInt(datavalue.frame_prod_qty))
                                  ? datavalue.frame_prod_qty + count
                                  : valuecheck
                                  ? parseInt(datavalue.frame_prod_qty) + valuecheck + subCount
                                  : parseInt(datavalue.frame_prod_qty) + count_value + subCount}

                                {/* {datavalue.frame_plan_qty + parseInt(count)} */}
                                {/* {isNaN(parseInt(filteredRow.frame_prod_qty))
                                  ? 0 + count
                                  : parseInt(filteredRow.frame_prod_qty) + count} */}
                                {/* {console.log(parseInt(filteredRow.frame_prod_qty) + count + '  =  inside a busplans')} */}

                                {Math.max(filteredRow.frame_plan_qty - count - filteredRow.frame_prod_qty, 0) ===
                                0 ? null : (
                                  <Button
                                    onClick={() => {
                                      setCount(Math.min(count + 1, filteredRow.frame_plan_qty)),
                                        setCount_value(Math.min(count_value + 1, filteredRow.frame_plan_qty)),
                                        setType('add'),
                                        setrq(filteredRow.frame_plan_qty),
                                        setprod(filteredRow.frame_prod_qty),
                                        setvalue(Math.min(value + 1, filteredRow.frame_plan_qty)),
                                        setvaluecheck(0),
                                        handlecheckdb()

                                      // setprod(filteredRow.frame_prod_qty)
                                    }}
                                    disabled={count === filteredRow.frame_plan_qty}
                                  >
                                    +
                                  </Button>
                                )}
                              </StyledTableCell>
                              <StyledTableCell align='center'>
                                {Math.max(filteredRow.frame_plan_qty - count - filteredRow.frame_prod_qty, 0)}
                              </StyledTableCell>
                            </>
                          ) : (
                            <>
                              <StyledTableCell colSpan={5} />
                            </>
                          )}
                        </StyledTableRow>
                      ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell align='center' colSpan={6}>
                        <Typography>Loading...</Typography>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Grid container justifyContent='center' alignItems='center'>
              <Grid padding='10px'>
                <Link href={`/components/Frames/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}>
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
              {/* <DialogTitle>Frames</DialogTitle> */}
              <DialogContent>
                <Typography>Are you sure you want to save..?</Typography>
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid padding='10px'>
                    <Button size='medium' onClick={updateFrameProdQty} type='submit' variant='contained'>
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
                <Button size='medium' onClick={updateFrameProdQty} type='submit' variant='contained'>
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

export default FrameCom
