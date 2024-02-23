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
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

const SeatView = ({ onPlanSelected }) => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { plan_no, item_id, plan_date } = router.query
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code') // Default sorting column
  const [inc, setInc] = useState('asc')
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

  const imagepopup = row => {
    setpopuppath(JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`)
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
    if (dec === 'vecv_part_no') {
      const vecv_part_noA = String(a.vecv_part_no)
      const vecv_part_noB = String(b.vecv_part_no)

      return isAsc ? vecv_part_noA.localeCompare(vecv_part_noB) : vecv_part_noB.localeCompare(vecv_part_noA)
    }
    if (dec === 'seat_plan_qty') {
      const seat_plan_qtyA = String(a.seat_plan_qty)
      const seat_plan_qtyB = String(b.seat_plan_qty)

      return isAsc ? seat_plan_qtyA.localeCompare(seat_plan_qtyB) : seat_plan_qtyB.localeCompare(seat_plan_qtyA)
    }
    if (dec === 'seat_prod_qty') {
      const seat_prod_qtyA = String(a.seat_prod_qty)
      const seat_prod_qtyB = String(b.seat_prod_qty)

      return isAsc ? seat_prod_qtyA.localeCompare(seat_prod_qtyB) : seat_prod_qtyB.localeCompare(seat_prod_qtyA)
    }
    if (dec === 'frame_paint_qty') {
      const frame_paint_qtyA = String(a.frame_paint_qty)
      const frame_paint_qtyB = String(b.frame_paint_qty)

      return isAsc ? frame_paint_qtyA.localeCompare(frame_paint_qtyB) : frame_paint_qtyB.localeCompare(frame_paint_qtyA)
    }

    return 0
  })

  const fetchBusPlans = async () => {
    try {
      const response = await fetch('/api/Diversitech/Workers/Assembly/SeatView/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ plan_no, item_id })
      })
      const data = await response.json()

      if (Array.isArray(data)) {
        setBusPlans(data)
      } else {
        console.error('Invalid data format:', data)
      }

      setLoading(false)
    } catch (error) {
      console.error(error)
      setBusPlans([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no]) // Re-fetch data when the plan_no changes

  const handleAssemblyColumn = row => {
    if (row.seat_prod_qty === row.frame_paint_qty) {
      toast.error('The record quantities are equal, both being zero.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500 // Display the toast for 1.5 seconds
      })
    } else {
      const targetPage = `/components/Production/?plan_no=${encodeURIComponent(plan_no)}&item_code=${encodeURIComponent(
        row.item_code
      )}&plan_date=${encodeURIComponent(plan_date)}&item_id=${encodeURIComponent(
        item_id
      )}&frame_id=${encodeURIComponent(row.frame_item_id)}&seat_id=${encodeURIComponent(row.seat_item_id)}`

      router.push(targetPage)
    }
  }

  const exportToExcel = () => {
    const customData = busPlans.map(row => ({
      'Seat Number': row.item_code || '',
      'Vecv Number': row.vecv_part_no || '',
      Description: row.item_description || '',
      'Request Quantity': row.seat_plan_qty || '',
      'Frame Quantity': row.frame_paint_qty || '',
      'Produces Quantity': row.seat_prod_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `Seat_Assy_${plan_no}`)
    XLSX.writeFile(wb, `Seat_Assy_${plan_no}.xlsx`)
  }

  return (
    <Card>
      <ToastContainer />
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Plan Number: {plan_no}</Typography>
          </div>
          <Grid alignItems='center' justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' style={{ color: 'Black' }}>
              Assembly Seats
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
              <StyledTableCell align='left'>VECV Number</StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_description'}
                  direction={inc === 'item_description' ? inc : inc}
                  onClick={() => handleSortRequest('item_description')}
                >
                  Description
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>Required Quantity</StyledTableCell>
              <StyledTableCell align='right'>Available Quantity</StyledTableCell>
              <StyledTableCell align='right'>Produced Quantity</StyledTableCell>
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
                      {/* Map the appropriate data fields from the API response */}
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell> {/* Use 'row.seat_item_id' */}
                      <StyledTableCell align='left'>{row.vecv_part_no}</StyledTableCell>
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.seat_plan_qty}</StyledTableCell>
                      <StyledTableCell align='right'>{row.frame_paint_qty - row.seat_prod_qty}</StyledTableCell>{' '}
                      <StyledTableCell align='right'>{row.seat_prod_qty}</StyledTableCell>
                      {/* {row.image_url ? ( */}
                      <StyledTableCell align='right'>
                        <img
                          alt='Assembly'
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
                            alt='Assembly'
                            width='50px'
                            height='50px'
                            src={`/image/logo/unavailable.png`}
                            style={{ cursor: 'pointer' }}
                          />{' '}
                        </StyledTableCell>
                      )} */}
                      {/* {console.log(`/image/SeatsAssembly/${row.item_code}.png`)} */}
                      <StyledTableCell align='center' style={{ width: '2px' }}>
                        <IconButton onClick={() => handleAssemblyColumn(row)} aria-label='unavailable' color='primary'>
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
          <img alt='Image' width='150px' height='150px' style={{ cursor: 'pointer' }} src={`${popuppath}`} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default SeatView
