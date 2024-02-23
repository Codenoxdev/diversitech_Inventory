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
  TableCell
} from '@mui/material'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const MasterView = () => {
  const [busPlans, setBusPlans] = useState([])
  const [SelectPart, setSelectPart] = useState(null)
  const [open, setopen] = useState(false)
  const router = useRouter()
  const { item_id, product_type } = router.query

  const activeOptions = [
    { active_id: '1', active_desc: 'Yes' },
    { active_id: '0', active_desc: 'No' }
  ]

  // const unitOptions = [
  //   { unit_id: 'EA', unit: 'Each' },
  //   { unit_id: 'KG', unit: 'KG' },
  //   { unit_id: 'L', unit: 'Litre' },
  //   { unit_id: 'M', unit: 'Meter' }
  // ]

  // const categoryOptions = [
  //   { category_id: 'FG', category_desc: 'FG' },
  //   { category_id: 'WIP', category_desc: 'WIP' },
  //   { category_id: 'RM', category_desc: 'RM' }
  // ]
  const [item_code, setItem_code] = useState(null)

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
        // console.log('data = ' + data[0].item_code)
        setItem_code(data[0].item_code)
        setBusPlans(data)
      })
      .catch(error => {
        console.error(error)
        setBusPlans([])
      })
  }, [item_id, product_type])

  const [image, setimage] = useState(null)
  const [image1, setimage1] = useState(null)
  const [image2, setimage2] = useState(null)
  const [file, setFile] = useState(null)
  const [partimage, setpartimage] = useState(null)
  const [partimagefile, setpartimagefile] = useState(null)

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
                View
              </Typography>
            </Grid>

            {product_type ? (
              <Grid container item>
                <form onSubmit={e => e.preventDefault()}>
                  <CardContent>
                    <Grid container spacing={2}>
                      {busPlans.map((row, index) => (
                        <Grid item xs={12} key={index}>
                          <Grid container spacing={5}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label='Item Code'
                                placeholder='Item Code'
                                value={row.item_code}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label='Item Description'
                                placeholder='Item Description'
                                value={row.item_description}
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
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Variant'
                                    placeholder='Variant'
                                    value={row.variant}
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Model'
                                    placeholder='Model'
                                    value={row.model}
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='BS Type'
                                    placeholder='BS Type'
                                    value={row.bs_type}
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label='Frame No.'
                                    placeholder='Frame No.'
                                    value={row.frame_no}
                                    InputProps={{ readOnly: true }}
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
                                  InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                  InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
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
                                    InputProps={{ readOnly: true }}
                                  />
                                </Grid>
                              </>
                            )}
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                value={row.active === 1 ? 'Active' : 'InActive'}
                                InputProps={{ readOnly: true }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            </Grid>
                            {product_type == 'PART' && (
                              <>
                                <Grid container item xs={12} spacing={2} marginTop={2}>
                                  <Grid item xs={12} sm={3}>
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
                                  />
                                )}
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                {image1 ? (
                                  <img
                                    src={image1}
                                    alt={`Image`}
                                    style={{ height: '50%', width: '100%' }}
                                    onError={e => {
                                      e.target.src = '/image/logo/unavailable.png'
                                    }}
                                  />
                                ) : JSON.parse(row.image_url).file1 ? (
                                  <img
                                    src={JSON.parse(row.image_url).file1}
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
                              <Grid item xs={12} sm={3}>
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

MasterView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default MasterView
