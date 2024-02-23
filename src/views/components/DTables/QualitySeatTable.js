import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
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
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

const QStable = ({ onPlanSelected }) => {
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
    if (dec === 'qc_qty') {
      const qc_qtyA = String(a.qc_qty)
      const qc_qtyB = String(b.qc_qty)

      return isAsc ? qc_qtyA.localeCompare(qc_qtyB) : qc_qtyB.localeCompare(qc_qtyA)
    }

    return 0
  })

  // Function to fetch data from the API based on the plan_no
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

      // console.log('Check=' + data)

      // Ensure that the data received is an array before setting it to busPlans

      if (Array.isArray(data)) {
        setBusPlans(data)
      } else {
        console.error('Invalid data format:', data)
      }

      setLoading(false)
    } catch (error) {
      console.error(error)

      setBusPlans([]) // Initialize as an empty array on error

      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no])

  const handleQCColumn = row => {
    // console.log('Selected Plan:', row.seat_prod_qty + row.qc_qty)
    if (row.seat_prod_qty === row.qc_qty) {
      toast.error('The record quantities are equal, both being zero.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500 // Display the toast for 1.5 seconds
      })
    } else {
      const targetPage = `/components/qualitycheck/?plan_no=${encodeURIComponent(
        plan_no
      )}&item_code=${encodeURIComponent(row.item_code)}&Vecv_no=${encodeURIComponent(
        row.vecv_part_no
      )}&plan_date=${encodeURIComponent(plan_date)}&item_id=${encodeURIComponent(
        item_id
      )}&frame_id=${encodeURIComponent(row.frame_item_id)}&seat_id=${encodeURIComponent(row.seat_item_id)}`
      router.push(targetPage)
    }
  }

  const exportToExcel = () => {
    const customData = busPlans.map(row => ({
      'QC Number': row.item_code || '',
      'Vecv Number': row.vecv_part_no || '',
      Description: row.item_description || '',
      'Request Quantity': row.seat_plan_qty || '',
      'Seat Quantity': row.seat_prod_qty || '',
      'Produces Quantity': row.qc_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, `QualityCheck_${plan_no}`)
    XLSX.writeFile(wb, `QualityCheck_${plan_no}.xlsx`)
  }

  return (
    <Card>
      <ToastContainer />
      {/* /* Display plan number and status description */}
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Plan Number: {plan_no}</Typography>
          </div>
          <Grid alignItems='center' justifyContent='center' style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h4' style={{ color: 'Black' }}>
              Quality Checks
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
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'vecv_part_no'}
                  direction={inc === 'vecv_part_no' ? inc : inc}
                  onClick={() => handleSortRequest('vecv_part_no')}
                >
                  VECV Number
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
                  active={inc === 'seat_plan_qty'}
                  direction={inc === 'seat_plan_qty' ? inc : inc}
                  onClick={() => handleSortRequest('seat_plan_qty')}
                >
                  Required Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'seat_prod_qty'}
                  direction={inc === 'seat_prod_qty' ? inc : inc}
                  onClick={() => handleSortRequest('seat_prod_qty')}
                >
                  Available Quantity
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                {' '}
                <TableSortLabel
                  active={inc === 'qc_qty'}
                  direction={inc === 'qc_qty' ? inc : inc}
                  onClick={() => handleSortRequest('qc_qty')}
                >
                  Checked Quantity
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
                      {/* Map the appropriate data fields from the API response */}
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell> {/* Use 'row.seat_item_id' */}
                      <StyledTableCell align='left'>{row.vecv_part_no}</StyledTableCell>
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.seat_plan_qty}</StyledTableCell>
                      <StyledTableCell align='right'>{row.seat_prod_qty - row.qc_qty}</StyledTableCell>{' '}
                      <StyledTableCell align='right'>{row.qc_qty}</StyledTableCell>
                      {/* {row.image_url ? ( */}
                      <StyledTableCell align='right'>
                        <img
                          alt='Qc'
                          width='50px'
                          height='50px'
                          src={JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`}
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
                      {/* <StyledTableCell align='right'>
                        <img
                          alt='QC'
                          width='50px'
                          height='50px'
                          src={`${row.image_url}${row.item_code}.png`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            imagepopup(row), setopen(true)
                          }}
                        />
                      </StyledTableCell> */}
                      <StyledTableCell align='center' style={{ width: '2px' }}>
                        <IconButton onClick={() => handleQCColumn(row)} aria-label='unavailable' color='primary'>
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

export default QStable
