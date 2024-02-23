import React, { useState, useEffect } from 'react'
import {
  Card,
  Grid,
  Button,
  TextField,
  CardContent,
  Autocomplete,
  Typography,
  TextareaAutosize,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogContent
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'

const AddStock = () => {
  const [busPlans, setBusPlans] = useState([])
  const [SelectPart, setSelectPart] = useState(null)
  const [quantity, setquantity] = useState(0)
  const [text, setText] = useState('')
  const [Type, setType] = useState('')
  const [open, setopen] = useState(false)

  const handleUpdate = itemId => {
    setopen(false)
    try {
      if (!Type || !SelectPart || !text || !quantity) {
        toast.error('Please fill out all required fields before updating.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      } else {
        const response = fetch('/api/Diversitech/Supervisors/Addstock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemId, quantity, Type, text })
        })
          .then(response => response.json())
          .then(data => {
            toast.success(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })
            toast.error(data.error, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })

            setTimeout(() => {
              window.location.href = '/components/Diversitech/Masterdata/'
            }, 1000)
          })
          .catch(error => {
            console.error(error)
          })
      }
    } catch (err) {
      console.error('Error sending data:', err)
    }
  }

  useEffect(() => {
    // console.log('Fetching data...')
    fetchBusPlans()
  }, [])

  const fetchBusPlans = async () => {
    try {
      const response = await fetch('/api/Diversitech/Supervisors/Inventory/summary', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()

        if (Array.isArray(data)) {
          setBusPlans(data)
        } else {
          console.error('Invalid data format:', data)
        }
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error:', error)
      setBusPlans([])
    }
  }

  const commonBorderStyle = {
    border: '1px solid #ccc',
    borderRadius: '4px'
  }

  return (
    <>
      <Card>
        <ToastContainer />
        <CardContent>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              alignContent='center'
              justifyContent='center'
              style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', marginBottom: '10px' }}
            >
              <Typography variant='h4' style={{ color: 'Black' }}>
                Stock Adjust
              </Typography>
            </Grid>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  value={SelectPart}
                  onChange={(event, newValue) => setSelectPart(newValue)} // Update the state when a new value is selected
                  options={busPlans}
                  getOptionLabel={option =>
                    option.item_code ? option.item_code + ' - ' + option.item_description : ''
                  }
                  renderInput={params => <TextField {...params} label='Part Number' variant='outlined' />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  value={SelectPart ? SelectPart.item_description : ''}
                  fullWidth
                  label='Part Description'
                  placeholder='Part Description'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={SelectPart ? SelectPart.dwg_division : ''}
                  label='DWG Division'
                  placeholder='DWG Division'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={SelectPart ? SelectPart.material : ''}
                  label='Material'
                  placeholder='Material'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={SelectPart ? SelectPart.unit : ''}
                  label='Unit'
                  placeholder='Unit'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  value={SelectPart ? SelectPart.category : ''}
                  label='Category'
                  placeholder='Category'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Features'
                  value={SelectPart ? SelectPart.features : ''}
                  placeholder='Features'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Active'
                  value={SelectPart ? SelectPart.active : ''}
                  placeholder='Active'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                <TextField
                  fullWidth
                  value={SelectPart ? SelectPart.available_quantity : ''}
                  label='Available Quantity'
                  placeholder='Available Quantity'
                  InputProps={{
                    readOnly: true
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
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
                    <MenuItem value='add'>Add</MenuItem>
                    <MenuItem value='sub'>Sub</MenuItem>
                    {/* <MenuItem value='add'>FRAME</MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  type='number'
                  label='Quantity'
                  value={quantity}
                  onChange={event => {
                    const newValue = event.target.value
                    if (newValue > 0 || newValue === '') {
                      setquantity(newValue)
                    }
                  }}
                  placeholder='Quantity'
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextareaAutosize
                  value={text}
                  onChange={e => setText(e.target.value)}
                  style={{ width: '100%', ...commonBorderStyle }}
                  aria-label='minimum height'
                  minRows={4}
                  placeholder='Comment'
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item padding='10px'>
          {' '}
          <Link href={`/components/Diversitech/Masterdata/`}>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
        <Grid item padding='20px'>
          {' '}
          <Button size='medium' type='submit' sx={{ mr: 2 }} onClick={() => setopen(true)} variant='contained'>
            Submit
          </Button>
        </Grid>
      </Grid>

      <Dialog open={open} onClose={() => setopen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to save..?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item padding='10px'>
              {' '}
              <Button
                size='medium'
                onClick={() => handleUpdate(SelectPart ? SelectPart.item_id : null)}
                type='submit'
                variant='contained'
              >
                Yes
              </Button>
            </Grid>
            <Grid item padding='20px'>
              {' '}
              <Button size='medium' type='submit' onClick={() => setopen(false)} variant='contained'>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddStock
