import React, { useContext, useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { TableContainer } from '@mui/material/'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'
import { Card, Typography, Grid, TextField, Button, Link, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'
import authConfig from 'src/configs/auth'

const MainInventoryDispatch = () => {
  const router = useRouter()
  const [Inventory, setInventory] = useState([])

  // console.log('Inventory' + Inventory)
  const { dispatch_no, seats_no, dispatch_date } = router.query

  // console.log(plan_no, seats_no, plan_date)
  let plan_no = dispatch_no

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
      return isAsc ? a.vecv_part_no.localeCompare(b.vecv_part_no) : b.vecv_part_no.localeCompare(a.vecv_part_no)
    }
    if (dec === 'item_description') {
      return isAsc
        ? a.item_description.localeCompare(b.item_description)
        : b.item_description.localeCompare(a.item_description)
    }

    return 0
  })

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no, seats_no]) // Re-fetch data when the plan_no changes

  const fetchBusPlans = async () => {
    try {
      const response = await fetch(authConfig.DispatchSeatInventory, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no, seats_no })
      })
      const data = await response.json()
      if (Array.isArray(data)) {
        setInventory(data)
      } else {
        console.error('Invalid data format:', data)
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setInventory([])
      setLoading(false)
    }
  }

  const exportToExcel = () => {
    const customData = sortedInventory.map(row => ({
      'VECV Number': row.vecv_part_no || '',
      Description: row.item_description || '',
      Quantity: row.quantity || '',
      'Assembly Number': row.item_code || '',
      'Request Quantity': row.request_quantity || '',
      'Dispatch Quantity': row.dispatch_quantity || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Dispatch_InventoryData')
    XLSX.writeFile(wb, 'Dispatch_inventory_data.xlsx')
  }

  return (
    <>
      <Card>
        {plan_no && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant='h5'>Dispatch Number: {plan_no}</Typography>
            </div>

            {/* <div>
            <Typography variant='h5'>Item Code: {item_id}</Typography>
          </div> */}

            <div>
              <Typography variant='h6'>Date: {dispatch_date}</Typography>
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
                    direction={inc === 'vecv_part_no' ? inc : inc}
                    onClick={() => handleSortRequest('vecv_part_no')}
                  >
                    VECV Number
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={inc === 'vecv_part_no'}
                    direction={inc === 'vecv_part_no' ? inc : inc}
                    onClick={() => handleSortRequest('vecv_part_no')}
                  >
                    DESCRIPTION
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='right'>
                  <TableSortLabel
                    active={inc === 'vecv_part_no'}
                    direction={inc === 'vecv_part_no' ? inc : inc}
                    onClick={() => handleSortRequest('vecv_part_no')}
                  >
                    Qty Per Bus
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='right'> Assembly Number</StyledTableCell>
                <StyledTableCell align='right'> Seat Image</StyledTableCell>
                {/* <StyledTableCell align='right'>SEAT ASSY STOCK</StyledTableCell> */}
                <StyledTableCell align='right'>Required Qty</StyledTableCell>
                <StyledTableCell align='right'>Dispatched</StyledTableCell>
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
              //   <StyledTableCell colSpan={4}>No data available</StyledTableCell>
              // </StyledTableRow>
              Inventory.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={6}>
                    <Typography>No Record available</Typography>
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
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                      <StyledTableCell align='right'>
                        <img alt='Assembly' width='50px' src={JSON.parse(row.image_url).file} />
                      </StyledTableCell>
                      <StyledTableCell align='right'>{row.request_quantity}</StyledTableCell>
                      <StyledTableCell align='right'>{row.dispatch_quantity}</StyledTableCell>

                      {/* <StyledTableCell align='right'>{row.frame_paint_qty}</StyledTableCell> */}
                    </StyledTableRow>
                  ) : null
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Grid item style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Link
          href={`/components/Diversitech/Supervisors/Inventory/DispatchInventory/?dispatch_no=${plan_no}&dispatch_date=${dispatch_date}`}
        >
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid>
    </>
  )
}

MainInventoryDispatch.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default MainInventoryDispatch
