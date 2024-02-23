import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import * as XLSX from 'xlsx'
import {
  Card,
  Typography,
  Grid,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box
} from '@mui/material'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

const PStable = ({ onPlanSelected }) => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code') // Default sorting column
  const [inc, setInc] = useState('asc')
  const { plan_no, item_id, plan_date } = router.query
  const [open, setopen] = useState(false)
  const [popuppath, setpopuppath] = useState('')

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 15
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

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const sortedBusPlans = busPlans.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'item_code') {
      return isAsc
        ? (a?.item_code || '').localeCompare(b?.item_code || '')
        : (b?.item_code || '').localeCompare(a?.item_code || '')
    }
    if (dec === 'item_description') {
      return isAsc
        ? a.item_description.localeCompare(b.item_description)
        : b.item_description.localeCompare(a.item_description)
    }
    if (dec === 'frame_plan_qty') {
      const frame_plan_qtyA = String(a.frame_plan_qty)
      const frame_plan_qtyB = String(b.frame_plan_qty)

      return isAsc ? frame_plan_qtyA.localeCompare(frame_plan_qtyB) : frame_plan_qtyB.localeCompare(frame_plan_qtyA)
    }
    if (dec === 'frame_paint_qty') {
      const frame_paint_qtyA = String(a.frame_paint_qty)
      const frame_paint_qtyB = String(b.frame_paint_qty)

      return isAsc ? frame_paint_qtyA.localeCompare(frame_paint_qtyB) : frame_paint_qtyB.localeCompare(frame_paint_qtyA)
    }
    if (dec === 'frame_prod_qty') {
      const frame_prod_qtyA = String(a.frame_prod_qty)
      const frame_prod_qtyB = String(b.frame_prod_qty)

      return isAsc ? frame_prod_qtyA.localeCompare(frame_prod_qtyB) : frame_prod_qtyB.localeCompare(frame_prod_qtyA)
    }

    return 0
  })

  // Function to fetch data from the API based on the plan_no
  const fetchBusPlans = async () => {
    try {
      const response = await fetch('/api/Diversitech/Workers/Frame/FrameView/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no, item_id })
      })
      const data = await response.json()

      // console.log('Check=' + data)
      // Ensure that the data received is an array before setting it to busPlans

      if (Array.isArray(data)) {
        setBusPlans(data)
      } else {
        console.error('Invalid data format:', data)
      }
      setLoading(false)
    } catch (error) {
      setBusPlans([]) // Initialize as an empty array on error
      setLoading(false)
    }
  }

  const handlePaintColumn = row => {
    if (row.frame_prod_qty === row.frame_paint_qty) {
      toast.error('The record quantities are equal, both being zero.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500 // Display the toast for 1.5 seconds
      })
    } else {
      const targetPage = `/components/paints/?plan_no=${encodeURIComponent(plan_no)}&item_code=${encodeURIComponent(
        row.item_code
      )}&item_id=${encodeURIComponent(item_id)}&plan_date=${encodeURIComponent(plan_date)}&seat_id=${encodeURIComponent(
        row.seat_item_id
      )}`

      router.push(targetPage)
    }
  }

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no, item_id]) // Re-fetch data when the plan_no changes

  const imagepopup = row => {
    setpopuppath(JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`)
  }

  const exportToExcel = () => {
    const customData = busPlans.map(row => ({
      'Frame Number': row.item_code || '',
      Description: row.item_description || '',
      'Request Quantity': row.frame_plan_qty || '',
      'Frame Quantity': row.frame_prod_qty || '',
      'Produces Quantity': row.frame_paint_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, `Paint_Frame_${plan_no}`)
    XLSX.writeFile(wb, `Paint_Frame_${plan_no}.xlsx`)
  }

  return (
    <Card>
      <ToastContainer />
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'right' }}>
          <div>
            <Typography variant='h5'>Plan Number: {plan_no}</Typography>
          </div>
          <Grid alignItems='center' justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' style={{ color: 'Black' }}>
              Production Paint
            </Typography>
          </Grid>
          <div>
            <Typography variant='h6'>Date: {plan_date}</Typography>
          </div>
        </div>
      )}
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Button
          sx={{ mr: 4, mb: 2 }}
          onClick={exportToExcel}
          color='secondary'
          variant='outlined'
          startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
        >
          Export
        </Button>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
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
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            {/* Add appropriate table headers */}
            <StyledTableRow>
              {/* Add appropriate table headers */}
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Part Number
                </TableSortLabel>
              </StyledTableCell>

              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_description'}
                  direction={inc === 'item_description' ? inc : inc}
                  onClick={() => handleSortRequest('item_description')}
                >
                  Description
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'frame_plan_qty'}
                  direction={inc === 'frame_plan_qty' ? inc : inc}
                  onClick={() => handleSortRequest('frame_plan_qty')}
                >
                  Required Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'frame_prod_qty'}
                  direction={inc === 'frame_prod_qty' ? inc : inc}
                  onClick={() => handleSortRequest('frame_prod_qty')}
                >
                  Available Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'frame_paint_qty'}
                  direction={inc === 'frame_paint_qty' ? inc : inc}
                  onClick={() => handleSortRequest('frame_paint_qty')}
                >
                  Produced Quantity{' '}
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>Image</StyledTableCell>
              <StyledTableCell align='right'></StyledTableCell>
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
              sortedBusPlans
                .filter(row => !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((row, index) =>
                  !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <StyledTableRow key={index}>
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell> {/* Use 'row.seat_item_id' */}
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.frame_plan_qty}</StyledTableCell>
                      <StyledTableCell align='right'>{row.frame_prod_qty - row.frame_paint_qty}</StyledTableCell>{' '}
                      <StyledTableCell align='right'>{row.frame_paint_qty}</StyledTableCell>
                      {/* {row.image_url ? ( */}
                      <StyledTableCell align='right'>
                        <img
                          alt='Paint'
                          width='50px'
                          height='50px'
                          src={
                            row.image_url
                              ? JSON.parse(row.image_url)?.file2 || '/image/logo/unavailable.png'
                              : '/image/logo/unavailable.png'
                          }
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            imagepopup(row), setopen(true)
                          }}
                        />{' '}
                      </StyledTableCell>
                      {/* ) : (
                        <StyledTableCell align='right'>
                          <img
                            alt='Paint'
                            width='50px'
                            height='50px'
                            src={`/image/logo/unavailable.png`}
                            style={{ cursor: 'pointer' }}
                          />{' '}
                        </StyledTableCell>
                      )} */}
                      {/* <StyledTableCell align='right'>
                        <img
                          alt='Paint'
                          width='50px'
                          height='50px'
                          src={`${row.image_url}${row.item_code}.png`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            imagepopup(row), setopen(true)
                          }} */}
                      {/* // onClick={() => handlePaintColumn(row)}
                        />
                      </StyledTableCell> */}
                      <StyledTableCell align='center' style={{ width: '2px' }}>
                        <IconButton onClick={() => handlePaintColumn(row)} aria-label='unavailable' color='primary'>
                          <PlayCircleOutlineIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ) : null
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={() => setopen(false)}>
        {' '}
        <DialogContent>
          <img alt='Image' width='150px' height='150px' style={{ cursor: 'pointer' }} src={popuppath} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PStable
