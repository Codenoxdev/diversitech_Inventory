import React, { useContext, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Link from 'next/link'
import Icon from 'src/@core/components/icon'
import * as XLSX from 'xlsx'
import { Button, Card, Grid, Typography, TextField, IconButton, Box } from '@mui/material'
import { AuthContext } from 'src/context/AuthContext'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

const DWBusPlanView = () => {
  const Router = useRouter()
  const [busPlans, setBusPlans] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [dec, setDec] = useState('item_code') // Default sorting column
  const [inc, setInc] = useState('asc') // Default sorting order
  const router = useRouter()
  const { dispatch_no, item_code, dispatch_date } = router.query
  let plan_no = dispatch_no

  // console.log(plan_no, item_code, busPlans)

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
      return isAsc ? a.item_code.localeCompare(b.item_code) : b.item_code.localeCompare(a.item_code)
    }
    if (dec === 'item_description') {
      return isAsc
        ? a.item_description.localeCompare(b.item_description)
        : b.item_description.localeCompare(a.item_description)
    }
    if (dec === 'engine_type') {
      return isAsc ? a.engine_type.localeCompare(b.engine_type) : b.engine_type.localeCompare(a.engine_type)
    }
    if (dec === 'variant') {
      return isAsc ? a.variant.localeCompare(b.variant) : b.variant.localeCompare(a.variant)
    }
    if (dec === 'model') {
      return isAsc ? a.model.localeCompare(b.model) : b.model.localeCompare(a.model)
    }
    if (dec === 'bs_type') {
      return isAsc ? a.bs_type.localeCompare(b.bs_type) : b.bs_type.localeCompare(a.bs_type)
    }
    if (dec === 'plan_quantity') {
      return isAsc ? a.plan_quantity.localeCompare(b.plan_quantity) : b.plan_quantity.localeCompare(a.plan_quantity)
    }

    return 0
  })

  const handleStartColumn = row => {
    // console.log('Selected Plan:', row)

    const targetPage = `/components/Diversitech/Workers/Dispatch/Seats/?seats_no=${
      row.item_id
    }&dispatch_no=${dispatch_no}&dispatch_date=${encodeURIComponent(dispatch_date)}`

    Router.push(targetPage)
  }
  React.useEffect(() => {
    try {
      const response = fetch('/api/Diversitech/Supervisors/Dispatch/Busview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data from the API')
          }

          return response.json()
        })
        .then(data => {
          // console.log('API Response:', data)
          // console.log(data + '=========data')
          setBusPlans(data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
      setBusPlans([])
    }

    // }
  }, [plan_no])

  const exportToExcel = () => {
    const customData = busPlans.map(row => ({
      'Fert code': row.item_code || '',
      Engine: row.engine_type || '',
      variant: row.variant || '',
      model: row.model || '',
      'Bs type': row.bs_type || '',
      Description: row.item_description || '',
      Quantity: row.request_quantity || ''
    }))

    const ws = XLSX.utils.json_to_sheet(customData)

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, `Bus_worker_${plan_no}`)
    XLSX.writeFile(wb, `Bus_worker_${plan_no}.xlsx`)
  }

  return (
    <Card>
      {plan_no && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Dispatch Number: {dispatch_no}</Typography>
          </div>

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
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Fert Code
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'engine_type'}
                  direction={inc === 'engine_type' ? inc : inc}
                  onClick={() => handleSortRequest('engine_type')}
                >
                  Engine Type
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'variant'}
                  direction={inc === 'variant' ? inc : inc}
                  onClick={() => handleSortRequest('variant')}
                >
                  Variant
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'model'}
                  direction={inc === 'model' ? inc : inc}
                  onClick={() => handleSortRequest('model')}
                >
                  Model
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'bs_type'}
                  direction={inc === 'bs_type' ? inc : inc}
                  onClick={() => handleSortRequest('bs_type')}
                >
                  BS Type
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
                  active={inc === 'request_quantity'}
                  direction={inc === 'request_quantity' ? inc : inc}
                  onClick={() => handleSortRequest('request_quantity')}
                >
                  Qty
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='center'></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <StyledTableRow>
                <StyledTableCell align='center' colSpan={8}>
                  <Typography>Loading...</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : busPlans.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell colSpan={8} align='center'>
                  <Typography>No Bus Available</Typography>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              sortedBusPlans
                .filter(row => !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((row, index) =>
                  !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()) ? (
                    <StyledTableRow key={index}>
                      <StyledTableCell component='th' scope='row'>
                        {row.item_code}
                      </StyledTableCell>
                      <StyledTableCell align='left'>{row.engine_type}</StyledTableCell>
                      <StyledTableCell align='left'>{row.variant}</StyledTableCell>
                      <StyledTableCell align='left'>{row.model}</StyledTableCell>
                      <StyledTableCell align='left'>{row.bs_type}</StyledTableCell>
                      <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                      <StyledTableCell align='right'>{row.request_quantity}</StyledTableCell>
                      <StyledTableCell align='right'>
                        <IconButton onClick={() => handleStartColumn(row)} aria-label='unavailable' color='primary'>
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
    </Card>
  )
}

export default DWBusPlanView
