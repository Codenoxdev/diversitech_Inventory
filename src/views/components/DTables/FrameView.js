import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { TableContainer, TextField } from '@mui/material'
import Link from 'next/link'
import { Card, Typography, Grid, Box, IconButton, Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Icon from 'src/@core/components/icon'
import * as XLSX from 'xlsx'

const FrameView = ({ onPlanSelected }) => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code')
  const [inc, setInc] = useState('asc')
  const router = useRouter()
  const { plan_no, item_id, plan_date } = router.query

  // console.log(plan_no, item_id, busPlans)
  const [open, setopen] = useState(false)
  const [popuppath, setpopuppath] = useState('')

  // console.log(popuppath)

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
      const item_descriptionA = String(a.item_description)
      const item_descriptionB = String(b.item_description)

      return isAsc
        ? item_descriptionA.localeCompare(item_descriptionB)
        : item_descriptionB.localeCompare(item_descriptionA)
    }
    if (dec === 'frame_plan_qty') {
      const frame_plan_qtyA = String(a.frame_plan_qty)
      const frame_plan_qtyB = String(b.frame_plan_qty)

      return isAsc ? frame_plan_qtyA.localeCompare(frame_plan_qtyB) : frame_plan_qtyB.localeCompare(frame_plan_qtyA)
    }
    if (dec === 'frame_prod_qty') {
      const frame_prod_qtyA = String(a.frame_prod_qty)
      const frame_prod_qtyB = String(b.frame_prod_qty)

      return isAsc ? frame_prod_qtyA.localeCompare(frame_prod_qtyB) : frame_prod_qtyB.localeCompare(frame_prod_qtyA)
    }

    return 0
  })

  const imagepopup = row => {
    setpopuppath(JSON.parse(row.image_url).file2)
  }

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no])

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

  const handleFrameColumn = row => {
    if (row.frame_prod_qty === row.frame_plan_qty) {
      toast.error('The record quantities are equal, both being zero.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
    } else {
      const targetPage = `/components/Frames/?plan_no=${encodeURIComponent(plan_no)}&item_code=${encodeURIComponent(
        row.item_code
      )}&item_id=${encodeURIComponent(item_id)}&plan_date=${encodeURIComponent(plan_date)}&seat_id=${encodeURIComponent(
        row.seat_item_id
      )}&part_id=${encodeURIComponent(row.frame_item_id)}`

      router.push(targetPage)
    }
  }

  const exportToExcel = () => {
    const customData = busPlans.map(row => ({
      'Frame Number': row.item_code || '',
      Description: row.item_description || '',
      'Request Quantity': row.frame_plan_qty || '',
      'Produces Quantity': row.frame_prod_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, `Frame_Assy_${plan_no}`)
    XLSX.writeFile(wb, `Frame_Assy_${plan_no}.xlsx`)
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
              Production Frame
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
                  Produced Quantity
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
            ) : // <StyledTableRow>
            //   <StyledTableCell align='center' colSpan={6}>
            //     <Typography>No data available</Typography>
            //   </StyledTableCell>
            // </StyledTableRow>
            busPlans.length === 0 ? (
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
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.frame_plan_qty}</StyledTableCell>{' '}
                      <StyledTableCell align='right'>{row.frame_prod_qty}</StyledTableCell>
                      {/* {row.image_url.file2 ? ( */}
                      <StyledTableCell align='right'>
                        <img
                          alt='Frame'
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
                            onError={e => {
                              e.target.src = '/image/logo/unavailable.png'
                            }}
                          />{' '} */}
                      {/* </StyledTableCell>
                      )} */}
                      {/* <StyledTableCell align='right'>
                        <img
                          alt='Frame'
                          width='50px'
                          height='50px'
                          style={{ cursor: 'pointer' }}
                          src={`${row.image_url}${row.item_code}.png`}
                          onClick={() => {
                            imagepopup(row), setopen(true)
                          }}
                        /> */}
                      {/* {console.log(`${row.image_url}${row.item_code}_F.png`)} */}
                      {/* </StyledTableCell> */}
                      <StyledTableCell align='center' style={{ width: '2px' }}>
                        <IconButton onClick={() => handleFrameColumn(row)} aria-label='unavailable' color='primary'>
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

export default FrameView
