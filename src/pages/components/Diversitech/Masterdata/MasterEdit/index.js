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
import { useRouter } from 'next/router'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const MasterEdit = () => {
  const [busPlans, setBusPlans] = useState([])
  const [SelectPart, setSelectPart] = useState(null)
  const [updatedata, setupdatedata] = useState(0)
  const [Type, setType] = useState('')
  const [open, setopen] = useState(false)
  const router = useRouter()
  const { item_id, product_type, item_code } = router.query

  const activeOptions = [
    { active_id: '1', active_desc: 'Yes' },
    { active_id: '0', active_desc: 'No' }
  ]

  const [item_code1, setItem_code1] = useState(null)

  const handleRowUpdate = updatedRow => {
    const rowIndex = busPlans.findIndex(row => row.id === updatedRow.id)
    setItem_code1(updatedRow.item_code)
    const updatedBusPlans = [...busPlans]
    updatedBusPlans[rowIndex] = updatedRow
    setBusPlans(updatedBusPlans)
  }

  useEffect(() => {
    fetch(`/api/Diversitech/Supervisors/Edit/Editmaster`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ item_id, product_type })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data from the API')
        }

        return response.json()
      })
      .then(data => {
        setItem_code1(data[0].item_code)
        setBusPlans(data)
      })
      .catch(error => {
        console.error(error)
        setBusPlans([])
      })
  }, [item_id, product_type])

  // const commonBorderStyle = {
  //   border: '1px solid #ccc',
  //   borderRadius: '4px'
  // }

  const [image, setimage] = useState(null)
  const [image1, setimage1] = useState(null)
  const [image2, setimage2] = useState(null)
  const [file, setFile] = useState(null)
  const [file1, setfile1] = useState(null)
  const [file2, setfile2] = useState(null)
  const [partimage, setpartimage] = useState(null)
  const [partimagefile, setpartimagefile] = useState(null)
  const [pdf, setpdf] = useState(null)
  const [pdfile, setpdfile] = useState(null)

  const handlePartImageChange = async event => {
    const filedata = event.target.files[0]
    setpartimage(filedata)
    if (filedata) {
      const imageUrl = URL.createObjectURL(filedata)
      setpartimagefile(imageUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handleImageChange = async event => {
    const filedata = event.target.files[0]
    setFile(filedata)
    if (filedata) {
      const imageUrl = URL.createObjectURL(filedata)
      setimage(imageUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handleImageChange1 = async event => {
    const file = event.target.files[0]
    setfile1(file)

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setimage1(imageUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handleImageChange2 = async event => {
    const file = event.target.files[0]
    setfile2(file)

    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setimage2(imageUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handlefiletImage = async event => {
    const file = event.target.files[0]
    setpdfile(file)
    const imageUrl = URL.createObjectURL(file)
    setpdf(imageUrl)
  }

  const handleSubmit = async () => {
    try {
      // if (busPlans) {
      const formData = new FormData()
      formData.append('item_id', busPlans[0].item_id)
      formData.append('item_code', busPlans[0].item_code)
      formData.append('item_description', busPlans[0].item_description)
      formData.append('engine_type', busPlans[0].engine_type)
      formData.append('variant', busPlans[0].variant)
      formData.append('bs_type', busPlans[0].bs_type)
      formData.append('model', busPlans[0].model)
      formData.append('product_type', busPlans[0].product_type)
      formData.append('image_url', busPlans[0].image_url)
      formData.append('frame_no', busPlans[0].frame_no)
      formData.append('vecv_part_no', busPlans[0].vecv_part_no)
      formData.append('dwg_division', busPlans[0].dwg_division)
      formData.append('material', busPlans[0].material)
      formData.append('unit', busPlans[0].unit)
      formData.append('category', busPlans[0].category)
      formData.append('features', busPlans[0].features)
      formData.append('active', busPlans[0].active)
      formData.append('welding_no', busPlans[0].welding_no)
      formData.append('mtgauge_no', busPlans[0].mtgauge_no)
      formData.append('legpart_no', busPlans[0].legpart_no)
      formData.append('frame_model', busPlans[0].frame_model)
      formData.append('file', file)
      formData.append('file1', file1)
      formData.append('file2', file2)
      formData.append('partimage', partimage)
      formData.append('filedata', pdfile)

      const response = await fetch('/api/Diversitech/Supervisors/Addinventory/uploadimage', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()

        if (data.success) {
          toast.success(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          })

          // window.location.reload()
        } else {
          toast.error(data.message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          })
        }
      } else {
        throw new Error('Network response was not ok.')

        // }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // const handleDeleteClick = key => {
  //   fetch(`/api/Diversitech/Supervisors/Edit/Editimage`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({ key })
  //   })
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch data from the API')
  //       }

  //       return response.json()
  //     })
  //     .then(data => {
  //       console.log('data = ' + data)
  //       setBusPlans(data)
  //     })
  //     .catch(error => {
  //       console.error(error)
  //       setBusPlans([])
  //     })
  // }

  const handleRoute = (row, view) => {
    let targetPage
    targetPage = `/components/Diversitech/Supervisors/AddBom/?item_id=${encodeURIComponent(
      item_id
    )}&product_type=BOM&item_code=${encodeURIComponent(item_code)}`

    router.push(targetPage)
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
                Edit
              </Typography>
            </Grid>

            {product_type ? (
              <Grid container item>
                <form onSubmit={e => e.preventDefault()}>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} style={{ textAlign: 'right' }}>
                        <Button onClick={handleRoute} variant='contained' component='span' color='primary'>
                          BOM
                        </Button>
                      </Grid>
                      {busPlans.map((row, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label='Item Code'
                                placeholder='Item Code'
                                value={row.item_code}
                                onChange={event => {
                                  const updatedRow = { ...row, item_code: event.target.value }
                                  handleRowUpdate(updatedRow)
                                }}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label='Item Description'
                                placeholder='Item Description'
                                value={row.item_description}
                                onChange={(event, value) => {
                                  const updatedRow = { ...row, item_description: event.target.value }
                                  handleRowUpdate(updatedRow)
                                }}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            {product_type == 'BUS' && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Engine Type'
                                    placeholder='Engine Type'
                                    value={row.engine_type}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, engine_type: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Variant'
                                    placeholder='Variant'
                                    value={row.variant}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, variant: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Model'
                                    placeholder='Model'
                                    value={row.model}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, model: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='BS Type'
                                    placeholder='BS Type'
                                    value={row.bs_type}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, bs_type: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </>
                            )}
                            {product_type == 'SEAT' && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='VECV No.'
                                    placeholder='VECV No.'
                                    value={row.vecv_part_no}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, vecv_part_no: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Frame No.'
                                    placeholder='Frame No.'
                                    value={row.frame_no}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, frame_no: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    renderInput={params => (
                                      <TextField {...params} label='Frame No.' variant='outlined' />
                                    )}
                                  />
                                </Grid>
                              </>
                            )}
                            {(product_type == 'SEAT' || product_type == 'FRAME') && (
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  id='outlined-textarea'
                                  fullWidth
                                  label='Features'
                                  placeholder='Features'
                                  multiline
                                  value={row.features}
                                  onChange={(event, value) => {
                                    const updatedRow = { ...row, features: event.target.value }
                                    handleRowUpdate(updatedRow)
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            )}
                            {product_type == 'PART' && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='Category'
                                    placeholder='Category'
                                    multiline
                                    value={row.category}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, category: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='Material'
                                    placeholder='Material'
                                    multiline
                                    value={row.material}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, material: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </>
                            )}
                            {(product_type == 'SEAT' || product_type == 'FRAME' || product_type == 'PART') && (
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label='Unit'
                                  placeholder='Unit'
                                  value={row.unit}
                                  onChange={(event, value) => {
                                    const updatedRow = { ...row, unit: event.target.value }
                                    handleRowUpdate(updatedRow)
                                  }}
                                  InputLabelProps={{ shrink: true }}
                                />
                              </Grid>
                            )}
                            {product_type == 'FRAME' && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='Welding FixTure Number'
                                    placeholder='Welding FixTure Number'
                                    multiline
                                    value={row.welding_no}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, welding_no: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='Leg part number'
                                    placeholder='Leg part number'
                                    multiline
                                    value={row.legpart_no}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, legpart_no: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='MTG cd Gauge Number'
                                    placeholder='MTG cd Gauge Number'
                                    multiline
                                    value={row.mtgauge_no}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, mtgauge_no: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='Frame Model'
                                    placeholder='Frame Model'
                                    multiline
                                    value={row.frame_model}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, frame_model: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </>
                            )}
                            {(product_type == 'FRAME' || product_type == 'PART') && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    id='outlined-textarea'
                                    fullWidth
                                    label='DWG Division'
                                    placeholder='DWG Division'
                                    multiline
                                    value={row.dwg_division}
                                    onChange={(event, value) => {
                                      const updatedRow = { ...row, dwg_division: event.target.value }
                                      handleRowUpdate(updatedRow)
                                    }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                              </>
                            )}
                            <Grid item xs={12} sm={6}>
                              <Autocomplete
                                options={activeOptions || []}
                                fullWidth
                                getOptionLabel={option => (option?.active_desc ? option?.active_desc : '')}
                                value={row.active}
                                onChange={(event, value) => {
                                  const updatedRow = { ...row, active: event.target.value }
                                  handleRowUpdate(updatedRow)
                                }}
                                renderInput={params => <TextField {...params} label='Active' variant='outlined' />}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <input
                                type='file'
                                accept='applicatiton/pdf'
                                style={{ display: 'none' }}
                                onChange={handlefiletImage}
                                id='file-image-upload-input'
                              />
                              <label htmlFor='file-image-upload-input'>
                                <Button variant='contained' component='span' color='primary'>
                                  File
                                </Button>
                              </label>
                              {product_type == 'PART' ? (
                                JSON.parse(row.image_url).partimage1 ? (
                                  <a
                                    href={JSON.parse(row.image_url).partimage1}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                  >
                                    PDF
                                  </a>
                                ) : null
                              ) : product_type == 'SEAT' || product_type == 'FRAME' ? (
                                JSON.parse(row.image_url).file3 ? (
                                  <a href={JSON.parse(row.image_url).file3} target='_blank' rel='noopener noreferrer'>
                                    PDF
                                  </a>
                                ) : null
                              ) : null}
                              {/* <a href={JSON.parse(row.image_url).partimage1} target="_blank" rel="noopener noreferrer">PDF</a> */}
                            </Grid>
                            {product_type == 'PART' && (
                              <>
                                <Grid container item xs={12} spacing={2} marginTop={2}>
                                  <Grid item xs={12} sm={3}>
                                    <input
                                      type='file'
                                      accept='image/*'
                                      style={{ display: 'none' }}
                                      onChange={handlePartImageChange}
                                      id='part-image-upload-input'
                                    />
                                    <label htmlFor='part-image-upload-input'>
                                      <Button variant='contained' component='span' color='primary'>
                                        Image
                                      </Button>
                                    </label>
                                    {partimage ? (
                                      <img src={partimagefile} alt={`Image`} style={{ height: '50%', width: '100%' }} />
                                    ) : JSON.parse(row.image_url).partimage0 ? (
                                      <img
                                        src={JSON.parse(row.image_url).partimage0}
                                        alt={`Image`}
                                        style={{ height: '50%', width: '100%' }}
                                        onError={e => {
                                          e.target.src = '/image/logo/unavailable.png'
                                        }}
                                      />
                                    ) : (
                                      <img
                                        alt='Image'
                                        width='100%'
                                        height='50%'
                                        style={{ cursor: 'pointer' }}
                                        src={`/image/logo/unavailable.png`}

                                        // onClick={() => {
                                        //   imagepopup(row), setopen(true)
                                        // }}
                                      />
                                    )}
                                  </Grid>
                                </Grid>
                              </>
                            )}
                          </Grid>
                          {(product_type == 'SEAT' || product_type == 'FRAME') && (
                            <Grid container item xs={12} spacing={2} marginTop={2}>
                              <Grid item xs={12} sm={3}>
                                <input
                                  type='file'
                                  accept='image/*'
                                  style={{ display: 'none' }}
                                  onChange={handleImageChange}
                                  id='front-image-upload-input'
                                />
                                <label htmlFor='front-image-upload-input'>
                                  <Button variant='contained' component='span' color='primary'>
                                    Image
                                  </Button>
                                </label>
                                {image ? (
                                  <img
                                    src={image}
                                    alt={`Image`}
                                    style={{ height: '50%', width: '100%' }}
                                    onError={e => {
                                      e.target.src = '/image/logo/unavailable.png'
                                    }}
                                  />
                                ) : JSON.parse(row.image_url).file0 ? (
                                  <img
                                    src={JSON.parse(row.image_url).file0}
                                    alt={`Image`}
                                    style={{ height: '50%', width: '100%' }}
                                    onError={e => {
                                      e.target.src = '/image/logo/unavailable.png'
                                    }}
                                  />
                                ) : (
                                  <img
                                    alt='Image'
                                    width='100%'
                                    height='50%'
                                    style={{ cursor: 'pointer' }}
                                    src={`/image/logo/unavailable.png`}

                                    // onClick={() => {
                                    //   imagepopup(row), setopen(true)
                                    // }}
                                  />
                                )}
                              </Grid>

                              <Grid item xs={12} sm={3}>
                                <input
                                  type='file'
                                  accept='*/*'
                                  style={{ display: 'none' }}
                                  onChange={handleImageChange1}
                                  id='back-image-upload-input'
                                />
                                <label htmlFor='back-image-upload-input'>
                                  <Button variant='contained' component='span' color='primary'>
                                    Image-Model
                                  </Button>
                                </label>
                                {image1 ? (
                                  <p>File uploaded: {image1}</p>
                                ) : JSON.parse(row.image_url).file1 ? (
                                  <a href={JSON.parse(row.image_url).file1} target='_blank' rel='noopener noreferrer'>
                                    Data
                                  </a>
                                ) : (
                                  <img
                                    alt='Image'
                                    width='100%'
                                    height='50%'
                                    style={{ cursor: 'pointer' }}
                                    src={`/image/logo/unavailable.png`}
                                  />
                                )}
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <input
                                  type='file'
                                  accept='image/*'
                                  style={{ display: 'none' }}
                                  onChange={handleImageChange2}
                                  id='both-image-upload-input'
                                />
                                <label htmlFor='both-image-upload-input'>
                                  <Button variant='contained' component='span' color='primary'>
                                    3D Image
                                  </Button>
                                </label>
                                {image2 ? (
                                  <img src={image2} alt={`Image`} style={{ height: '50%', width: '100%' }} />
                                ) : JSON.parse(row.image_url).file2 ? (
                                  <img
                                    src={JSON.parse(row.image_url).file2}
                                    alt={`Image`}
                                    style={{ height: '50%', width: '100%' }}
                                    onError={e => {
                                      e.target.src = '/image/logo/unavailable.png' // Set default image when original image fails to load
                                    }}
                                  />
                                ) : (
                                  <img
                                    alt='Image'
                                    width='100%'
                                    height='50%'
                                    style={{ cursor: 'pointer' }}
                                    src={`/image/logo/unavailable.png`}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      ))}{' '}
                    </Grid>
                  </CardContent>
                </form>
                {/* </Card> */}
              </Grid>
            ) : (
              ''
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
          <Button size='medium' type='submit' sx={{ mr: 2 }} onClick={handleSubmit} variant='contained'>
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

MasterEdit.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default MasterEdit
