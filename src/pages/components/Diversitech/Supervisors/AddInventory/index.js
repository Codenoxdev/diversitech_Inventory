// ** React Imports
import { useState, useEffect, useRef, Suspense } from 'react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Yup from 'yup'
import { Canvas, useFrame } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import authConfig from 'src/configs/auth'

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

import { Autocomplete, Dialog, DialogContent, Typography } from '@mui/material'
import { get_coordinates } from 'src/pages/handle'

const AddInventory = () => {
  const addMasterItem = async values => {
    console.log(values.storeAreas)
    const formData = new FormData()
    formData.append('item_code', values.item_code)
    formData.append('item_description', values.item_description)
    formData.append('product_type', values.product_type)
    formData.append('features', values.features)
    formData.append('engine_type', values.engine_type)
    formData.append('variant', values.variant)
    formData.append('model', values.model)
    formData.append('bs_type', values.bs_type)
    formData.append('active', values.active)
    formData.append('vecv_part_no', values.vecv_part_no)
    formData.append('frame_no', values.frame_no)
    formData.append('dwg_division', values.dwg_division)
    formData.append('material', values.material)
    formData.append('unit', values.unit)
    formData.append('category', values.category)
    formData.append('welding_fixTure_number', values.welding_fixTure_number)
    formData.append('leg_part_number', values.leg_part_number)
    formData.append('fmodel', values.fmodel)
    formData.append('mtg_gauge_number', values.mtg_gauge_number)
    formData.append('file', values.file)
    formData.append('file1', values.file1)
    formData.append('file2', values.file2)
    formData.append('partimage', values.partimage)
    formData.append('filedata', values.fileData)
    formData.append('storeAreas', values.storeAreas)

    console.log('first = ', values.storeAreas)
    console.log('first = ', formData)

    try {
      fetch(authConfig.AddInventoryData, {
        method: 'POST',
        body: formData
      })
        .then(response => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Network response was not ok.')
        })
        .then(data => {
          if (data.success) {
            toast.success(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })

            window.location.reload()
          } else {
            toast.error(data.message, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1500
            })
          }
        })
        .catch(error => {
          console.error(error)
          toast.error('Error occurred while processing your request', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1500
          })
        })

      // toast.success(data.message, {
      //   position: toast.POSITION.TOP_RIGHT,
      //   autoClose: 1500
      // })
    } catch (error) {
      console.error(error)
      toast.error('Error occurred while processing your request', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1500
      })
    }
  }

  const validationSchema = Yup.object({
    // Define validation rules for each field
    item_code: Yup.string().required('ItemCode is required'),
    item_description: Yup.string().required('item_description is required')

    // password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
  })

  const masterItemFormik = useFormik({
    initialValues: {
      item_code: null,
      item_description: null,
      product_type: null,
      features: null,
      engine_type: null,
      variant: null,
      model: null,
      bs_type: null,
      active: null,
      vecv_part_no: null,
      frame_no: null,
      dwg_division: null,
      material: null,
      unit: null,
      category: null,
      welding_fixTure_number: null,
      leg_part_number: null,
      fmodel: null,
      mtg_gauge_number: null,
      file: null,
      file1: null,
      file2: null,
      partimage: null,
      fileData: null,
      storeAreas: null
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      addMasterItem({
        ...values,
        variant: values?.variant,
        engine_type: values?.engine_type,
        model: values?.model,
        bs_type: values?.bs_type,
        active: values?.active?.active_id,
        frame_no: values?.frame_no?.item_code,
        dwg_division: values?.dwg_division,
        unit: values?.unit?.unit_id,
        category: values?.category?.category_id,
        material: values?.material,
        vecv_part_no: values?.vecv_part_no,
        welding_fixTure_number: values?.welding_fixTure_number,
        leg_part_number: values?.leg_part_number,
        fmodel: values?.fmodel,
        mtg_gauge_number: values?.mtg_gauge_number,
        file: values.file,
        file1: values.file1,
        file2: values.file2,
        partimage: values.partimage,
        fileData: values.fileData,
        storeAreas: values.storeAreas
      })

      // }
      masterItemFormik.resetForm()
    }
  })

  const [currentBomItem, setCurrentBomItem] = useState(null)

  const handleBOMSelectChange = value => {
    setCurrentBomItem(value)
    masterItemFormik?.setFieldValue('product_type', value?.product_id)
  }

  const masterItemType = [
    { product_id: 'BUS', product_desc: 'Bus' },
    { product_id: 'SEAT', product_desc: 'Seat' },
    { product_id: 'FRAME', product_desc: 'Frame' },
    { product_id: 'PART', product_desc: 'Part' }
  ]

  const activeOptions = [
    { active_id: '1', active_desc: 'Yes' },
    { active_id: '0', active_desc: 'No' }
  ]

  const unitOptions = [
    { unit_id: 'EA', unit_desc: 'Each' },
    { unit_id: 'KG', unit_desc: 'KG' },
    { unit_id: 'L', unit_desc: 'Litre' },
    { unit_id: 'M', unit_desc: 'Meter' }
  ]

  const categoryOptions = [
    { category_id: 'FG', category_desc: 'FG' },
    { category_id: 'WIP', category_desc: 'WIP' },
    { category_id: 'RM', category_desc: 'RM' }
  ]

  const frame_list_type = 'FRAME'
  const [frameList, setFrameList] = useState([])

  const fetchFrameList = async () => {
    try {
      fetch(authConfig.AddInventoryFrameList, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ frame_list_type })
      })
        .then(response => response.json())
        .then(data => {
          setFrameList(data)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (currentBomItem?.product_id == 'SEAT') fetchFrameList()
  }, [currentBomItem])

  const [image, setimage] = useState(null)
  const [image1, setimage1] = useState(null)
  const [image2, setimage2] = useState(null)
  const [partimage, setpartimage] = useState(null)
  const [file, setfile] = useState(null)

  const handleImageChange = async event => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      masterItemFormik?.setFieldValue('file', file)
      setimage(imageUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handlefiletImage = async event => {
    const file = event.target.files[0]

    // console.log('file = ' + file.path + " " +file)
    masterItemFormik?.setFieldValue('fileData', file || null)
    const fileUrl = URL.createObjectURL(file)
    setfile(fileUrl)
  }

  const handlePartImage = async event => {
    const file = event.target.files[0]
    masterItemFormik?.setFieldValue('partimage', file)
    const imageUrl = URL.createObjectURL(file)
    setpartimage(imageUrl)
  }

  const handlePartImageCancel = async event => {
    masterItemFormik?.setFieldValue('partimage', null)
    setpartimage(null)
  }

  const handleImageCancel = async event => {
    masterItemFormik?.setFieldValue('file', null)
    setimage(null)
  }

  const handleImageCancel1 = async event => {
    masterItemFormik?.setFieldValue('file1', null)
    setimage1(null)
  }

  const handleImageCancel2 = async event => {
    masterItemFormik?.setFieldValue('file2', null)
    setimage2(null)
  }

  const handleFileCancel = async event => {
    masterItemFormik?.setFieldValue('fileData', null)
    setfile(null)
  }

  const handleImageChange1 = async event => {
    const file1 = event.target.files[0]
    const imageUrl = URL.createObjectURL(file1)
    setimage1(imageUrl)
    masterItemFormik?.setFieldValue('file1', file1)
  }

  const handleImageChange2 = async event => {
    const file2 = event.target.files[0]
    const imageUrl = URL.createObjectURL(file2)
    masterItemFormik?.setFieldValue('file2', file2)
    setimage2(imageUrl)
  }

  const [popupPath, setPopUpPath] = useState('')
  const [open, setOpen] = useState(false)

  const imagePopup = row => {
    setPopUpPath(row)
  }

  const [clickedArea, setClickedArea] = useState(null)
  const [clickedAreaName, setClickedAreaName] = useState('')
  const [clickedAreaStatus, setClickedAreaStatus] = useState('')
  const [storeAreas, setStoreAreas] = useState([])

  console.log(storeAreas)

  const handleClick = event => {
    get_coordinates(event, setClickedArea)
  }

  const handleClickAreaName = (event, value) => {
    setClickedAreaName(event.target.value)
    setClickedAreaStatus(value)
  }

  const handleAddCoordinates = () => {
    const exist = storeAreas.find(area => area.name === clickedAreaName)
    if (exist) {
      console.log('Already Exist')
    } else if (clickedArea && clickedAreaName) {
      const newArea = {
        x_axis: clickedArea.x,
        y_axis: clickedArea.y,
        name: clickedAreaName,
        value: clickedAreaStatus
      }
      setStoreAreas(prevAreas => [...prevAreas, newArea])
    }
    masterItemFormik?.setFieldValue('storeAreas', storeAreas)
    setClickedArea(null)
    setClickedAreaName('')
    setClickedAreaStatus('')
  }

  // const get_coordinates = event => {
  //   const image = event.target
  //   const rect = image.getBoundingClientRect()
  //   const x = event.clientX - rect.left
  //   const y = event.clientY - rect.top
  //   console.log(x + 'and' + y)

  //   setClickedArea({ x, y })
  // }

  // const

  return (
    <Grid container spacing={2}>
      <ToastContainer />
      <Grid container item justifyContent='center'>
        <Autocomplete
          options={masterItemType || []}
          getOptionLabel={option => (option?.product_desc ? option?.product_desc : '')}
          value={currentBomItem}
          onChange={(event, value) => handleBOMSelectChange(value)}
          renderInput={params => <TextField {...params} label='Item Type' variant='outlined' style={{ width: 300 }} />}
        />
      </Grid>

      {currentBomItem ? (
        <Grid container item>
          <Card>
            <form onSubmit={e => e.preventDefault()}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Item Code'
                        placeholder='Item Code'
                        value={masterItemFormik?.values?.item_code}
                        onChange={(event, value) => {
                          masterItemFormik?.setFieldValue('item_code', event.target.value)
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Item Description'
                        placeholder='Item Description'
                        value={masterItemFormik?.values?.item_description}
                        onChange={(event, value) => {
                          masterItemFormik?.setFieldValue('item_description', event.target.value)
                        }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    {currentBomItem?.product_id == 'BUS' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label='Engine_type'
                            placeholder='Engine_type'
                            value={masterItemFormik?.values?.engine_type}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('engine_type', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label='Variant'
                            placeholder='Variant'
                            value={masterItemFormik?.values?.variant}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('variant', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label='Model'
                            placeholder='Model'
                            value={masterItemFormik?.values?.model}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('model', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label='Bs_type'
                            placeholder='Bs_type'
                            value={masterItemFormik?.values?.bs_type}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('bs_type', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>
                    )}
                    {currentBomItem?.product_id == 'SEAT' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label='VECV No.'
                            placeholder='VECV No.'
                            value={masterItemFormik?.values?.vecv_part_no}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('vecv_part_no', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            fullWidth
                            options={frameList || []}
                            getOptionLabel={option => (option?.item_code ? option?.item_code : '')}
                            value={masterItemFormik?.values?.frame_no}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('frame_no', value)
                            }}
                            renderInput={params => <TextField {...params} label='Frame No.' variant='outlined' />}
                          />
                        </Grid>
                      </>
                    )}
                    {(currentBomItem?.product_id == 'SEAT' || currentBomItem?.product_id == 'FRAME') && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          id='outlined-textarea'
                          fullWidth
                          label='Features'
                          placeholder='Features'
                          multiline
                          value={masterItemFormik?.values?.features}
                          onChange={(event, value) => {
                            masterItemFormik?.setFieldValue('features', event.target.value)
                          }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    )}
                    {currentBomItem?.product_id == 'PART' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            fullWidth
                            options={categoryOptions || []}
                            getOptionLabel={option => (option?.category_desc ? option?.category_desc : '')}
                            value={masterItemFormik?.values?.category}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('category', value)
                            }}
                            renderInput={params => <TextField {...params} label='Category' variant='outlined' />}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            id='outlined-textarea'
                            fullWidth
                            label='Material'
                            placeholder='Material'
                            multiline
                            value={masterItemFormik?.values?.material}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('material', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>
                    )}
                    {(currentBomItem?.product_id == 'SEAT' ||
                      currentBomItem?.product_id == 'FRAME' ||
                      currentBomItem?.product_id == 'PART') && (
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          fullWidth
                          options={unitOptions || []}
                          getOptionLabel={option => (option?.unit_desc ? option?.unit_desc : '')}
                          value={masterItemFormik?.values?.unit}
                          onChange={(event, value) => {
                            masterItemFormik?.setFieldValue('unit', value)
                          }}
                          renderInput={params => <TextField {...params} label='Unit' variant='outlined' />}
                        />
                      </Grid>
                    )}
                    {currentBomItem?.product_id == 'FRAME' && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            id='outlined-textarea'
                            fullWidth
                            label='Welding FixTure Number'
                            placeholder='Welding FixTure Number'
                            multiline
                            value={masterItemFormik?.values?.welding_fixTure_number}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('welding_fixTure_number', event.target.value)
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
                            value={masterItemFormik?.values?.leg_part_number}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('leg_part_number', event.target.value)
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
                            value={masterItemFormik?.values?.mtg_gauge_number}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('mtg_gauge_number', event.target.value)
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
                            value={masterItemFormik?.values?.fmodel}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('fmodel', event.target.value)
                            }}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </>
                    )}
                    {(currentBomItem?.product_id == 'FRAME' || currentBomItem?.product_id == 'PART') && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            id='outlined-textarea'
                            fullWidth
                            label='DWG Division'
                            placeholder='DWG Division'
                            multiline
                            value={masterItemFormik?.values?.dwg_division}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('dwg_division', event.target.value)
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
                        value={masterItemFormik?.values?.active}
                        onChange={(event, value) => {
                          masterItemFormik?.setFieldValue('active', value)
                        }}
                        renderInput={params => <TextField {...params} label='Active' variant='outlined' />}
                      />
                    </Grid>
                    {currentBomItem?.product_id == 'PART' && (
                      <>
                        <Grid container item xs={12} spacing={2}>
                          <Grid item xs={12} sm={2}>
                            <input
                              type='file'
                              accept='image/*'
                              style={{ display: 'none' }}
                              onChange={handlePartImage}
                              id='part-image-upload-input'
                            />
                            <label htmlFor='part-image-upload-input'>
                              <Button variant='contained' component='span' color='primary'>
                                Image
                              </Button>
                            </label>
                            {partimage && (
                              <img
                                src={partimage}
                                alt='Image'
                                style={{ height: '50%', width: '100%' }}
                                onClick={() => {
                                  imagePopup(partimage), setOpen(true)
                                }}
                              />
                            )}
                          </Grid>
                          <Grid item xs={4} sm={1}>
                            {partimage && (
                              <img
                                style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                                alt='Cancel'
                                width='50'
                                height='10'
                                src={`/image/SVG/cross.svg`}
                                onClick={handlePartImageCancel}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={2}>
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
                            {file && <embed src={file} alt='File' style={{ height: '50%', width: '80%' }} />}
                            {/* {image1 && <img src={image1} alt='Back Image' style={{ height: '50%', width: '100%' }} />} */}
                          </Grid>
                          <Grid item xs={4} sm={1}>
                            {file && (
                              <img
                                style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                                alt='Cancel'
                                width='50'
                                height='10'
                                src={`/image/SVG/cross.svg`}
                                onClick={handleFileCancel}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  {(currentBomItem?.product_id == 'SEAT' || currentBomItem?.product_id == 'FRAME') && (
                    <Grid container item xs={12} spacing={2}>
                      <Grid item xs={12} sm={2}>
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
                        {image && (
                          <img
                            src={image}
                            alt='Front Image'
                            style={{ height: '50%', width: '100%' }}
                            onClick={() => {
                              imagePopup(image), setOpen(true)
                            }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={4} sm={1}>
                        {image && (
                          <img
                            style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                            alt='Cancel'
                            width='50'
                            height='10'
                            src={`/image/SVG/cross.svg`}
                            onClick={handleImageCancel}
                          />
                        )}
                      </Grid>
                      {/* Repeat similar structure for other image upload buttons */}
                      <Grid item xs={12} sm={2}>
                        <input
                          type='file'
                          accept='*/*'
                          style={{ display: 'none' }}
                          onChange={handleImageChange1}
                          id='model-upload-input'
                        />
                        <label htmlFor='model-upload-input'>
                          <Button variant='contained' component='span' color='primary'>
                            Upload Model
                          </Button>
                        </label>
                        {image1 && <p>File uploaded: {image1}</p>}
                      </Grid>
                      <Grid item xs={4} sm={1}>
                        {image1 && (
                          <img
                            style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                            alt='Cancel'
                            width='50'
                            height='10'
                            src={`/image/SVG/cross.svg`}
                            onClick={handleImageCancel1}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={2}>
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
                        {image2 && <img src={image2} alt='Both Image' style={{ height: '50%', width: '100%' }} />}
                      </Grid>
                      <Grid item xs={4} sm={1}>
                        {image2 && (
                          <img
                            style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                            alt='Cancel'
                            width='50'
                            height='10'
                            src={`/image/SVG/cross.svg`}
                            onClick={handleImageCancel2}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={2}>
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
                        {file && <embed src={file} alt='File' style={{ height: '50%', width: '80%' }} />}
                        {/* {image1 && <img src={image1} alt='Back Image' style={{ height: '50%', width: '100%' }} />} */}
                      </Grid>
                      <Grid item xs={4} sm={1}>
                        {file && (
                          <img
                            style={{ cursor: 'pointer', alignSelf: 'flex-end' }}
                            alt='Cancel'
                            width='50'
                            height='10'
                            src={`/image/SVG/cross.svg`}
                            onClick={handleFileCancel}
                          />
                        )}
                      </Grid>
                      {/* Add the cancel buttons and additional logic here */}
                    </Grid>
                  )}
                  <Grid container item justifyContent='center'>
                    <Button
                      size='large'
                      type='submit'
                      sx={{ mr: 2 }}
                      variant='contained'
                      disabled={!masterItemFormik?.dirty || !masterItemFormik.isValid}
                      onClick={() => {
                        masterItemFormik.handleSubmit((values, actions) => {
                          handleSubmit(values, actions)
                        })
                      }}
                    >
                      Create Item
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </form>
          </Card>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogContent>
              <img
                alt='Image'
                width='500px'
                height='300px'
                style={{ cursor: 'crosshair' }}
                src={`${popupPath}` || `/image/logo/unavailable.png`}
                onClick={handleClick}
              />
              <TextField
                fullWidth
                label='Part_Name'
                placeholder='Part Name'
                value={clickedAreaName}
                onChange={(event, value) => {
                  handleClickAreaName(event, 'Normal')
                }}
                InputLabelProps={{ shrink: true }}
              />
              {/* {clickedArea && (
                <> */}
              <Typography>Width = {clickedArea ? clickedArea.x : null} </Typography>
              <Typography>Height = {clickedArea ? clickedArea.y : null}</Typography>
              <Button variant='contained' component='span' color='primary' onClick={handleAddCoordinates}>
                Add
              </Button>
              {/* </>
              )} */}
            </DialogContent>
          </Dialog>
        </Grid>
      ) : (
        ''
      )}
    </Grid>
  )
}

AddInventory.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default AddInventory
