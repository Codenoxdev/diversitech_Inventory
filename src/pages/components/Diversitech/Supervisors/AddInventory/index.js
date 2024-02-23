// ** React Imports
import { useState, useEffect, useRef, Suspense } from 'react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Yup from 'yup'
import { Canvas, useFrame } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import TextField from '@mui/material/TextField'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

import { Autocomplete } from '@mui/material'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const AddInventory = () => {
  const addMasterItem = async values => {
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

    try {
      fetch('/api/Diversitech/Supervisors/Addinventory/imageBackend', {
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
      fileData: null
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
        fileData: values.fileData
      })

      // }
      masterItemFormik.resetForm()
    }
  })

  // const partsData = {
  //   part1: {
  //     partno: 'part1',
  //     description: 'desc1',
  //     material: 'mat1',
  //     unit: 'unit1',
  //     image: '/image/Back/bseats.png'
  //   },
  //   part2: {
  //     partno: 'part2',
  //     description: 'desc2',
  //     material: 'mat2',
  //     unit: 'unit2',
  //     image: '/image/Front/seats.png'
  //   }
  // }

  // const partsDataBom = {
  //   partBom1: {
  //     partno: 'part bom1',
  //     description: 'desc bom1',
  //     material: 'mat bom1',
  //     unit: 'unit bom1',
  //     image: '/image/Back/bseats.png'
  //   },
  //   partBom2: {
  //     partno: 'part bom2',
  //     description: 'desc bom2',
  //     material: 'mat bom2',
  //     unit: 'unit bom2',
  //     image: '/image/Front/seats.png'
  //   }
  // }

  // const handleSelectChange = (event, idx) => {
  //   const selectedPart = partsData[event.target.value]
  //   if (selectedPart) {
  //     const updatedRows = [...rowsForFirstTab]
  //     updatedRows[idx] = { ...updatedRows[idx], ...selectedPart }
  //     setRowsForFirstTab(updatedRows)
  //   }
  // }

  // const [bomItems, setBomItems] = useState([
  //   {
  //     partno: 'bomPart1',
  //     description: 'first',
  //     dwgrevision: 'first',
  //     material: 'first',
  //     qty: 10,
  //     unit: 'first',
  //     image: '/image/Back/bseats.png'
  //   },
  //   {
  //     partno: 'bomPart2',
  //     description: 'second',
  //     dwgrevision: 'second',
  //     material: 'second',
  //     qty: 20,
  //     unit: 'second',
  //     image: '/image/Front/seats.png'
  //   },
  //   {
  //     partno: 'sampleBombPart',
  //     description: 'first',
  //     dwgrevision: 'first',
  //     material: 'first',
  //     qty: 10,
  //     unit: 'first',
  //     image: '/image/Back/bseats.png'
  //   }
  // ])

  const [currentBomItem, setCurrentBomItem] = useState(null)

  const handleBOMSelectChange = value => {
    setCurrentBomItem(value)
    masterItemFormik?.setFieldValue('product_type', value?.product_id)
  }

  // const handleQTYChange = (event, idx) => {
  //   const updatedRows = [...selectedBomItems]
  //   updatedRows[idx] = { ...updatedRows[idx], qty: event.target.value }
  //   setSelectedBomItems(updatedRows)
  // }

  // const [category, setCategory] = useState('')
  // const [partType, setPartType] = useState('')

  // const handleCategoryChange = event => {
  //   setCategory(event.target.value)
  // }

  // const handlePartTypeChange = event => {
  //   setPartType(event.target.value)
  // }

  // const handleCreateBOM = () => {
  //   if (currentBomItem) {
  //     const filteredData = bomItems.filter(bomItem => bomItem.partno === currentBomItem)
  //     setSelectedBomItems([...selectedBomItems, filteredData[0]])
  //   }
  // }

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
      const response = fetch('/api/Diversitech/Supervisors/Addinventory/FrameList/', {
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

    // masterItemFormik?.setFieldValue('file', file)
    // console.log('file = ' + file)

    // const formData = new FormData()
    // formData.append('file', file)

    // const formData = new FormData()
    // formData.append('file', file) // Assuming 'file' is the input field name
    // console.log('formData = ' + formData)

    // fetch('/api/Diversitech/Supervisors/Addinventory/addInventory', {
    //   method: 'POST',
    //   body: formData
    // })

    // const response = await fetch('/api/Diversitech/Supervisors/Addinventory/uploadimage', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // })

    // const data = await response.json()
    // console.log(data)

    // // Handle success response here
    // toast.success(data.message, {
    //   position: toast.POSITION.TOP_RIGHT,
    //   autoClose: 1500 // Display the toast for 1.5 seconds
    // })
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

  // const [buttonImages, setButtonImages] = useState([])

  // const addNewButton = () => {
  //   const newButtonImages = [...buttonImages, '/image/Assembly']
  //   setButtonImages(newButtonImages)
  // }

  // console.log(buttonImages)

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
                          {/* <Autocomplete
                            fullWidth
                            options={variantOptions || []}
                            getOptionLabel={option => (option?.variant_desc ? option?.variant_desc : '')}
                            value={masterItemFormik?.values?.variant}
                            onChange={(event, value) => {
                              // console.log('Value variant = ' + value)
                              masterItemFormik?.setFieldValue('variant', value)
                            }}
                            renderInput={params => <TextField {...params} label='Variant' variant='outlined' />}
                          /> */}
                          {/* <Grid item xs={12} sm={6}>
                          <Autocomplete
                            options={variantOptions || []}
                            getOptionLabel={option => (option?.variant_desc ? option?.variant_desc : '')}
                            value={masterItemFormik?.values?.variant.variant_desc}
                            onChange={(event, value) => {
                              console.log('Value variant = ' + value.variant_desc)
                              masterItemFormik?.setFieldValue('variant', value.variant_desc)
                            }}
                            renderInput={params => <TextField {...params} label='Variant' variant='outlined' />}
                          /> */}
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
                          {/* <Autocomplete
                            options={modelOptions || []}
                            getOptionLabel={option => (option?.model_desc ? option?.model_desc : '')}
                            value={masterItemFormik?.values?.model}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('model', value)
                            }}
                            renderInput={params => <TextField {...params} label='Model' variant='outlined' />}
                          /> */}
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
                          {/* <Autocomplete
                            options={bsTypeOptions || []}
                            getOptionLabel={option => (option?.bs_type_desc ? option?.bs_type_desc : '')}
                            value={masterItemFormik?.values?.bs_type}
                            onChange={(event, value) => {
                              masterItemFormik?.setFieldValue('bs_type', value)
                            }}
                            renderInput={params => <TextField {...params} label='BS Type' variant='outlined' />}
                          /> */}
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
                            {partimage && <img src={partimage} alt='Image' style={{ height: '50%', width: '100%' }} />}
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
                        {image && <img src={image} alt='Front Image' style={{ height: '50%', width: '100%' }} />}
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

                        {/* <Canvas>
                          <ambientLight intensity={0.5} />
                          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                          <pointLight position={[-10, -10, -10]} /> */}
                        {/* Render 3D model here */}
                        {/* <Suspense fallback={null}>{image1 && <Model url={image1} />}</Suspense>
                        </Canvas> */}
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
