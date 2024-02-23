import React, { useState } from 'react'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import {
  Grid,
  TableSortLabel,
  TextField,
  Button,
  Dialog,
  Box,
  DialogContent,
  IconButton,
  TablePagination
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import { AuthContext } from 'src/context/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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

const SupervisorsAllPlansView = () => {
  const { SplanView, setSplanView } = React.useContext(AuthContext)

  // console.log(SplanView)
  const [searchTerm, setSearchTerm] = useState('')
  const [inc, setInc] = useState('asc')
  const [dec, setDec] = useState('plan_no')
  const busPlans = SplanView
  const router = useRouter()

  const [page, pagechange] = useState(0)
  const [rowperpage, rowperpagechange] = useState(5)

  const handlechangepage = (event, newpage) => {
    pagechange(newpage)
  }

  const handleRowsPerPage = event => {
    rowperpagechange(event.target.value)
    pagechange(0)
  }

  const [loading, setLoading] = React.useState(false)

  const handleEditRoute = row => {
    const targetPage = `/components/Diversitech/Supervisors/Edit/?plan_no=${encodeURIComponent(
      row.plan_no
    )}&plan_date=${encodeURIComponent(new Date(row.plan_date).toLocaleDateString('en-GB'))}`

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
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const handleDeleteClick = (index, planNo) => {
    setSelectedIndex(planNo)
    setOpen(true)
  }

  const handleDiscardRow = async (index, plan_no) => {
    try {
      const response = await fetch(`/api/Diversitech/Supervisors/Production/PlanView/?plan_no=${selectedIndex}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to discard row')
      }
      const updatedBusPlans = [...busPlans]
      updatedBusPlans.splice(index, 1)
      setSplanView(updatedBusPlans)

      toast.success('Row discarded successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
      setOpen(false)
    } catch (error) {
      console.error('Error discarding row:', error)
      toast.error('Error discarding row', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
    }
  }

  const options = { day: '2-digit', month: 'long', year: 'numeric' }

  const handlePlanning = row => {
    const targetPage = `/components/Diversitech/Supervisors/Inventory/BusInventory?plan_no=${encodeURIComponent(
      row.plan_no
    )}&plan_date=${encodeURIComponent(new Date(row.planDate).toLocaleDateString('en-GB', options))}`

    router.push(targetPage)
  }

  const sortedBusPlans = busPlans.slice().sort((a, b, c) => {
    const isAsc = inc === 'asc'
    if (dec === 'plan_no') {
      const planNoA = String(a.plan_no)
      const planNoB = String(b.plan_no)

      return isAsc ? planNoA.localeCompare(planNoB) : planNoB.localeCompare(planNoA)
    }

    if (dec === 'planDate') {
      const dateA = new Date(a.planDate)
      const dateB = new Date(b.planDate)

      return isAsc ? dateA - dateB : dateB - dateA
    }

    if (dec === 'frameStatus') {
      const frameStatusA = String(a.frameStatus)
      const frameStatusB = String(b.frameStatus)

      return isAsc ? frameStatusA.localeCompare(frameStatusB) : frameStatusB.localeCompare(frameStatusA)
    }
    if (dec === 'seatStatus') {
      const frameStatusA = String(a.seatStatus)
      const frameStatusB = String(b.seatStatus)

      // const frameStatusc = String(c.seatStatus)

      return isAsc ? frameStatusA.localeCompare(frameStatusB) : frameStatusB.localeCompare(frameStatusA)
    }
    if (dec === 'paintStatus') {
      const paintStatusA = String(a.paintStatus)
      const paintStatusB = String(b.paintStatus)

      // const frameStatusc = String(c.seatStatus)

      return isAsc ? paintStatusA.localeCompare(paintStatusB) : paintStatusB.localeCompare(paintStatusA)
    }
    if (dec === 'qcStatus') {
      const qcStatusA = String(a.qcStatus)
      const qcStatusB = String(b.qcStatus)

      // const frameStatusc = String(c.seatStatus)

      return isAsc ? qcStatusA.localeCompare(qcStatusB) : qcStatusB.localeCompare(qcStatusA)
    }

    return 0
  })
  const reversedSortedBusPlans = sortedBusPlans.slice().reverse()

  return (
    <Card style={{ width: '100%' }}>
      <ToastContainer />
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'space-between',
            justifyContent: 'space-between'
          }}
        >
          <Typography></Typography>
          <Typography variant='h4' style={{ color: 'Black' }}>
            Planning
          </Typography>
          <Link href='/components/Diversitech/Supervisors/Planning/Production'>
            <Button size='medium' variant='contained'>
              New Plan
            </Button>
          </Link>
        </Box>
        <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'right', justifyContent: 'right' }}>
          <TextField
            style={{ width: '150px' }}
            label='Search'
            variant='standard'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon /> }}
          />
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
                  <TableSortLabel
                    active={inc === 'seatStatus'}
                    direction={inc === 'seatStatus' ? inc : inc}
                    onClick={() => handleSortRequest('seatStatus')}
                  >
                    Assembly{' '}
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={inc === 'qcStatus'}
                    direction={inc === 'qcStatus' ? inc : inc}
                    onClick={() => handleSortRequest('qcStatus')}
                  >
                    Quality Check{' '}
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'></StyledTableCell>
                <StyledTableCell align='left'></StyledTableCell>
                <StyledTableCell align='left'></StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={4}>
                    <Typography>Loading...</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : // <TableRow>
              //   <TableCell colSpan={4}>Loading...</TableCell>
              // </TableRow>
              reversedSortedBusPlans.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={9}>
                    <Typography>No Record is Here</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                reversedSortedBusPlans
                  .filter(
                    row =>
                      (row.plan_no && row.plan_no.toString().includes(searchTerm)) ||
                      new Date(row.planDate).toLocaleDateString('en-GB').includes(searchTerm) ||
                      row.frameStatus.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .slice(page * rowperpage, page * rowperpage + rowperpage)
                  .map((row, index) => (
                    <StyledTableRow key={index}>
                      {/* {row.frameStatus === 'Open' && ( */}
                      <>
                        <StyledTableCell align='left'>Plan_{row.plan_no}</StyledTableCell>
                        <StyledTableCell align='left'>
                          {/* {formatDate(row.planDate)} */}
                          {new Date(row.planDate).toLocaleDateString('en-GB', options)}
                        </StyledTableCell>
                        <StyledTableCell align='left'>
                          <CustomChip
                            skin='light'
                            size='small'
                            color={getChipColor(row.frameStatus)}
                            label={row.frameStatus}
                            sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}

                            // disabled={isChipDisabled(row.status_description)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align='left'>
                          <CustomChip
                            skin='light'
                            size='small'
                            color={getChipColor(row.paintStatus)}
                            label={row.paintStatus}
                            sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}

                            // disabled={isChipDisabled(row.status_description)}
                          />
                        </StyledTableCell>
                        <StyledTableCell align='left'>
                          <CustomChip
                            skin='light'
                            size='small'
                            color={getChipColor(row.seatStatus)}
                            label={row.seatStatus}
                            sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500 }}

                            // disabled={isChipDisabled(row.status_description)}
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

                        <StyledTableCell align='left' style={{ width: '2px' }}>
                          <IconButton onClick={() => handlePlanning(row)} aria-label='Edit' color='primary'>
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </StyledTableCell>

                        {row.frameStatus === 'InProcess' ||
                        row.qcStatus === 'InProcess' ||
                        row.frameStatus === 'Complete' ||
                        row.qcStatus === 'Complete' ? (
                          <>
                            <StyledTableCell align='left' style={{ width: '2px' }}>
                              <IconButton aria-label='Edit' color='secondary'>
                                <EditIcon />
                              </IconButton>
                            </StyledTableCell>

                            <StyledTableCell align='left' style={{ width: '2px' }}>
                              <IconButton aria-label='unavailable' color='secondary'>
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </StyledTableCell>
                          </>
                        ) : row.Status === 'Cancel' ? (
                          <>
                            <StyledTableCell align='left' style={{ width: '2px' }}></StyledTableCell>
                            <StyledTableCell align='left' style={{ width: '2px' }}></StyledTableCell>
                          </>
                        ) : (
                          <>
                            <StyledTableCell align='left' style={{ width: '2px' }}>
                              <IconButton onClick={() => handleEditRoute(row)} aria-label='Edit' color='primary'>
                                <EditIcon />
                              </IconButton>
                            </StyledTableCell>
                            <StyledTableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => handleDeleteClick(index, row.plan_no)}
                                aria-label='Edit'
                                color='primary'
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </StyledTableCell>
                          </>
                        )}
                      </>
                      {/* )} */}
                    </StyledTableRow>
                  ))
              )}

              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                  <Typography>Are you sure you want to Discard Plan?</Typography>
                  <Grid container justifyContent='center' alignItems='center'>
                    <Grid padding='20px'>
                      <Button size='medium' onClick={handleDiscardRow} variant='contained'>
                        Yes
                      </Button>
                    </Grid>
                    <Grid padding='10px'>
                      <Button size='medium' onClick={() => setOpen(false)} type='submit' variant='contained'>
                        No
                      </Button>
                    </Grid>
                  </Grid>
                </DialogContent>
              </Dialog>
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          rowsPerPage={rowperpage}
          page={page}
          count={SplanView.length}
          component='div'
          onPageChange={handlechangepage}
          onRowsPerPageChange={handleRowsPerPage}
        ></TablePagination>
      </CardContent>
    </Card>
  )
}

export default SupervisorsAllPlansView
