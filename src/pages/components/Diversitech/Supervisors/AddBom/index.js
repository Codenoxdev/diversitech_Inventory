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
  DialogContent,
  IconButton
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useRouter } from 'next/router'

const AddBom = () => {
  const router = useRouter()
  const { item_id, product_type, item_code } = router.query
  const [busPlans, setBusPlans] = useState([])
  const [SelectPart, setSelectPart] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [text, setText] = useState('')
  const [Type, setType] = useState('')
  const [open, setopen] = useState(false)
  const [remove, setRemove] = useState(false)
  const [removeVerify, setRemoveVerify] = useState(false)
  const [bom, setBom] = useState([])
  const [product, setProduct] = useState([])
  const [deleteParams, setDeleteParams] = useState(null)

  console.log(item_id, product_type, item_code)

  // const handleUpdate = itemId => {
  //   setopen(false)
  //   try {
  //     if (!Type || !SelectPart || !text || !quantity) {
  //       toast.error('Please fill out all required fields before updating.', {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1500
  //       })
  //     } else {
  //       const response = fetch('/api/Diversitech/Supervisors/Addstock', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify({ itemId, quantity, Type, text })
  //       })
  //         .then(response => response.json())
  //         .then(data => {
  //           toast.success(data.message, {
  //             position: toast.POSITION.TOP_RIGHT,
  //             autoClose: 1500
  //           })
  //           toast.error(data.error, {
  //             position: toast.POSITION.TOP_RIGHT,
  //             autoClose: 1500
  //           })

  //           setTimeout(() => {
  //             window.location.href = '/components/Diversitech/Masterdata/'
  //           }, 1000)
  //         })
  //         .catch(error => {
  //           console.error(error)
  //         })
  //     }
  //   } catch (err) {
  //     console.error('Error sending data:', err)
  //   }
  // }

  const handleDeleteClick = (index, a, b) => {
    console.log(index, a, b)
    setRemove(true)
    setDeleteParams({ a, b, index })
  }

  const handleDelete = async (parent, child, index) => {
    try {
      const response = await fetch('/api/Diversitech/Supervisors/Addbom/Edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ parent, child })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        if (data.success) {
          setRemove(false)
          setBom(prevRows => prevRows.filter((row, i) => i !== index))
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          })
        } else {
          toast.error('Not Found', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          })
        }

        // if (Array.isArray(data)) {
        //   console.log('data_addBom', data)
        //   setBom(data)
        // } else {
        //   console.error('Invalid data format:', data)
        // }
      } else {
        console.error('Failed to fetch data')
      }
    } catch (error) {
      console.error('Error:', error)
      setBom([])
    }
  }

  // const handleDeleteClick = (index, a, b) => {
  //   console.log(index, a, b)
  //   setRemove(true)
  //   if (removeVerify) {
  //     handleDelete = () => {
  //       console.log('Work')

  //       // You can access 'a' and 'b' here since they are parameters of handleDeleteClick
  //       console.log('a:', a, 'b:', b)
  //     }
  //   }

  //   // // if()
  //   // setBom(prevRows => prevRows.filter((row, i) => i !== index))
  // }

  useEffect(() => {
    const fetchData = async () => {
      fetchBusPlans() // Assuming this function is defined elsewhere and used appropriately

      if (item_id && product_type && item_code) {
        try {
          const response = await fetch('/api/Diversitech/Supervisors/Addbom/Edit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ item_id, product_type, item_code })
          })

          if (response.ok) {
            const data = await response.json()
            console.log(data)
            if (Array.isArray(data)) {
              console.log('data_addBom', data)
              setBom(data)
            } else {
              console.error('Invalid data format:', data)
            }
          } else {
            console.error('Failed to fetch data')
          }
        } catch (error) {
          console.error('Error:', error)
          setBom([])
        }
      }
    }

    fetchData()
  }, [item_id, product_type, item_code])

  // useEffect(() => {
  //   fetchBusPlans()
  //   if (item_id) {
  //     try {
  //       const response = fetch('/api/Diversitech/Supervisors/Addbom/Edit', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         body: JSON.stringify(item_id)
  //       })

  //       if (response.ok) {
  //         const data = response.json()

  //         if (Array.isArray(data)) {
  //           console.log('data_addBom', data)
  //           setBom(data)
  //         } else {
  //           console.error('Invalid data format:', data)
  //         }
  //       } else {
  //         console.error('Failed to fetch data')
  //       }
  //     } catch (error) {
  //       console.error('Error:', error)
  //       setBom([])
  //     }
  //   }
  // }, [item_id])

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

  const [selectedFertCode, setSelectedFertCode] = useState(null)

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

  const handleAddRow = () => {
    if (selectedFertCode === null) {
      toast.warn('Select Buses', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })

      return
    }

    if (quantity <= 0) {
      toast.error('Quantity is zero', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })

      return
    }

    // if (SelectPart.product_type === selectedFertCode.product_type) {
    //   toast.warn(`cannot Select because this is ${SelectPart.product_type} `, {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1500
    //   })

    //   return
    // }

    const isItemExist = bom.some(item => item.FertCode === selectedFertCode.item_code)

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
        parent_id: SelectPart ? SelectPart.item_id : item_id,
        item_id: selectedFertCode.item_id || '',
        FertCode: selectedFertCode.item_code || '',
        item_description: selectedFertCode.item_description || '',
        material: selectedFertCode.material || '',
        unit: selectedFertCode.unit || '',
        category: selectedFertCode.category || '',
        product_type: selectedFertCode.product_type || '',
        image: selectedFertCode.image_url || '',
        Quantity: quantity
      }
      setBom(prevRows => [...prevRows, newRow])
      setSelectedFertCode(null)
      setQuantity(0)
    }
  }

  const handleInputChange = (event, value) => {
    setSelectedFertCode(value)
  }

  const handleSubmit = () => {
    try {
      if (!bom) {
        toast.error('Please fill out all required fields before updating.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      } else {
        fetch('/api/Diversitech/Supervisors/Addbom', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bom })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              })
              setTimeout(() => {
                window.location.href = '/components/Diversitech/Masterdata'
              }, 1000)
            } else {
              toast.error(data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              })
            }
          })
          .catch(error => {
            console.error(error)
          })
      }
    } catch (err) {
      console.error('Error in Add Bom ' + err)
    }
  }

  const handleUpdate = () => {
    try {
      if (!bom) {
        toast.error('Please fill out all required fields before updating.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      } else {
        console.log(bom)

        fetch('/api/Diversitech/Supervisors/Addbom/Edit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ bom })
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              })
              setTimeout(() => {
                window.location.href = '/components/Diversitech/Masterdata'
              }, 1000)
            } else {
              toast.error(data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1500
              })
            }
          })
          .catch(error => {
            console.error(error)
          })
      }
    } catch (err) {
      console.error('Error in Add Bom ' + err)
    }
  }

  const filteredProducts = SelectPart
    ? busPlans.filter(product =>
        product.product_type === SelectPart.product_type
          ? product.category === SelectPart.category
            ? false
            : true
          : true
      )
    : busPlans

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
                Bill of Material
              </Typography>
            </Grid>
            {!product_type ? (
              <>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      fullWidth
                      value={SelectPart}
                      onChange={(event, newValue) => {
                        setSelectPart(newValue)
                      }}
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
                </Grid>
                <Grid item padding='10px'></Grid>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell align='left'>Part Code</StyledTableCell>
                        <StyledTableCell align='left'>Part Description</StyledTableCell>
                        <StyledTableCell align='left'>material</StyledTableCell>
                        <StyledTableCell align='left'>unit</StyledTableCell>
                        <StyledTableCell align='left'>category</StyledTableCell>
                        <StyledTableCell align='right'>Qty</StyledTableCell>
                        <StyledTableCell align='right'>Image</StyledTableCell>
                        <StyledTableCell />
                        <StyledTableCell />
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {SelectPart && (
                        <>
                          {bom.map((row, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell align='left'>{row.FertCode}</StyledTableCell>
                              <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                              <StyledTableCell align='left'>{row.material}</StyledTableCell>
                              <StyledTableCell align='left'>{row.unit}</StyledTableCell>
                              <StyledTableCell align='left'>{row.category}</StyledTableCell>
                              <StyledTableCell align='right'>{row.Quantity}</StyledTableCell>
                              {/* {console.log('row =' + row.product_type)} */}
                              <StyledTableCell align='right'>
                                <img
                                  src={
                                    row.product_type === 'PART'
                                      ? JSON.parse(row.image).partimage0
                                      : JSON.parse(row.image).file2
                                  }
                                  onError={e => {
                                    e.target.src = '/image/logo/unavailable.png'
                                  }}
                                  height={50}
                                  alt='Image'
                                />
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                <IconButton
                                  onClick={() => handleDeleteClick(index)}
                                  aria-label='Delete'
                                  color='primary'
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </StyledTableCell>

                              <StyledTableCell />
                            </StyledTableRow>
                          ))}
                          <StyledTableRow>
                            <StyledTableCell align='left'>
                              <Autocomplete
                                value={selectedFertCode}
                                onChange={handleInputChange}
                                options={filteredProducts}
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
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.item_description : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.material : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.unit : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.category : ''}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <TextField
                                style={{ width: '60px', textAlign: 'center' }}
                                type='number'
                                variant='standard'
                                placeholder='Quantity'
                                value={quantity}
                                onChange={event => {
                                  const value = event.target.value
                                  if (value > 0) {
                                    setQuantity(value)
                                  }
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <img
                                src={`${
                                  selectedFertCode
                                    ? selectedFertCode.product_type === 'PART'
                                      ? JSON.parse(selectedFertCode.image_url).partimage0
                                      : JSON.parse(selectedFertCode.image_url).file0
                                    : ''
                                }`}
                                onError={e => {
                                  e.target.src = '/image/logo/unavailable.png'
                                }}
                                height={50}
                                alt='Image'
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
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <IconButton onClick={handleAddRow} aria-label='Add' color='primary'>
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      value={item_code}
                      fullWidth
                      label='Part Number'
                      placeholder='Part Description'
                      InputProps={{
                        readOnly: true
                      }}
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
                </Grid>
                <Grid item padding='10px'></Grid>

                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <StyledTableRow>
                        <StyledTableCell align='left'>Part Code</StyledTableCell>
                        <StyledTableCell align='left'>Part Description</StyledTableCell>
                        <StyledTableCell align='left'>material</StyledTableCell>
                        <StyledTableCell align='left'>unit</StyledTableCell>
                        <StyledTableCell align='left'>category</StyledTableCell>
                        <StyledTableCell align='right'>Qty</StyledTableCell>
                        <StyledTableCell align='right'>Image</StyledTableCell>
                        <StyledTableCell />
                        <StyledTableCell />
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {item_code && (
                        <>
                          {bom.map((row, index) => (
                            <StyledTableRow key={index}>
                              <StyledTableCell align='left'>{row.FertCode}</StyledTableCell>
                              <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                              <StyledTableCell align='left'>{row.material}</StyledTableCell>
                              <StyledTableCell align='left'>{row.unit}</StyledTableCell>
                              <StyledTableCell align='left'>{row.category}</StyledTableCell>
                              <StyledTableCell align='right'>{row.Quantity}</StyledTableCell>
                              {/* {console.log('row =' + row.product_type)} */}
                              <StyledTableCell align='right'>
                                <img
                                  src={
                                    row.product_type === 'PART'
                                      ? JSON.parse(row.image_url)?.file2 || '/image/logo/unavailable.png'
                                      : '/image/logo/unavailable.png'
                                  }
                                  onError={e => {
                                    e.target.src = '/image/logo/unavailable.png'
                                  }}
                                  height={50}
                                  alt='Image'
                                />
                              </StyledTableCell>
                              <StyledTableCell align='right'>
                                <IconButton
                                  onClick={() => handleDeleteClick(index, row.parent_id, row.item_id)} // setRemove(true)
                                  aria-label='Delete'
                                  color='primary'
                                >
                                  <RemoveCircleOutlineIcon />
                                </IconButton>
                              </StyledTableCell>

                              <StyledTableCell />
                            </StyledTableRow>
                          ))}
                          <StyledTableRow>
                            <StyledTableCell align='left'>
                              <Autocomplete
                                value={selectedFertCode}
                                onChange={handleInputChange}
                                options={filteredProducts}
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
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.item_description : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.material : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.unit : ''}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {selectedFertCode ? selectedFertCode.category : ''}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <TextField
                                style={{ width: '60px', textAlign: 'center' }}
                                type='number'
                                variant='standard'
                                placeholder='Quantity'
                                value={quantity}
                                onChange={event => {
                                  const value = event.target.value
                                  if (value > 0) {
                                    setQuantity(value)
                                  }
                                }}
                              />
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <img
                                src={
                                  selectedFertCode && selectedFertCode.image_url
                                    ? selectedFertCode.product_type === 'PART'
                                      ? JSON.parse(selectedFertCode.image_url)?.partimage0 ||
                                        '/image/logo/unavailable.png'
                                      : JSON.parse(selectedFertCode.image_url)?.file0 || '/image/logo/unavailable.png'
                                    : '/image/logo/unavailable.png'
                                }
                                onError={e => {
                                  e.target.src = '/image/logo/unavailable.png'
                                }}
                                height={50}
                                alt='Image'
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
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                              <IconButton onClick={handleAddRow} aria-label='Add' color='primary'>
                                <AddCircleOutlineIcon />
                              </IconButton>
                            </StyledTableCell>
                          </StyledTableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
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
          <Button
            size='medium'
            type='submit'
            sx={{ mr: 2 }}
            onClick={() => {
              handleAddRow(), setopen(true)
            }}
            variant='contained'
          >
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
              <Button size='medium' onClick={handleUpdate} type='submit' variant='contained'>
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

      <Dialog open={remove} onClose={() => setRemove(false)}>
        <DialogContent>
          <Typography>Are you sure you want to remove..?</Typography>
          <Grid container justifyContent='center' alignItems='center'>
            <Grid item padding='10px'>
              {' '}
              <Button
                size='medium'
                onClick={() => {
                  // if (deleteParams) {
                  handleDelete(deleteParams.a, deleteParams.b, deleteParams.index)

                  // }
                }}
                type='submit'
                variant='contained'
              >
                Yes
              </Button>
            </Grid>
            <Grid item padding='20px'>
              {' '}
              <Button size='medium' type='submit' onClick={() => setRemove(false)} variant='contained'>
                No
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddBom
