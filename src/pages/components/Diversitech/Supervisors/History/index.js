import React, { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import { styled } from '@mui/material/styles'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'
import Link from 'next/link'
import {
  Grid,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  Box
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SearchIcon from '@mui/icons-material/Search'
import TableSortLabel from '@mui/material/TableSortLabel'
import MenuItem from '@mui/material/MenuItem'
import CustomChip from 'src/@core/components/mui/chip'

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

const Historypage = () => {
  const [loading, setLoading] = useState(true)
  const [Dispatchseats, setDispatchseats] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [Type, setType] = useState('')
  const [status, setStatus] = useState('') // Add status state

  const Router = useRouter()
  const { dispatch_no, seats_no, dispatch_date } = Router.query
  let plan_no = dispatch_no

  useEffect(() => {
    // Fetch data from the API
    fetch('/api/Diversitech/Supervisors/History', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ plan_no, seats_no })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the API')
        }

        return response.json()
      })
      .then(data => {
        setDispatchseats(data)
        setLoading(false)
      })
      .catch(error => {
        console.error(error)
        setDispatchseats([])
      })
  }, [plan_no])

  const [fromDate, setFromDate] = useState('')

  const [toDate, setToDate] = useState('')

  // Filter by search term

  const searchTermLower = searchTerm.toLowerCase()
  const searchFiltered = Dispatchseats.filter(row => row.transaction_no.toLowerCase().includes(searchTermLower))

  // Filter by type
  const typeFiltered =
    Type === ''
      ? searchFiltered
      : searchFiltered.filter(row => {
          const productType = row.product_type.toLowerCase()

          return (Type === 'sub' && productType.includes('seat')) || (Type === 'add' && productType.includes('frame'))
        })

  const statusFiltered =
    status === ''
      ? typeFiltered
      : typeFiltered.filter(row => {
          const productionStatus = (row.Production || '').toLowerCase()
          const dispatchStatus = (row.Dispatch || '').toLowerCase()

          // Check if the row matches either "Production" or "Dispatched"
          const isProductionMatch = status.toLowerCase() === 'production' && productionStatus === 'production'
          const isDispatchedMatch = status.toLowerCase() === 'dispatched' && dispatchStatus === 'dispatched'

          // Include the row if it matches either status
          return (
            isProductionMatch ||
            isDispatchedMatch ||
            productionStatus.includes(status.toLowerCase()) ||
            dispatchStatus.includes(status.toLowerCase())
          )
        })

  // Filter by date range

  const fromDateTimestamp = fromDate ? new Date(fromDate).getTime() : 0
  const toDateTimestamp = toDate ? new Date(toDate).getTime() : Number.MAX_SAFE_INTEGER

  const dateFiltered = statusFiltered.filter(row => {
    const transactionDateTimestamp = new Date(row.transaction_date).getTime()

    return transactionDateTimestamp >= fromDateTimestamp && transactionDateTimestamp <= toDateTimestamp
  })

  // The final filtered results

  const filteredDispatchseats = dateFiltered

  const exportToExcel = () => {
    // const filteredBusPlans = filteredDispatchseats.filter(row => row.product_type !== 'BUS')

    const customData = filteredDispatchseats.map(row => ({
      Id: row.transaction_no || '',
      Date: row.transaction_date || '',
      Status: row.Dispatch || row.Production || '',
      'Part Number': row.item_code || '',
      Type: row.product_type || '',
      Quantity: row.trans_qty || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `History`)
    XLSX.writeFile(wb, `History.xlsx`)
  }

  const getChipColor = statusDescription => {
    if (statusDescription.Production === 'Production') {
      return 'success'
    } else if (statusDescription.Dispatch === 'Dispatched') {
      return 'error'
    }

    // For any other status, return 'default' color.
    return 'default'
  }

  return (
    <>
      <ToastContainer />
      <Grid container spacing={6}>
        <Grid item sm={2} xs={6}>
          <TextField
            style={{ width: '100%' }}
            type='date'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </Grid>

        <Grid item sm={2} xs={6}>
          <TextField style={{ width: '100%' }} type='date' value={toDate} onChange={e => setToDate(e.target.value)} />
        </Grid>
        <Grid item sm={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel id='plan-select'>Select Type</InputLabel>
            <Select
              fullWidth
              value={Type}
              label='Select Type'
              labelId='plan-select'
              onChange={e => setType(e.target.value)}
            >
              <MenuItem value=''>Select Type</MenuItem>
              <MenuItem value='sub'>SEAT</MenuItem>
              <MenuItem value='add'>FRAME</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item sm={4} xs={12}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Select Status</InputLabel>
            <Select
              fullWidth
              value={status}
              label='Select Status'
              labelId='status-select'
              onChange={e => setStatus(e.target.value)}
            >
              <MenuItem value=''>Select Status</MenuItem>
              <MenuItem value='Dispatched'>Dispatched</MenuItem>
              <MenuItem value='Production'>Production</MenuItem>
              {/* <MenuItem value='SEAT'>SEAT</MenuItem> */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box
        sx={{
          p: 5,
          pb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
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

        <Typography style={{ fontWeight: 'bold' }} variant='h5' sx={{ mb: 4.5, fontFamily: 'Aptos Serif' }}>
          Stock Ledger
        </Typography>

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
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell align='left'>Plan No</StyledTableCell>
              <StyledTableCell align='left'>Date</StyledTableCell>
              <StyledTableCell align='left'>Status</StyledTableCell>
              <StyledTableCell align='left'>Part code</StyledTableCell>
              <StyledTableCell align='left'>Type</StyledTableCell>
              <StyledTableCell align='left'>Quantity</StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={4}>
                  <Typography>Loading...</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : filteredDispatchseats.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={9}>
                  <Typography>No Record is Here</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : searchTerm || Type || status || fromDate || toDate ? (
              filteredDispatchseats.map((row, index) => {
                const uniqueKey = `row-${index}`
                if (!searchTerm || row.transaction_no.includes(searchTerm)) {
                  return (
                    <StyledTableRow key={uniqueKey}>
                      <StyledTableCell component='th' scope='row' align='left'>
                        {row.transaction_no}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        {new Date(row.transaction_date).toLocaleDateString('en-GB')}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <CustomChip
                          skin='light'
                          size='small'
                          color={getChipColor(row)}
                          label={row.Dispatch || row.Production}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}

                          // disabled={isChipDisabled(row.status_description)}
                        />
                        {/* {row.Dispatch || row.Production} */}
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                      <StyledTableCell align='left'>{row.product_type}</StyledTableCell>
                      <StyledTableCell align='left'>{row.trans_qty}</StyledTableCell>
                    </StyledTableRow>
                  )
                }
              })
            ) : null}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

Historypage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Historypage
