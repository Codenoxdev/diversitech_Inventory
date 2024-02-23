import { useState, useEffect } from 'react'
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
import DTableFitem from '../DTables/TableFitems'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PaintCom = () => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { plan_no, item_code, item_id, plan_date, seat_id } = router.query
  const [type, setType] = useState('')
  const [open, setOpen] = useState(false)
  const [count_value, setCount_value] = useState(0)
  const [value, setvalue] = useState(1)
  const [datavalue, setdatavalue] = useState([])
  const [count, setCount] = useState(0)
  const [subCount, setsubCount] = useState(0)
  const [SubDialog, setSubDialog] = useState(false)
  const [rq, setrq] = useState(0)
  const [prod, setprod] = useState(0)
  const [valuecheck, setvaluecheck] = useState(0)
  let valueprod = parseInt(prod) + parseInt(count)

  // console.log(datavalue.frame_prod_qty + '=====datavalue')

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

  const fetchBusPlans = async () => {
    try {
      const response = fetch('/api/Diversitech/Workers/Frame/Frame/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data)
          setBusPlans(data)
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
    handlecheckdb()
  }, [plan_no])

  const updatePaintProdQty = async () => {
    // console.log(item_code, count, plan_no)
    setSubDialog(false)
    setOpen(false)

    // setvalue(0)

    // setsubCount(0)

    try {
      const response = await fetch('/api/Diversitech/Workers/Paint/PaintImport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_code, count_value, plan_no, type, seat_id, subCount })
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
        setOpen(false)
        setCount_value(0)
        if (subCount) {
          window.location.reload()
        }
        {
          // console.log(parseInt(rq) === valueprod + '======check')
          parseInt(rq) === parseInt(datavalue.frame_paint_qty) + count_value
            ? setTimeout(() => {
                window.location.href = `/components/paints/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : parseInt(rq) === valueprod
            ? setTimeout(() => {
                window.location.href = `/components/paints/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}` // This will reload the page
              }, 1000)
            : null
        }
      } else {
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

  // const handleDecrement = () => {
  //   // setType('sub')
  //   if (count > 0) {
  //     setCount(count - 1)
  //     setsubCount(subCount + 1)
  //   }
  // }

  const handleDecrement = () => {
    if (count > 0 || count_value > 0) {
      setCount(count - 1)
      setCount_value(count_value - 1)
      setvalue(value - subCount)
      setsubCount(subCount + 1)
    }
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

  return (
    <Card>
      <ToastContainer />
      <CardContent>
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={11} justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            {/* {imageExists(`/image/seatframes/${item_code}_FM.png`) ? ( */}
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

            {/* <img
              alt='Image'
              style={{ cursor: 'pointer' }}
              src={`/image/Assembly/${item_code}.png`}
              onError={e => {
                e.target.src = '/image/logo/unavailable.png'
              }}
            /> */}
            {/* ) : (
              <img alt='NA' width='50px' height='50px' src='/image/logo/unavailable.png' />
            )} */}
          </Grid>

          <Grid item xs={12} sx={{ margin: '0 auto' }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 500, border: '1px solid #000' }} aria-label='simple table'>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell align='center'>Part Number</StyledTableCell>
                    <StyledTableCell align='center'>Required Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Available Quantity</StyledTableCell>
                    <StyledTableCell align='center'>Painted</StyledTableCell>
                    <StyledTableCell align='center'>Short</StyledTableCell>
                    {/* <TableCell align='center'>Paint Quantity</TableCell> */}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {busPlans.length ? (
                    busPlans
                      .filter(row => item_code === row.item_code)
                      .map((filteredRow, index) => (
                        <StyledTableRow key={index}>
                          {/* Render different elements based on the condition */}

                          {item_code === filteredRow.item_code ? (
                            <>
                              <StyledTableCell align='center'>{filteredRow.item_code}</StyledTableCell>
                              <StyledTableCell align='center'>{filteredRow.frame_plan_qty}</StyledTableCell>
                              <StyledTableCell align='center'>
                                {filteredRow.frame_prod_qty - datavalue.frame_paint_qty}
                              </StyledTableCell>

                              <StyledTableCell align='center'>
                                <Button onClick={() => setSubDialog(true)}>-</Button>

                                {isNaN(parseInt(datavalue.frame_paint_qty))
                                  ? datavalue.frame_paint_qty + count
                                  : valuecheck
                                  ? parseInt(datavalue.frame_paint_qty) + valuecheck + subCount
                                  : parseInt(datavalue.frame_paint_qty) + count_value + subCount}

                                {Math.max(filteredRow.frame_prod_qty - count - filteredRow.frame_paint_qty, 0) ===
                                0 ? null : (
                                  <Button
                                    onClick={() => {
                                      // setCount(Math.min(count + 1, filteredRow.frame_prod_qty)),
                                      //   setType('add'),
                                      //   setrq(filteredRow.frame_prod_qty),
                                      //   setprod(filteredRow.frame_paint_qty)

                                      setCount(Math.min(count + 1, filteredRow.frame_prod_qty)),
                                        setCount_value(Math.min(count_value + 1, filteredRow.frame_prod_qty)),
                                        setType('add'),
                                        setrq(filteredRow.frame_prod_qty),
                                        setprod(filteredRow.frame_paint_qty),
                                        setvalue(Math.min(value + 1, filteredRow.frame_prod_qty)),
                                        setvaluecheck(0),
                                        handlecheckdb()
                                    }}
                                    disabled={
                                      parseInt(datavalue.frame_paint_qty) + count === filteredRow.frame_prod_qty
                                    }
                                  >
                                    +
                                  </Button>
                                )}
                              </StyledTableCell>
                              {/* {console.log(
                                datavalue.frame_paint_qty + ' ' + valuecheck + ' ' + subCount + ' ' + count_value
                              )} */}
                              {/* {console.log(
                                parseInt(datavalue.frame_paint_qty) +
                                  valuecheck +
                                  subCount +
                                  ' check ' +
                                  datavalue.frame_paint_qty +
                                  count_value +
                                  subCount
                              )} */}

                              <StyledTableCell align='center'>
                                {Math.max(datavalue.frame_prod_qty - count - filteredRow.frame_paint_qty, 0)}
                              </StyledTableCell>
                            </>
                          ) : (
                            <>
                              <StyledTableCell colSpan={4} />
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
            <Grid container padding='20px' justifyContent='center' alignItems='center'>
              <Grid>
                <Link href={`/components/paints/Seats/?plan_no=${plan_no}&item_id=${item_id}&plan_date=${plan_date}`}>
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
                    type='submit'
                    onClick={() => {
                      setOpen(true), setvaluecheck(count_value)
                    }}
                    variant='contained'
                  >
                    Submit
                  </Button>
                )}
              </Grid>
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                  <Typography>Are you sure you want to save..?</Typography>
                  <Grid container justifyContent='center' alignItems='center'>
                    <Grid padding='10px'>
                      <Button size='medium' onClick={updatePaintProdQty} type='submit' variant='contained'>
                        Yes
                      </Button>
                    </Grid>
                    <Grid padding='20px'>
                      <Button size='medium' type='submit' onClick={() => setOpen(false)} variant='contained'>
                        No
                      </Button>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Dialog>
            </Grid>
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
                <Button size='medium' onClick={updatePaintProdQty} type='submit' variant='contained'>
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

export default PaintCom
