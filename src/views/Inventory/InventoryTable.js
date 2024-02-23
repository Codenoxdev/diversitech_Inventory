import React, { useContext, useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { TableContainer } from '@mui/material/'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'
import { Card, Box, Typography, Grid, TextField, Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'

const MainInventory = () => {
  const router = useRouter()

  // const { Inventory, setInventory } = useContext(AuthContext)
  const [Inventory, setInventory] = useState([])

  // console.log('Inventory')
  // console.log(Inventory)

  // console.log('Inventory' + Inventory)
  const { plan_no, item_id, plan_date } = router.query

  // console.log('plan_no, item_id, plan_date')
  // console.log(plan_no, item_id, plan_date)

  // console.log(plan_no, item_id, plan_date)

  // const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('vecv_part_no')
  const [inc, setInc] = useState('asc')

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

  const sortedInventory = Inventory.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'vecv_part_no') {
      if (a.vecv_part_no === null || b.vecv_part_no === null) {
        return a.vecv_part_no === null ? 1 : -1
      } else {
        return isAsc ? a.vecv_part_no.localeCompare(b.vecv_part_no) : b.vecv_part_no.localeCompare(a.vecv_part_no)
      }
    }
    if (dec === 'item_description') {
      return isAsc
        ? a.item_description.localeCompare(b.item_description)
        : b.item_description.localeCompare(a.item_description)
    }
    if (dec === 'quantity') {
      return isAsc ? a.quantity.localeCompare(b.quantity) : b.quantity.localeCompare(a.quantity)
    }
    if (dec === 'seat_plan_qty') {
      return isAsc ? a.seat_plan_qty.localeCompare(b.seat_plan_qty) : b.seat_plan_qty.localeCompare(a.seat_plan_qty)
    }
    if (dec === 'item_code') {
      return isAsc ? a.item_code.localeCompare(b.item_code) : b.item_code.localeCompare(a.item_code)
    }
    if (dec === 'qc_qty') {
      return isAsc ? a.quantity.localeCompare(b.quantity) : b.quantity.localeCompare(a.quantity)
    }
    if (dec === 'frame_no') {
      return isAsc ? a.frame_no.localeCompare(b.frame_no) : b.frame_no.localeCompare(a.frame_no)
    }
    if (dec === 'frame_paint_qty') {
      return isAsc
        ? a.frame_paint_qty - a.qc_qty.localeCompare(b.frame_no - b.qc_qty)
        : b.frame_paint_qty - b.qc_qty.localeCompare(a.frame_paint_qty - a.qc_qty)
    }

    return 0
  })

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no, item_id]) // Re-fetch data when the plan_no changes

  const fetchBusPlans = async () => {
    try {
      const response = await fetch('/api/Diversitech/Supervisors/Inventory/SeatsInventory', {
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
        setInventory(data)
      } else {
        console.error('Invalid data format:', data)
      }

      setLoading(false)
    } catch (error) {
      console.error(error)
      setInventory([]) // Initialize as an empty array on error
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    const customData = sortedInventory.map(row => ({
      'VECV Number': row.vecv_part_no || '',
      Description: row.item_description || '',
      Quantity: row.quantity || '',
      'Seat Plan Quantity': row.seat_plan_qty || '',
      'Assembly Number': row.item_code || '',
      'In Stock': row.qc_qty || '',
      'Frame Number': row.frame_no || '',
      'Painted frame Number': row.frame_paint_qty - row.qc_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, `PLan_InventoryData_${plan_no}`)
    XLSX.writeFile(wb, `Plan_inventory_${plan_no}.xlsx`)
  }

  return (
    <Card>
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Plan Number: {plan_no}</Typography>
          </div>

          {/* <div>
            <Typography variant='h5'>Item Code: {item_id}</Typography>
          </div> */}

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
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'vecv_part_no'}
                  direction={inc === 'vecv_part_no' ? inc : 'asc'}
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
                  DESCRIPTION
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
                  active={inc === 'seat_plan_qty'}
                  direction={inc === 'seat_plan_qty' ? inc : inc}
                  onClick={() => handleSortRequest('seat_plan_qty')}
                >
                  Required Qty
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Assembly Number
                </TableSortLabel>
              </StyledTableCell>

              <StyledTableCell align='right'> Seat Image</StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'qc_qty'}
                  direction={inc === 'qc_qty' ? inc : inc}
                  onClick={() => handleSortRequest('qc_qty')}
                >
                  SEAT ASSY STOCK
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'frame_no'}
                  direction={inc === 'frame_no' ? inc : 'asc'}
                  onClick={() => handleSortRequest('frame_no')}
                >
                  FRAME Number
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>FRAME Image</StyledTableCell>

              <StyledTableCell align='right'>
                <TableSortLabel
                  active={inc === 'frame_paint_qty'}
                  direction={inc === 'frame_paint_qty' ? inc : inc}
                  onClick={() => handleSortRequest('frame_paint_qty')}
                >
                  PAINTED FRAME STOCK
                </TableSortLabel>
              </StyledTableCell>
            </StyledTableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={10}>
                  <Typography>Loading...</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : Inventory.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={10}>
                  <Typography>No Record Available</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              sortedInventory.map((row, index) =>
                !searchTerm || row.vecv_part_no.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                  <StyledTableRow key={index}>
                    <StyledTableCell component='th' scope='row'>
                      {row.vecv_part_no}
                    </StyledTableCell>
                    <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                    <StyledTableCell align='right'>{row.quantity}</StyledTableCell>
                    <StyledTableCell align='right'>{row.seat_plan_qty}</StyledTableCell>
                    <StyledTableCell align='right'>{row.item_code}</StyledTableCell>
                    {/* {row.seat_img_url ? ( */}
                    <StyledTableCell align='right'>
                      <img
                        alt='Assembly'
                        width='50px'
                        src={JSON.parse(row.seat_img_url).file2 || `/image/logo/unavailable.png`}
                      />
                      {/* <img alt='Assembly' width='50px' src={`${row.seat_img_url}/Front/${row.item_code}.png`} /> */}
                    </StyledTableCell>
                    {/* // ) : (
                    //   <StyledTableCell align='right'>
                    //     <img alt='Assembly' width='50px' src={`/image/logo/unavailable.png`} />
                    //   </StyledTableCell>
                    // )} */}
                    {/* <StyledTableCell align='right'>
                      <img alt='Assembly' width='50px' src={`${row.seat_img_url}${row.item_code}.png`} />
                    </StyledTableCell> */}
                    <StyledTableCell align='right'>{row.qc_qty}</StyledTableCell>
                    <StyledTableCell align='right'>{row.frame_no}</StyledTableCell>
                    {/* {row.frame_img_url ? ( */}
                    <StyledTableCell align='right'>
                      <img
                        alt='Assembly'
                        width='50px'
                        src={JSON.parse(row.frame_img_url).file2 || `/image/logo/unavailable.png`}
                      />
                      {/* <img alt='Frame' width='50px' src={`${row.frame_img_url}/Front/${row.frame_no}.png`} /> */}
                    </StyledTableCell>
                    {/* ) : (
                      <StyledTableCell align='right'>
                        <img alt='Assembly' width='50px' src={`/image/logo/unavailable.png`} />
                      </StyledTableCell>
                    )} */}
                    {/* {console.log(`${row.frame_img_url}${row.frame_no}.png`)} */}
                    <StyledTableCell align='right'>{row.frame_paint_qty - row.qc_qty}</StyledTableCell>
                  </StyledTableRow>
                ) : null
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default MainInventory
