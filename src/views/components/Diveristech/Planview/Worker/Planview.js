import React, { useState } from 'react'

// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

// import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Grid, TableSortLabel, TextField, IconButton, TablePagination, Box, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import { AuthContext } from 'src/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

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

const AllPlansView = () => {
  const { SplanView } = React.useContext(AuthContext)

  // console.log(SplanView + 'Dispatch')

  // console.log(SplanView + 'SplanView_check')
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = React.useState(false)
  const [inc, setInc] = useState('dec')
  const [dec, setDec] = useState('plan_no')
  const busPlans = SplanView

  const options = { day: '2-digit', month: 'long', year: 'numeric' }

  const [page, pagechange] = useState(0)
  const [rowperpage, rowperpagechange] = useState(5)

  const handlechangepage = (event, newpage) => {
    pagechange(newpage)
  }

  const handleRowsPerPage = event => {
    rowperpagechange(event.target.value)
    pagechange(0)
  }

  const handleStartColumn = row => {
    const targetPage = `/components/Diversitech/Workers/PlanView/BusPlan/?plan_no=${encodeURIComponent(
      row.plan_no
    )}&plan_date=${encodeURIComponent(new Date(row.planDate).toLocaleDateString('en-GB', options))}`

    router.push(targetPage)
  }

  const getChipColor = statusDescription => {
    if (statusDescription === 'Complete') {
      return 'success'
    } else if (statusDescription === 'InProcess') {
      return 'warning'
    } else if (statusDescription === 'Open') {
      return 'primary'
    }

    // For any other status, return 'default' color.
    return 'default'
  }

  const handleSortRequest = property => {
    // console.log(property + 'property')
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const reversedSortedBusPlans = busPlans.slice().sort((a, b) => {
    // console.log('reversedSortedBusPlans ' + a.plan_no, b.plan_no)
    const valueA = a.plan_no
    const valueB = b.plan_no
    if (valueA < valueB) {
      return -1
    }
    if (valueA > valueB) {
      return 1
    }

    return 0
  })

  const reversedSortedBusPlans1 = reversedSortedBusPlans
    .slice()
    .reverse()
    .filter(row => row.Status !== 'Cancel' && row.qcStatus !== 'Complete')
    .sort((a, b) => {
      // console.log('reversedSortedBusPlans 1 ' + a.plan_no, b.plan_no)
      const isAsc = inc === 'asc'
      if (dec === 'plan_no') {
        const planNoA = String(a.plan_no)
        const planNoB = String(b.plan_no)

        return isAsc ? planNoA.localeCompare(planNoB) : planNoB.localeCompare(planNoA)
      }
      if (dec === 'paintStatus') {
        const paintStatusA = String(a.paintStatus)
        const paintStatusB = String(b.paintStatus)

        return isAsc ? paintStatusA.localeCompare(paintStatusB) : paintStatusB.localeCompare(paintStatusA)
      }
      if (dec === 'planDate') {
        const frameStatusA = new Date(a.planDate)
        const frameStatusB = new Date(b.planDate)

        return isAsc ? frameStatusA - frameStatusB : frameStatusB - frameStatusA
      }
      if (dec === 'frameStatus') {
        const frameStatusA = String(a.frameStatus)
        const frameStatusB = String(b.frameStatus)

        return isAsc ? frameStatusA.localeCompare(frameStatusB) : frameStatusB.localeCompare(frameStatusA)
      }
      if (dec === 'seatStatus') {
        const seatStatusA = String(a.seatStatus)
        const seatStatusB = String(b.seatStatus)

        return isAsc ? seatStatusA.localeCompare(seatStatusB) : seatStatusB.localeCompare(seatStatusA)
      }
      if (dec === 'qcStatus') {
        const qcStatusA = String(a.qcStatus)
        const qcStatusB = String(b.qcStatus)

        return isAsc ? qcStatusA.localeCompare(qcStatusB) : qcStatusB.localeCompare(qcStatusA)
      }

      return 0
    })

  return (
    <Card style={{ width: '100%' }}>
      <CardContent>
        <Box
          sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography></Typography>
          <Typography variant='h4' style={{ color: 'Black' }}>
            Planning
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

        <TableContainer component={Paper} style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <Table sx={{ minWidth: 450 }} aria-label='simple table'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={inc === 'plan_no'}
                    direction={inc === 'plan_no' ? inc : inc}
                    onClick={() => handleSortRequest('plan_no')}
                  >
                    Plan No.
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  {' '}
                  <TableSortLabel
                    active={inc === 'planDate'}
                    direction={inc === 'planDate' ? inc : inc}
                    onClick={() => handleSortRequest('planDate')}
                  >
                    Date
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={inc === 'frameStatus'}
                    direction={inc === 'frameStatus' ? inc : inc}
                    onClick={() => handleSortRequest('frameStatus')}
                  >
                    Frame
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={inc === 'paintStatus'}
                    direction={inc === 'paintStatus' ? inc : inc}
                    onClick={() => handleSortRequest('paintStatus')}
                  >
                    Paint{' '}
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  {' '}
                  <TableSortLabel
                    active={inc === 'seatStatus'}
                    direction={inc === 'seatStatus' ? inc : inc}
                    onClick={() => handleSortRequest('seatStatus')}
                  >
                    Assembly{' '}
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  {' '}
                  <TableSortLabel
                    active={inc === 'qcStatus'}
                    direction={inc === 'qcStatus' ? inc : inc}
                    onClick={() => handleSortRequest('qcStatus')}
                  >
                    Quality Check{' '}
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='center'></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={7}>
                    <Typography>Loading...</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : reversedSortedBusPlans1.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={7}>
                    <Typography>No data available. Insert Buses</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                reversedSortedBusPlans1
                  .filter(
                    row =>
                      (row.plan_no && row.plan_no.toString().includes(searchTerm)) ||
                      new Date(row.planDate).toLocaleDateString('en-GB').includes(searchTerm) ||
                      row.frameStatus.toLowerCase().includes(searchTerm.toLowerCase())

                    // row.Status !== 'Cancel'
                  )
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align='left'>Plan_{row.plan_no}</StyledTableCell>
                      <StyledTableCell align='left'>
                        {' '}
                        {new Date(row.planDate).toLocaleDateString('en-GB', options)}
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <CustomChip
                          skin='light'
                          size='small'
                          color={getChipColor(row.frameStatus)}
                          label={row.frameStatus}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <CustomChip
                          skin='light'
                          size='small'
                          color={getChipColor(row.paintStatus)}
                          label={row.paintStatus}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <CustomChip
                          skin='light'
                          size='small'
                          color={getChipColor(row.seatStatus)}
                          label={row.seatStatus}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                        />
                      </StyledTableCell>
                      <StyledTableCell align='left'>
                        <CustomChip
                          skin='light'
                          size='small'
                          color={getChipColor(row.qcStatus)}
                          label={row.qcStatus}
                          sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}
                        />
                      </StyledTableCell>

                      <StyledTableCell align='center' style={{ width: '2px' }}>
                        <IconButton onClick={() => handleStartColumn(row)} aria-label='unavailable' color='primary'>
                          <PlayCircleOutlineIcon />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={reversedSortedBusPlans1.length}
          component='div'
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        />
      </CardContent>
    </Card>
  )
}

export default AllPlansView
