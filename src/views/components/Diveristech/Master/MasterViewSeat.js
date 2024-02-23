import React, { useState, useEffect, useContext } from 'react'
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  Card,
  Box,
  Typography,
  TextField,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Grid,
  IconButton,
  Button
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import { AuthContext } from 'src/context/AuthContext'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import EditIcon from '@mui/icons-material/Edit'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import InfoIcon from '@mui/icons-material/Info'
import Icon from 'src/@core/components/icon'
import * as XLSX from 'xlsx'

const MasterViewSeat = () => {
  // ** Styled Components
  const StyledAccordion = styled(Accordion)(({ theme }) => ({
    width: '100%',
    '& .MuiAccordionSummary-root': {
      background: theme.palette.primary.main,
      '& .MuiTypography-root': {
        color: theme.palette.common.white
      }
    },
    '& .MuiAccordionDetails-root': {
      padding: '10px !important'
    }
  }))

  // const [tableVisibility, setTableVisibility] = useState({
  //   BUS: false,
  //   SEAT: false,
  //   FRAME: false,
  //   PART: false
  // })
  const [busExpanded, setBusExpanded] = useState(false)
  const [seatExpanded, setSeatExpanded] = useState(false)
  const [searchItem, setSearchItem] = useState('')

  // const [frameExpanded, setFrameExpanded] = useState(false)
  // const [partsExpanded, setPartsExpanded] = useState(false)
  const router = useRouter()

  const { item_id, seat } = router.query

  const [seats, setSeats] = useState([])

  const handleRoute = (row, view) => {
    // console.log('Work', row)

    let targetPage
    view === 'FRAME'
      ? (targetPage = `/components/Diversitech/Masterdata/MasterEdit/?item_id=${encodeURIComponent(
          row.frame_item_id
        )}&product_type=${encodeURIComponent(view)}&item_code=${encodeURIComponent(row.item_code)}`)
      : (targetPage = `/components/Diversitech/Masterdata/MasterEdit/?item_id=${encodeURIComponent(
          row.seat_item_id
        )}&product_type=${encodeURIComponent(view)}&item_code=${encodeURIComponent(row.item_code)}`)

    router.push(targetPage)
  }

  const handleView = (row, view) => {
    // console.log(row)
    let targetPage
    view === 'FRAME'
      ? (targetPage = `/components/Diversitech/Masterdata/MasterView/?item_id=${encodeURIComponent(
          row.frame_item_id
        )}&product_type=${encodeURIComponent(view)}&item_code=${encodeURIComponent(row.item_code)}`)
      : (targetPage = `/components/Diversitech/Masterdata/MasterView/?item_id=${encodeURIComponent(
          row.seat_item_id
        )}&product_type=${encodeURIComponent(view)}&item_code=${encodeURIComponent(row.item_code)}`)
    router.push(targetPage)
  }

  const handleRouteSeat = (row, data) => {
    const targetPage = `/components/Diversitech/Masterdata/MasterSeat/?item_id=${encodeURIComponent(
      row.seat_item_id
    )}&seat=${encodeURIComponent(data)}`

    router.push(targetPage)
  }

  useEffect(() => {
    try {
      const response = fetch('/api/Master/masterseat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ item_id, seat })
      })
        .then(response => response.json())
        .then(data => {
          // console.log('Check=' + data)
          setSeats(data)

          // setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      console.error(error)
      setSeats([])

      // setLoading(false)
    }
  }, [item_id])

  const exportToExcel = Item => {
    // console.log(Item)

    const sheetNameMap = {
      BUS: 'AllBuses_data.xlsx',
      SEAT: 'AllSeats_data.xlsx',
      FRAME: 'AllFrames_data.xlsx',
      default: 'AllParts_data.xlsx'
    }

    const mapFunction = {
      BUS: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        Category: row.category || '',
        VECV: row.vecv_part_no || '',
        'Frame Number': row.frame_no || '',
        Material: row.seat_material || '',
        Unit: row.seat_unit || '',
        Model: row.model || '',
        'LegPart-no': row.legpart_no || '',
        'Mtgauge Number': row.mtgauge_no || '',
        'Welding Number': row.welding_no || '',
        'DWG Number': row.dwg_division || '',
        Quanity: row.quantity || ''
      }),

      // SEAT: row => ({
      //   'Part Number': row.item_code || '',
      //   Description: row.item_description || '',

      // }),
      FRAME: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        Material: row.seat_material || '',
        Unit: row.seat_unit || '',
        'DWG Number': row.dwg_division || '',
        Quanity: row.quantity || ''
      }),

      default: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        Material: row.seat_material || '',
        Unit: row.seat_unit || '',
        'DWG Number': row.dwg_division || ''
      })
    }

    const sheetName = sheetNameMap[Item] || sheetNameMap.default
    const mapFunc = mapFunction[Item] || mapFunction.default

    // console.log('filteredBusPlans = ', seats)

    const filteredBusPlans = seats.filter(row => row.product_type === Item)

    // console.log('filteredBusPlans = ', filteredBusPlans)
    const customData = filteredBusPlans.map(mapFunc)

    const ws = XLSX.utils.json_to_sheet(customData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'InventoryData')
    XLSX.writeFile(wb, sheetName)
  }

  return (
    <Grid container spacing={2}>
      {busExpanded ? (
        <Grid container item direction='row' alignItems='center' spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id='search-bar-bus'
              className='text'
              placeholder='Search..'
              value={searchItem}
              onChange={event => {
                setSearchItem(event.target.value)
              }}
              variant='outlined'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => exportToExcel('BUS')}
              color='secondary'
              variant='outlined'
              startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      ) : null}
      {seat === 'BUS' ? (
        <Grid container item>
          <StyledAccordion square disableGutters expanded={busExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setBusExpanded(prevState => !prevState)}
            >
              <Typography variant='h5'>Seats</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                <Grid item>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#cdd3f8' }}>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>Part Number</TableCell>
                          <TableCell align='center'>Description</TableCell>
                          <TableCell align='center'>Frame number</TableCell>
                          <TableCell align='center'>Vecv Number</TableCell>
                          <TableCell align='center'>Material</TableCell>
                          <TableCell align='center'>unit</TableCell>
                          <TableCell align='center'>Per Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seats
                          .filter(
                            row =>
                              (row.item_code && row.item_code.toLowerCase().includes(searchItem.toLowerCase())) ||
                              (row.item_description &&
                                row.item_description.toLowerCase().includes(searchItem.toLowerCase()))
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              {/* {console.log(row)} */}
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRouteSeat(row, 'SEAT')
                                  }}
                                  aria-label='Edit'
                                  color='primary'
                                >
                                  <RemoveRedEyeIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleView(row, 'SEAT')
                                  }}
                                  aria-label='Info'
                                  color='primary'
                                >
                                  <InfoIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                {/* <IconButton aria-label='cancel' color='primary'> */}
                                <IconButton
                                  onClick={() => {
                                    handleRoute(row, 'SEAT')
                                  }}
                                  aria-label='cancel'
                                  color='primary'
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>

                              <TableCell align='center'>{row.item_code}</TableCell>
                              <TableCell align='center'>{row.item_description}</TableCell>
                              <TableCell align='center'>{row.frame_no}</TableCell>
                              <TableCell align='center'>{row.vecv_part_no}</TableCell>
                              <TableCell align='center'>{row.seat_material}</TableCell>
                              <TableCell align='center'>{row.seat_unit}</TableCell>
                              <TableCell align='center'>{row.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </StyledAccordion>
        </Grid>
      ) : null}
      {/* Seat */}
      {seatExpanded ? (
        <Grid container item direction='row' alignItems='center' spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id='search-bar-bus'
              className='text'
              placeholder='Search..'
              value={searchItem}
              onChange={event => {
                setSearchItem(event.target.value)
              }}
              variant='outlined'
              size='small'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
            <Button
              onClick={() => exportToExcel('BUS')}
              color='secondary'
              variant='outlined'
              startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      ) : null}
      {seat != 'FRAME' && seat !== 'PART' && (
        <Grid container item>
          <StyledAccordion square disableGutters expanded={seatExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setSeatExpanded(prevState => !prevState)}
            >
              <Typography variant='h5'>Frames</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                {/* <Grid container direction='row' alignItems='center' spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id='search-bar-bus'
                      className='text'
                      placeholder='Search..'
                      value={searchItem}
                      onChange={event => {
                        setSearchItem(event.target.value)
                      }}
                      variant='outlined'
                      size='small'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
                    <Button
                      onClick={() => exportToExcel('BUS')}
                      color='secondary'
                      variant='outlined'
                      startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
                    >
                      Export
                    </Button>
                  </Grid>
                </Grid> */}
                <Grid item>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#cdd3f8' }}>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>Part Number</TableCell>
                          <TableCell align='center'>Description</TableCell>
                          <TableCell align='center'>VECV Number</TableCell>
                          <TableCell align='center'>Material</TableCell>
                          <TableCell align='center'>Unit</TableCell>
                          <TableCell align='center'>Per Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seats
                          .filter(
                            row =>
                              (row.item_code && row.item_code.toLowerCase().includes(searchItem.toLowerCase())) ||
                              (row.item_description &&
                                row.item_description.toLowerCase().includes(searchItem.toLowerCase()))
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRouteSeat(row, 'FRAME')
                                  }}
                                  aria-label='Edit'
                                  color='primary'
                                >
                                  <RemoveRedEyeIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleView(row, 'FRAME')
                                  }}
                                  aria-label='Info'
                                  color='primary'
                                >
                                  <InfoIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRoute(row, 'FRAME')
                                  }}
                                  aria-label='Edit'
                                  color='primary'
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>

                              <TableCell align='center'>{row.frame_no}</TableCell>
                              <TableCell align='center'>{row.frame_item_description}</TableCell>
                              <TableCell align='center'>{row.vecv_part_no}</TableCell>
                              <TableCell align='center'>{row.frame_material}</TableCell>
                              <TableCell align='center'>{row.frame_unit}</TableCell>
                              <TableCell align='center'>{row.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </StyledAccordion>
        </Grid>
      )}

      {seat === 'FRAME' ? (
        <Grid container item>
          <StyledAccordion square disableGutters expanded={seatExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setSeatExpanded(prevState => !prevState)}
            >
              <Typography variant='h5'>Parts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                <Grid item>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#cdd3f8' }}>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>Part Number</TableCell>
                          <TableCell align='center'>Description</TableCell>
                          <TableCell align='center'>Material</TableCell>
                          <TableCell align='center'>Unit</TableCell>
                          <TableCell align='center'>Drawing Number</TableCell>
                          <TableCell align='center'>Per Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seats
                          .filter(
                            row =>
                              (row.item_code && row.item_code.toLowerCase().includes(searchItem.toLowerCase())) ||
                              (row.item_description &&
                                row.item_description.toLowerCase().includes(searchItem.toLowerCase()))
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRouteSeat(row, 'PART')
                                  }}
                                  aria-label='Edit'
                                  color='primary'
                                >
                                  <RemoveRedEyeIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleView(row, 'PART')
                                  }}
                                  aria-label='Info'
                                  color='primary'
                                >
                                  <InfoIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRoute(row, 'FRAME')
                                  }}
                                  aria-label='cancel'
                                  color='primary'
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='center'>{row.item_code}</TableCell>
                              <TableCell align='center'>{row.item_description}</TableCell>
                              <TableCell align='center'>{row.seat_material}</TableCell>
                              <TableCell align='center'>{row.seat_unit}</TableCell>
                              <TableCell align='center'>{row.dwg_division}</TableCell>
                              <TableCell align='center'>{row.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </StyledAccordion>
        </Grid>
      ) : null}

      {seat === 'PART' ? (
        <Grid container item>
          <StyledAccordion square disableGutters expanded={seatExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls='panel1a-content'
              id='panel1a-header'
              onClick={e => setSeatExpanded(prevState => !prevState)}
            >
              <Typography variant='h5'>SUB-Parts</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container direction='column' spacing={2}>
                <Grid item>
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                      <TableHead>
                        <TableRow style={{ backgroundColor: '#cdd3f8' }}>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>Part Number</TableCell>
                          <TableCell align='center'>Description</TableCell>
                          <TableCell align='center'>Material</TableCell>
                          <TableCell align='center'>Unit</TableCell>
                          <TableCell align='center'>Drawing Number</TableCell>
                          <TableCell align='center'>Per Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {seats
                          .filter(
                            row =>
                              (row.item_code && row.item_code.toLowerCase().includes(searchItem.toLowerCase())) ||
                              (row.item_description &&
                                row.item_description.toLowerCase().includes(searchItem.toLowerCase()))
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRouteSeat(row, 'PART')
                                  }}
                                  aria-label='Edit'
                                  color='primary'
                                >
                                  <RemoveRedEyeIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='left' style={{ width: '2px' }}>
                                <IconButton
                                  onClick={() => {
                                    handleRoute(row, 'PART')
                                  }}
                                  aria-label='cancel'
                                  color='primary'
                                >
                                  <EditIcon />
                                </IconButton>
                              </TableCell>
                              <TableCell align='center'>{row.item_code}</TableCell>
                              <TableCell align='center'>{row.item_description}</TableCell>
                              <TableCell align='center'>{row.seat_material}</TableCell>
                              <TableCell align='center'>{row.seat_unit}</TableCell>
                              <TableCell align='center'>{row.dwg_division}</TableCell>
                              <TableCell align='center'>{row.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </AccordionDetails>
          </StyledAccordion>
        </Grid>
      ) : null}
    </Grid>
  )
}

export default MasterViewSeat
