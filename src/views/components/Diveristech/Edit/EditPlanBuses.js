import React, { useState, useEffect, useContext } from 'react'
import {
  Paper,
  Card,
  Typography,
  TableContainer,
  TableBody,
  TableHead,
  TableRow,
  Table,
  TextField,
  Button,
  Grid,
  Autocomplete,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'
import { useRouter } from 'next/router'
import { AuthContext } from 'src/context/AuthContext'
import { styled } from '@mui/material/styles'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const EditPlanBuses = () => {
  const { rows, setRows, Masterdata, busFilteredRows } = useContext(AuthContext)
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [add, setAdd] = useState(false)
  const [selectedFertCode, setSelectedFertCode] = useState(null)

  // console.log(busPlans)
  const [quantity, setQuantity] = useState(0)
  const router = useRouter()
  const { plan_no, plan_date } = router.query

  // console.log(selectedFertCode + 'selectedFertCode')
  const [selectedIndex, setSelectedIndex] = useState(null)

  // console.log(selectedIndex)
  const [discard, setDiscard] = useState(false)
  const [inc, setInc] = useState('asc')
  const [open, setOpen] = useState(false)

  const fetchBusPlans = async () => {
    try {
      // If plan_no exists, fetch data with the plan_no query parameter
      const response = plan_no
        ? await fetch(`/api/Diversitech/Workers/Buses/BusView/?plan_no=${encodeURIComponent(plan_no)}`)
        : await fetch('/api/Diversitech/Workers/Buses/BusView')

      if (!response.ok) {
        throw new Error('Failed to fetch data from the API')
      }
      const data = await response.json()

      // console.log('API Response:', data) // Add this line to check the data received from the API
      setBusPlans(data)
      setLoading(false)
    } catch (error) {
      console.error(error)
      setBusPlans([])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusPlans()
  }, [plan_no]) // Re-fetch data when the plan_no changes

  const handleQtyChange = (event, index) => {
    const updatedPlans = [...busPlans]
    const newValue = event.target.value

    if (newValue > 0) {
      updatedPlans[index].edited_quantity = newValue
      setBusPlans(updatedPlans)
    }

    // updatedPlans[index].edited_quantity = event.target.value
    // setBusPlans(updatedPlans)
  }

  const handleAddRow = () => {
    // console.log(selectedFertCode.item_code)
    // if (selectedFertCode === null) {
    //   toast.warn('Select Buses', {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1500
    //   })

    //   return
    // }

    if (quantity <= 0) {
      // toast.error('less or equalto Zero', {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1500
      // })

      return
    }

    const isItemExist = busPlans.some(item => item.item_code === selectedFertCode.item_code)

    if (isItemExist) {
      toast.warn('Already Exist', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })

      return
    }
    if (selectedFertCode.item_code === undefined) {
      toast.error('The selected quantity is being cleared first.', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
    } else {
      const newRow = {
        item_id: selectedFertCode.item_id || '',
        item_code: selectedFertCode.item_code || '',
        engine_type: selectedFertCode.engine_type || '',
        variant: selectedFertCode.variant || '',
        model: selectedFertCode.model || '',
        bs_type: selectedFertCode.bs_type || '',
        item_description: selectedFertCode.item_description || '',
        plan_quantity: quantity
      }
      setBusPlans(prevRows => [...prevRows, newRow])
      setSelectedFertCode(null)
      setQuantity(0)
    }
  }

  // const handleAddRow = () => {
  //   const isItemExist = busPlans.some(item => item.item_code === selectedFertCode.item_code)

  //   if (isItemExist) {
  //     toast.warn('Already Exist', {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500
  //     })

  //     return
  //   }

  //   if (busPlans === null) {
  //     toast.error('Select Buses', {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500
  //     })

  //     return
  //   }

  //   if (quantity <= 0) {
  //     toast.error('Greater then Zero', {
  //       position: toast.POSITION.TOP_RIGHT,
  //       autoClose: 1500
  //     })

  //     return
  //   }

  //   const newRow = {
  //     item_id: selectedFertCode.item_id || '',
  //     item_code: selectedFertCode.item_code || '',
  //     engine_type: selectedFertCode.engine_type || '',
  //     variant: selectedFertCode.variant || '',
  //     model: selectedFertCode.model || '',
  //     bs_type: selectedFertCode.bs_type || '',
  //     item_description: selectedFertCode.item_description || '',
  //     plan_quantity: quantity
  //   }

  //   setBusPlans(prevRows => [...prevRows, newRow])
  //   setSelectedFertCode(null)
  //   setQuantity(0)
  // }

  const handleInputChange = (event, value) => {
    setSelectedFertCode(value)
  }

  const EditSubmit = () => {
    // console.log(rows)
    try {
      // if (!busPlans) {
      //   console.log('Please Select Buses')
      // }
      const updatedBusPlans = []
      busPlans.forEach(item => {
        const editedQuantity = item.edited_quantity !== undefined ? item.edited_quantity : item.plan_quantity

        const newRow = {
          item_id: item.item_id || '',
          item_code: item.item_code || '',
          engine_type: item.engine_type || '',
          variant: item.variant || '',
          model: item.model || '',
          bs_type: item.bs_type || '',
          item_description: item.item_description || '',
          plan_quantity: editedQuantity
        }

        setQuantity(editedQuantity)
        updatedBusPlans.push(newRow)
      })

      const response = fetch('/api/Diversitech/Supervisors/Edit/EditProduction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ updatedBusPlans, plan_no })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data)
          if (data.success) {
            toast.success(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })
          } else {
            toast.error(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })
          }

          setTimeout(() => {
            window.location.href = '/components/Diversitech/Supervisors/PlanView/Production/' // This will reload the page
          }, 1000)
          setRows([])
        })
        .catch(error => {
          console.error(error)
        })

      // console.log(updatedBusPlans)
    } catch (err) {
      console.error('Error sending data:', err)
    }
  }

  const handleDeleteClick = index => {
    setSelectedIndex(busPlans[index].item_id)
    setDiscard(true)
  }

  const handleDiscardRow = async index => {
    try {
      // const rowToDelete = busPlans[index]

      const response = await fetch(
        `/api/Diversitech/Workers/Buses/BusView/?plan_no=${plan_no}&item_id=${selectedIndex}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to discard row')
      }

      const updatedBusPlans = [...busPlans]
      const indexOfDeletedRow = busPlans.findIndex(item => item.item_id === selectedIndex)
      if (indexOfDeletedRow !== -1) {
        updatedBusPlans.splice(indexOfDeletedRow, 1)
        setBusPlans(updatedBusPlans)
      }

      // const updatedBusPlans = [...busPlans]
      // updatedBusPlans.splice(index, 1)
      // setBusPlans(updatedBusPlans)

      toast.success('Row discarded successfully', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
      setDiscard(false)
      window.location.reload()
    } catch (error) {
      console.error('Error discarding row:', error)
      toast.error('Error discarding row', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
    }
  }

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

  return (
    <>
      <Card>
        <ToastContainer />
        {plan_no && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant='h5'>Plan Number: {plan_no}</Typography>
            </div>

            <Button size='medium' variant='contained' onClick={() => setAdd(true)}>
              Add
            </Button>
          </div>
        )}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left'>Fert Code</StyledTableCell>
                <StyledTableCell align='left'>Engine Type</StyledTableCell>
                <StyledTableCell align='left'>Variant</StyledTableCell>
                <StyledTableCell align='left'>Model</StyledTableCell>
                <StyledTableCell align='left'>BS Type</StyledTableCell>
                <StyledTableCell align='left'>Description</StyledTableCell>
                <StyledTableCell align='left'>Qty</StyledTableCell>
                <StyledTableCell align='left'></StyledTableCell>
                {add === true && <StyledTableCell align='left'></StyledTableCell>}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={7}>
                    <Typography>Loading...</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : busPlans.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={7}>
                    <Typography>No Data available</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                busPlans.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                    <StyledTableCell align='left'>{row.engine_type}</StyledTableCell>
                    <StyledTableCell align='left'>{row.variant}</StyledTableCell>
                    <StyledTableCell align='left'>{row.model}</StyledTableCell>
                    <StyledTableCell align='left'>{row.bs_type}</StyledTableCell>
                    <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                    <StyledTableCell align='left'>
                      <TextField
                        style={{ width: '60px', textAlign: 'center', justifyContent: 'center' }}
                        type='number'
                        variant='standard'
                        placeholder='Quantity'
                        value={row.edited_quantity !== undefined ? row.edited_quantity : row.plan_quantity}
                        onChange={event => handleQtyChange(event, index)}
                      />
                      {/* {row.plan_quantity} */}
                    </StyledTableCell>
                    <StyledTableCell align='center' style={{ cursor: 'pointer', width: '2px' }}>
                      <IconButton onClick={() => handleDeleteClick(index)} aria-label='unavailable' color='primary'>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </StyledTableCell>
                    {add === true && <StyledTableCell align='left'></StyledTableCell>}
                  </StyledTableRow>
                ))
              )}
              {add === true ? (
                <StyledTableRow>
                  <StyledTableCell align='left'>
                    <Autocomplete
                      value={selectedFertCode}
                      onChange={handleInputChange}
                      options={busFilteredRows}
                      getOptionLabel={option =>
                        option.product_type === 'BUS' ? option.item_code + ' - ' + option.item_description : ''
                      }
                      renderInput={params => (
                        <TextField
                          style={{ width: '160px' }}
                          {...params}
                          variant='standard'
                          placeholder='Select Fert Code'
                        />
                      )}
                    />
                  </StyledTableCell>

                  <StyledTableCell align='left'>{selectedFertCode ? selectedFertCode.engine_type : ''}</StyledTableCell>
                  <StyledTableCell align='left'>{selectedFertCode ? selectedFertCode.variant : ''}</StyledTableCell>
                  <StyledTableCell align='left'>{selectedFertCode ? selectedFertCode.model : ''}</StyledTableCell>
                  <StyledTableCell align='left'>{selectedFertCode ? selectedFertCode.bs_type : ''}</StyledTableCell>
                  <StyledTableCell align='left'>
                    {selectedFertCode ? selectedFertCode.item_description : ''}
                  </StyledTableCell>
                  <StyledTableCell align='left'>
                    <TextField
                      style={{ width: '60px', textAlign: 'center', justifyContent: 'center' }}
                      type='number'
                      variant='standard'
                      placeholder='Quantity'
                      value={quantity}
                      onChange={event => {
                        const newValue = event.target.value
                        if (newValue > 0 || newValue === '') {
                          setQuantity(newValue)
                        }
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align='left' style={{ width: '2px' }}>
                    <IconButton
                      onClick={() => {
                        setSelectedFertCode('')
                      }}
                      aria-label='unavailable'
                      color='primary'
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align='left' style={{ width: '2px' }}>
                    <IconButton onClick={handleAddRow} aria-label='unavailable' color='primary'>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ) : null}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid padding='10px'>
          <Link href='/components/Diversitech/Supervisors/PlanView/Production/'>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
        <Grid padding='20px'>
          <Button
            size='medium'
            type='submit'
            onClick={() => {
              if (selectedFertCode) {
                if (quantity <= 0) {
                  toast.error('Quanity is zero', {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1500
                  })
                } else {
                  setOpen(true)
                }
              } else if (quantity < 0) {
                toast.error('Quanity is less than and equal', {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1500
                })
              } else {
                setOpen(true)
              }
            }}
            style={{ backgroundColor: 'green', color: 'white' }}
            variant='contained'
          >
            Save
          </Button>
        </Grid>
      </Grid>

      <Dialog open={discard} onClose={() => setDiscard(false)}>
        {/* <DialogTitle>Confirmation</DialogTitle> */}
        <DialogContent>
          <Typography>Are you sure you want to Discard Bus?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid padding='20px'>
              <Button size='medium' onClick={handleDiscardRow} variant='contained'>
                Yes
              </Button>
            </Grid>
            <Grid padding='10px'>
              <Button size='medium' onClick={() => setDiscard(false)} type='submit' variant='contained' title='Submit'>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* <DialogTitle>Confirmation</DialogTitle> */}
        <DialogContent>
          <Typography>Are you sure you want to save?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid padding='20px'>
              <Button
                size='medium'
                onClick={!selectedFertCode ? EditSubmit : (handleAddRow(), EditSubmit)}
                variant='contained'
              >
                Yes
              </Button>
            </Grid>
            <Grid padding='10px'>
              <Button size='medium' onClick={() => setOpen(false)} type='submit' variant='contained' title='Submit'>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default EditPlanBuses
