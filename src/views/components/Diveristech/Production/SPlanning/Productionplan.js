import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { AuthContext } from 'src/context/AuthContext'
import { Link, Grid, Dialog, DialogTitle, DialogContent, Typography, Card, IconButton } from '@mui/material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const PlanningProduction = () => {
  const { rows, setRows, Masterdata, busFilteredRows } = useContext(AuthContext)

  // console.log('rows = ' + rows)
  const [open, setOpen] = useState(false)
  const [quantity, setQuantity] = useState('')
  const router = useRouter()

  const handleQtyChange = (event, index) => {
    const { value } = event.target
    if (value > 0) {
      setQuantity(value)
    }
    setRows(prevRows => {
      const updatedRows = prevRows.map((row, i) => (i === index ? { ...row, Quantity: value } : row))

      return updatedRows
    })
  }

  const handleAddRow = () => {
    // console.log('handleAddRow_ WOrk')

    // console.log(selectedFertCode.item_code)
    if (selectedFertCode === null) {
      toast.warn('Select Buses', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })

      return
    }

    if (quantity <= 0) {
      toast.error('less than and Equal to zero', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })

      return
    }
    const isItemExist = rows.some(item => item.FertCode === selectedFertCode.item_code)

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
        FertCode: selectedFertCode.item_code || '',
        Engine: selectedFertCode.engine_type || '',
        Variant: selectedFertCode.variant || '',
        Model: selectedFertCode.model || '',
        BS: selectedFertCode.bs_type || '',
        Description: selectedFertCode.item_description || '',
        Quantity: quantity
      }
      setRows(prevRows => [...prevRows, newRow])
      setSelectedFertCode(null)
      setQuantity(0)
    }
  }

  const ProductionSubmit = () => {
    try {
      const response = fetch('/api/Diversitech/Supervisors/Production/Createplanning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rows })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data)
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500 // Display the toast for 1.5 seconds
          })
          toast.error(data.error, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500 // Display the toast for 1.5 seconds
          })

          // Initiate the page refresh after displaying the toast
          setTimeout(() => {
            window.location.href = '/components/Diversitech/Supervisors/PlanView/Production/'
          }, 1000)
          setRows([])
        })
        .catch(error => {
          console.error(error)
        })
    } catch (err) {
      console.error('Error sending data:', err)
    }
  }

  const handleDeleteRow = index => {
    setRows(prevRows => prevRows.filter((row, i) => i !== index))
  }

  const [selectedFertCode, setSelectedFertCode] = useState(null)

  const handleInputChange = (event, value) => {
    setSelectedFertCode(value)
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

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left'>Fert Code</StyledTableCell>
                <StyledTableCell align='left'>Engine Type</StyledTableCell>
                <StyledTableCell align='left'>Variant</StyledTableCell>
                <StyledTableCell align='left'>Model</StyledTableCell>
                <StyledTableCell align='left'>BS Type</StyledTableCell>
                <StyledTableCell align='left'>Description</StyledTableCell>
                <StyledTableCell align='right'>Qty</StyledTableCell>
                <StyledTableCell align='center'></StyledTableCell>
                <StyledTableCell />
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align='left'>{row.FertCode}</StyledTableCell>
                  <StyledTableCell align='left'>{row.Engine}</StyledTableCell>
                  <StyledTableCell align='left'>{row.Variant}</StyledTableCell>
                  <StyledTableCell align='left'>{row.Model}</StyledTableCell>
                  <StyledTableCell align='left'>{row.BS}</StyledTableCell>
                  <StyledTableCell align='left'>{row.Description}</StyledTableCell>
                  <StyledTableCell align='right'>{row.Quantity}</StyledTableCell>
                  <StyledTableCell>
                    <>
                      <IconButton onClick={() => handleDeleteRow(index)} aria-label='unavailable' color='primary'>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    </>
                  </StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </StyledTableRow>
              ))}

              <StyledTableRow>
                <StyledTableCell align='left'>
                  <Autocomplete
                    value={selectedFertCode}
                    onChange={handleInputChange}
                    options={busFilteredRows}
                    getOptionLabel={option => option.item_code + ' - ' + option.item_description}
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
                <StyledTableCell align='center'>
                  <TextField
                    style={{ width: '60px', textAlign: 'center', justifyContent: 'center' }}
                    type='number'
                    variant='standard'
                    placeholder='Quantity'
                    value={quantity}
                    onChange={handleQtyChange}
                  />
                </StyledTableCell>

                <StyledTableCell align='center' style={{ width: '2px' }}>
                  <IconButton
                    onClick={() => {
                      setSelectedFertCode('')
                    }}
                    aria-label='unavailable'
                    color='primary'
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  {/* <img
                    style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
                    alt='New Products'
                    width='50'
                    height='10'
                    src={`/image/SVG/cross.svg`}
                    onClick={() => {
                      setSelectedFertCode('')
                    }}
                  /> */}
                </StyledTableCell>
                <StyledTableCell align='center'>
                  <IconButton onClick={handleAddRow} aria-label='unavailable' color='primary'>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  {/* <img
                    style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', justifyContent: 'center' }}
                    alt='Add'
                    width='50'
                    height='25'
                    src={`/image/SVG/add.svg`}
                    onClick={handleAddRow}
                  /> */}
                </StyledTableCell>
              </StyledTableRow>
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
            onClick={
              () => {
                handleAddRow(), setOpen(true)
              }

              // if (rows === null || rows.length === 0) {
              //   toast.error('Add FertCode First', {
              //     position: toast.POSITION.TOP_RIGHT,
              //     autoClose: 1500 // Display the toast for 1.5 seconds
              //   })
              // } else {
              //   if (selectedFertCode) {
              //     toast.error('Add FertCode First', {
              //       position: toast.POSITION.TOP_RIGHT,
              //       autoClose: 1500 // Display the toast for 1.5 seconds
              //     })
              //   } else { // }
              // }
            }
            style={{ backgroundColor: 'green', color: 'white' }}
            variant='contained'
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <Dialog open={open} onClose={() => setOpen(false)}>
        {/* <DialogTitle>Confirmation</DialogTitle> */}
        <DialogContent>
          <Typography>Are you sure you want to save?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid padding='20px'>
              <Button size='medium' onClick={ProductionSubmit} variant='contained'>
                Yes
              </Button>
            </Grid>
            <Grid padding='10px'>
              <Button size='medium' onClick={() => setOpen(false)} type='submit' variant='contained'>
                No
              </Button>
            </Grid>
          </Grid>
          {/* <Grid
            item
            xs={12}
            padding='20px'
            alignItems='center'
            justifyContent='center'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            {/* <Link href='/components/snackbar/'> */}
          {/* <Button size='large' type='submit' variant='contained' onClick={ProductionSubmit}>
              OK
            </Button> */}
          {/* </Link> */}
          {/* </Grid> */}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PlanningProduction
