import React, { useState } from 'react'

// import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'

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
import { Grid, TableSortLabel, TextField, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
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

const AdminDispatchPlan = () => {
  const { DplanView, setDplanView } = React.useContext(AuthContext)

  // console.log(DplanView)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [inc, setInc] = useState('asc')
  const [dec, setDec] = useState('dispatch_no')
  const [loading, setLoading] = useState(false)

  const busPlans = DplanView

  // const handleDeleteColumn = index => {
  //   const updatedColumns = DplanView.filter((column, columnIndex) => columnIndex !== index)
  //   setDplanView(updatedColumns)
  // }

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

  // console.log(selectedIndex)

  const handleDeleteClick = (index, planNo) => {
    setSelectedIndex(planNo)
    setOpen(true)
  }

  const handleDiscardRow = async index => {
    try {
      // const rowToDelete = DplanView[index]
      // console.log('Row to delete:', rowToDelete)

      const response = await fetch(`/api/Diversitech/Supervisors/Dispatch/PlanView/?plan_no=${selectedIndex}`, {
        method: 'DELETE'
      })

      // console.log('DELETE Response:', response)

      if (!response.ok) {
        throw new Error('Failed to discard row')
      }

      const updatedBusPlans = [...busPlans]
      updatedBusPlans.splice(index, 1)
      setDplanView(updatedBusPlans)

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

  const handleEditRoute = row => {
    const targetPage = `/components/Diversitech/Supervisors/Edit/Dispatch?plan_no=${encodeURIComponent(
      row.plan_no
    )}&plan_date=${encodeURIComponent(new Date(row.dispatch_date).toLocaleDateString('en-GB'))}`

    router.push(targetPage)
  }

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const sortedBusPlans = busPlans.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'dispatch_no') {
      const planNoA = String(a.plan_no)
      const planNoB = String(b.plan_no)

      return isAsc ? planNoA.localeCompare(planNoB) : planNoB.localeCompare(planNoA)
    }

    // if (dec === 'plan_date') {
    //   return isAsc ? a.plan_date.localeCompare(b.plan_date) : b.plan_date.localeCompare(a.plan_date)
    // }
    // if (dec === 'status_description') {
    //   return isAsc
    //     ? a.status_description.localeCompare(b.status_description)
    //     : b.status_description.localeCompare(a.status_description)
    // }

    return 0
  })
  const reversedSortedBusPlans = sortedBusPlans.slice().reverse()

  // const reverseSortedBusPlans = sortedBusPlans.reverse()
  // console.log(reverseSortedBusPlans)

  return (
    <>
      <Card style={{ width: '100%' }}>
        <CardContent>
          <Grid container alignItems='center' justifyContent='center'>
            {/* <Grid item xs={12} md={8.5}></Grid> */}
            <Grid
              item
              xs={12}
              md={8.5}
              alignItems='center'
              justifyContent='center'
              style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}
            >
              <Typography variant='h4' style={{ color: 'Black' }}>
                Dispatch Required
              </Typography>
            </Grid>
            <Grid>
              <TextField
                style={{ width: '150px' }}
                label='Search'
                variant='standard'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{ endAdornment: <SearchIcon /> }}
              />
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 450 }} aria-label='simple table'>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell align='left'>
                    <TableSortLabel
                      active={inc === 'dispatch_no'}
                      direction={inc === 'dispatch_no' ? inc : 'asc'}
                      onClick={() => handleSortRequest('dispatch_no')}
                    >
                      Dispatch No
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    <TableSortLabel
                      active={inc === 'dispatch_date'}
                      direction={inc === 'dispatch_date' ? inc : 'asc'}
                      onClick={() => handleSortRequest('dispatch_date')}
                    >
                      Date
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    <TableSortLabel
                      active={inc === 'status_description'}
                      direction={inc === 'status_description' ? inc : 'asc'}
                      onClick={() => handleSortRequest('status_description')}
                    >
                      Status
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align='center'></StyledTableCell>
                  <StyledTableCell align='center'></StyledTableCell>
                  <StyledTableCell align='center'></StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <StyledTableRow>
                    <StyledTableCell align='left' colSpan={7}>
                      <Typography>No Plan available</Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                ) : DplanView.length === 0 ? (
                  <StyledTableRow>
                    <StyledTableCell colSpan={7}>Loading...</StyledTableCell>
                  </StyledTableRow>
                ) : (
                  reversedSortedBusPlans
                    .filter(
                      row =>
                        (row.plan_no && row.plan_no.toString().includes(searchTerm)) ||
                        new Date(row.planDate).toLocaleDateString('en-GB').includes(searchTerm) ||
                        row.frameStatus.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((row, index) => (
                      <StyledTableRow key={index}>
                        {row.frameStatus === 'Open' || row.frameStatus === 'Complete' ? (
                          <>
                            <StyledTableCell align='left'>{row.plan_no}</StyledTableCell>
                            <StyledTableCell align='left'>
                              {new Date(row.planDate).toLocaleDateString('en-GB')}
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
                            <StyledTableCell align='left' style={{ width: '2px' }}>
                              <IconButton aria-label='cancel' color='primary'>
                                <RemoveRedEyeIcon />
                              </IconButton>
                            </StyledTableCell>
                            {row.frameStatus === 'Complete' ? (
                              <>
                                <StyledTableCell align='left' style={{ width: '2px' }}>
                                  <Typography>pdf</Typography>
                                </StyledTableCell>
                              </>
                            ) : (
                              <>
                                <StyledTableCell align='left' style={{ width: '2px' }}>
                                  <IconButton aria-label='Edit' color='primary' onClick={() => handleEditRoute(row)}>
                                    <EditIcon />
                                  </IconButton>
                                </StyledTableCell>

                                <StyledTableCell align='left' style={{ width: '2px' }}>
                                  <IconButton
                                    onClick={() => handleDeleteClick(index, row.plan_no)}
                                    aria-label='unavailable'
                                    color='primary'
                                  >
                                    <RemoveCircleOutlineIcon />
                                  </IconButton>
                                </StyledTableCell>
                              </>
                            )}
                          </>
                        ) : null}
                      </StyledTableRow>
                    ))
                )}
                <Dialog open={open} onClose={() => setOpen(false)}>
                  {/* <DialogTitle>Confirmation</DialogTitle> */}
                  <DialogContent>
                    <Typography>Are you sure you want to Discard Plan?</Typography>
                    <Grid container justifyContent='center' alignItems='center'>
                      <Grid padding='20px'>
                        <Button size='medium' onClick={handleDiscardRow} variant='contained'>
                          Yes
                        </Button>
                      </Grid>
                      <Grid padding='10px'>
                        <Button
                          size='medium'
                          onClick={() => setOpen(false)}
                          type='submit'
                          variant='contained'
                          title='Submit'
                        >
                          No
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </Dialog>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href='/components/Diversitech/Admin/Inventory/InventoryPage/'>
          <Button size='medium' variant='contained' title='Submit'>
            Back
          </Button>
        </Link>
      </Grid>
    </>
  )
}

AdminDispatchPlan.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default AdminDispatchPlan
