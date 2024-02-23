import React, { useState } from 'react'

// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

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
import { Grid, TableSortLabel, TextField, IconButton, Box, TablePagination } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'

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

const DisPlansView = () => {
  const { DplanView, setDplanView } = React.useContext(AuthContext)

  // console.log(DplanView)
  const Router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [inc, setInc] = useState('asc')
  const [dec, setDec] = useState('plan_no')

  // const busPlans = DplanView
  const options = { day: '2-digit', month: 'long', year: 'numeric' }

  const handleStartColumn = row => {
    // Do something with the selected plan data, for example, log it
    // console.log('Selected Plan:', row)

    const targetPage = `/components/Diversitech/Workers/Dispatch/Busplan/?dispatch_no=${encodeURIComponent(
      row.plan_no
    )}&dispatch_date=${encodeURIComponent(new Date(row.planDate).toLocaleDateString('en-GB', options))}`

    Router.push(targetPage)
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

  const [page, pagechange] = useState(0)
  const [rowperpage, rowperpagechange] = useState(5)

  const handlechangepage = (event, newpage) => {
    pagechange(newpage)
  }

  const handleRowsPerPage = event => {
    rowperpagechange(event.target.value)
    pagechange(0)
  }

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const sortedBusPlans = DplanView.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'plan_no') {
      const planNoA = String(a.plan_no)
      const planNoB = String(b.plan_no)

      return isAsc ? planNoA.localeCompare(planNoB) : planNoB.localeCompare(planNoA)
    }
    if (dec === 'frameStatus') {
      const frameStatusA = String(a.frameStatus)
      const frameStatusB = String(b.frameStatus)

      return isAsc ? frameStatusA.localeCompare(frameStatusB) : frameStatusB.localeCompare(frameStatusA)
    }
    if (dec === 'planDate') {
      const frameStatusA = new Date(a.planDate)
      const frameStatusB = new Date(b.planDate)

      return isAsc ? frameStatusA - frameStatusB : frameStatusB - frameStatusA
    }

    return 0
  })

  const reversedSortedBusPlans = sortedBusPlans
    .slice()
    .reverse()
    .filter(row => row.Status !== 'Cancel' && row.frameStatus !== 'Complete')

  return (
    <Card style={{ width: '100%' }}>
      <CardContent>
        <Box
          sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography></Typography>
          <Typography variant='h4' style={{ color: 'Black' }}>
            Dispatch
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
                    Dispatch No.
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
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
                    Status
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
              ) : reversedSortedBusPlans.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={7}>
                    <Typography>No Plan available</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                reversedSortedBusPlans
                  .filter(
                    row =>
                      (row.plan_no && row.plan_no.toString().includes(searchTerm)) ||
                      new Date(row.planDate).toLocaleDateString('en-GB', options).includes(searchTerm) ||
                      row.frameStatus.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((row, index) => (
                    <StyledTableRow key={index}>
                      {row.Status === 'Cancel'
                        ? null
                        : (row.frameStatus === 'Open' || row.frameStatus === 'InProcess') && (
                            <>
                              <StyledTableCell align='left'>Dispatch_{row.plan_no}</StyledTableCell>
                              <StyledTableCell align='left'>
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
                              <StyledTableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => handleStartColumn(row)}
                                  aria-label='unavailable'
                                  color='primary'
                                >
                                  <PlayCircleOutlineIcon />
                                </IconButton>
                              </StyledTableCell>
                            </>
                          )}
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
          count={reversedSortedBusPlans.length}
          component='div'
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </CardContent>
    </Card>
  )
}

export default DisPlansView
