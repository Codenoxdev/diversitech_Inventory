import React, { useState, useContext } from 'react'
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

import CategoryIcon from '@mui/icons-material/Category'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import MoreVertIcon from '@mui/icons-material/MoreVert'

const MasterPage = () => {
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

  const {
    busFilteredRows,
    busSearchQuery,
    setBusSearchQuery,
    seatFilteredRows,
    seatSearchQuery,
    frameFilteredRows,
    frameSearchQuery,
    partFilteredRows,
    partSearchQuery
  } = useContext(AuthContext)

  const [busExpanded, setBusExpanded] = useState(false)
  const [seatExpanded, setSeatExpanded] = useState(false)
  const [frameExpanded, setFrameExpanded] = useState(false)
  const [partsExpanded, setPartsExpanded] = useState(false)
  const router = useRouter()

  const handleRoute = (row, view) => {
    let targetPage
    targetPage = `/components/Diversitech/Masterdata/MasterEdit/?item_id=${encodeURIComponent(
      row.item_id
    )}&product_type=${encodeURIComponent(row.product_type)}&item_code=${encodeURIComponent(row.item_code)}`

    router.push(targetPage)
  }

  const handleView = (row, view) => {
    const targetPage = `/components/Diversitech/Masterdata/MasterView/?item_id=${encodeURIComponent(
      row.item_id
    )}&product_type=${encodeURIComponent(row.product_type)}&item_code=${encodeURIComponent(row.item_code)}`

    router.push(targetPage)
  }

  const handleRouteSeat = row => {
    const targetPage = `/components/Diversitech/Masterdata/MasterSeat/?item_id=${encodeURIComponent(
      row.item_id
    )}&seat=${encodeURIComponent(row.product_type)}`

    router.push(targetPage)
  }

  const exportToExcel = Item => {
    // console.log(Item)

    const sheetNameMap = {
      BUS: 'AllBuses_data.xlsx',
      SEAT: 'AllSeats_data.xlsx',
      FRAME: 'AllFrames_data.xlsx',
      PART: 'AllParts_data.xlsx'
    }

    const mapFunction = {
      BUS: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        'Engine-Type': row.engine_type || '',
        Variant: row.variant || '',
        'BS-type': row.bs_type || '',
        Model: row.model || ''
      }),
      SEAT: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        Category: row.category || '',
        VECV: row.vecv_part_no || '',
        'Frame Number': row.frame_no || '',
        Material: row.material || '',
        Unit: row.unit || ''
      }),
      FRAME: row => ({
        'Part Number': row.item_code || '',
        VECV: row.vecv_part_no || '',
        Description: row.item_description || '',
        Category: row.category || '',
        Material: row.material || '',
        Model: row.model || '',
        Unit: row.unit || '',
        'LegPart-no': row.legpart_no || '',
        'Mtgauge Number': row.mtgauge_no || '',
        'Welding Number': row.welding_no || '',
        'DWG Number': row.dwg_division || ''
      }),
      PART: row => ({
        'Part Number': row.item_code || '',
        Description: row.item_description || '',
        Material: row.material || '',
        Unit: row.unit || '',
        'DWG Number': row.dwg_division || ''
      })
    }

    const sheetName = sheetNameMap[Item] || sheetNameMap.default
    const mapFunc = mapFunction[Item] || mapFunction.default

    let filteredBusPlans
    if (Item === 'BUS') {
      filteredBusPlans = busFilteredRows.filter(row => row.product_type === Item)
    } else if (Item === 'SEAT') {
      filteredBusPlans = seatFilteredRows.filter(row => row.product_type === Item)
    } else if (Item === 'FRAME') {
      filteredBusPlans = frameFilteredRows.filter(row => row.product_type === Item)
    } else {
      filteredBusPlans = partFilteredRows.filter(row => row.product_type === Item)
    }

    // console.log('filteredBusPlans = ' + filteredBusPlans)
    const customData = filteredBusPlans.map(mapFunc)

    const ws = XLSX.utils.json_to_sheet(customData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'InventoryData')
    XLSX.writeFile(wb, sheetName)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRow, setSelectedRow] = useState(null)

  const handleMoreVertClick = (event, row) => {
    if (selectedRow === row) {
      // Clicked on the same row again, close the dropdown
      setAnchorEl(null)
      setSelectedRow(null)
    } else {
      // Clicked on a different row, open the dropdown
      setAnchorEl(event.currentTarget)
      setSelectedRow(row)
    }
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRow(null)
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
              value={busSearchQuery}
              onChange={event => {
                setBusSearchQuery(event.target.value)
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
      <Grid container item>
        <StyledAccordion square disableGutters expanded={busExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={e => setBusExpanded(prevState => !prevState)}
          >
            <Typography variant='h5'>Bus</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container direction='column' spacing={2}>
              <Grid item>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                    <TableHead>
                      <TableRow style={{ backgroundColor: '#cdd3f8' }}>
                        <TableCell align='left'></TableCell>
                        <TableCell align='left'></TableCell>
                        <TableCell align='left'></TableCell>
                        <TableCell align='left'>Part Number</TableCell>
                        <TableCell align='left'>Description</TableCell>
                        <TableCell align='right'>Engine Type</TableCell>
                        <TableCell align='right'>Variant</TableCell>
                        <TableCell align='right'>BS Type</TableCell>
                        <TableCell align='right'>Model</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {busFilteredRows
                        .filter(
                          row =>
                            (row.item_code && row.item_code.toLowerCase().includes(busSearchQuery.toLowerCase())) ||
                            (row.item_description &&
                              row.item_description.toLowerCase().includes(busSearchQuery.toLowerCase()))
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => {
                                  handleRouteSeat(row)
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
                                  handleView(row)
                                }}
                                aria-label='Info'
                                color='primary'
                              >
                                <InfoIcon />
                              </IconButton>
                            </TableCell>
                            {/* <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                aria-label='More'
                                color='primary'
                                onClick={event => handleMoreVertClick(event, row)}
                              >
                                <EditIcon />
                              </IconButton>
                              {anchorEl && selectedRow === row && (
                                <Paper
                                  style={{
                                    position: 'reative',

                                    // top: event.clientY,
                                    // left: event.clientX,
                                    zIndex: 1000
                                  }}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      handleRoute(row, 'BOM')
                                    }}
                                  >
                                    <CategoryIcon fontSize='small' color='primary' />
                                    BOM
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() => {
                                      handleRoute(row)
                                    }}
                                  >
                                    <EditIcon fontSize='small' color='primary' />
                                    Edit
                                  </MenuItem>
                                </Paper>
                              )}
                            </TableCell> */}
                            <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => {
                                  handleRoute(row)
                                }}
                                aria-label='cancel'
                                color='primary'
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>

                            <TableCell align='left'>{row.item_code}</TableCell>
                            <TableCell align='left'>{row.item_description}</TableCell>
                            <TableCell align='right'>{row.engine_type}</TableCell>
                            <TableCell align='right'>{row.variant}</TableCell>
                            <TableCell align='right'>{row.bs_type}</TableCell>
                            <TableCell align='right'>{row.model}</TableCell>
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
      {/* Seat */}
      {seatExpanded ? (
        <Grid container item direction='row' alignItems='center' spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id='search-bar-bus'
              className='text'
              placeholder='Search..'
              value={busSearchQuery}
              onChange={event => {
                setBusSearchQuery(event.target.value)
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
      <Grid container item>
        <StyledAccordion square disableGutters expanded={seatExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={e => setSeatExpanded(prevState => !prevState)}
          >
            <Typography variant='h5'>Seat</Typography>
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
                        <TableCell align='center'>Category</TableCell>
                        <TableCell align='center'>Description</TableCell>
                        <TableCell align='center'>VCEV Number</TableCell>
                        <TableCell align='center'>Material</TableCell>
                        <TableCell align='center'>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {seatFilteredRows
                        .filter(
                          row => row.item_code && row.item_code.toLowerCase().includes(seatSearchQuery.toLowerCase())
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => {
                                  handleRouteSeat(row)
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
                                  handleView(row)
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
                                  handleRoute(row)
                                }}
                                aria-label='cancel'
                                color='primary'
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>

                            <TableCell align='center'>{row.item_code}</TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
                            <TableCell align='center'>{row.item_description}</TableCell>
                            <TableCell align='center'>{row.vecv_part_no}</TableCell>
                            <TableCell align='center'>{row.material}</TableCell>
                            <TableCell align='center'>{row.unit}</TableCell>
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
      {/* Frame */}
      {frameExpanded ? (
        <Grid container item direction='row' alignItems='center' spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id='search-bar-bus'
              className='text'
              placeholder='Search..'
              value={busSearchQuery}
              onChange={event => {
                setBusSearchQuery(event.target.value)
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
      <Grid container item>
        <StyledAccordion square disableGutters expanded={frameExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={e => setFrameExpanded(prevState => !prevState)}
          >
            <Typography variant='h5'>Frame</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction='column' spacing={2}>
              {/* <Grid container direction='row' alignItems='center' spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id='search-bar-bus'
                    className='text'
                    placeholder='Search..'
                    value={busSearchQuery}
                    onChange={event => {
                      setBusSearchQuery(event.target.value)
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
                    onClick={() => exportToExcel('FRAME')}
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
                        <TableCell align='center'>Category</TableCell>
                        <TableCell align='center'>Description</TableCell>
                        <TableCell align='center'>Material</TableCell>
                        <TableCell align='center'>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {frameFilteredRows
                        .filter(
                          row => row.item_code && row.item_code.toLowerCase().includes(frameSearchQuery.toLowerCase())
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => {
                                  handleRouteSeat(row)
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
                                  handleView(row)
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
                                  handleRoute(row)
                                }}
                                aria-label='cancel'
                                color='primary'
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align='center'>{row.item_code}</TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
                            <TableCell align='center'>{row.item_description}</TableCell>
                            <TableCell align='center'>{row.material}</TableCell>
                            <TableCell align='center'>{row.unit}</TableCell>
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

      {/* Parts */}
      {partsExpanded ? (
        <Grid container item direction='row' alignItems='center' spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              id='search-bar-bus'
              className='text'
              placeholder='Search..'
              value={busSearchQuery}
              onChange={event => {
                setBusSearchQuery(event.target.value)
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
      <Grid container item>
        <StyledAccordion square disableGutters expanded={partsExpanded}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='panel1a-content'
            id='panel1a-header'
            onClick={e => setPartsExpanded(prevState => !prevState)}
          >
            <Typography variant='h5'>Parts</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction='column' spacing={2}>
              {/* <Grid container direction='row' alignItems='center' spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id='search-bar-bus'
                    className='text'
                    placeholder='Search..'
                    value={busSearchQuery}
                    onChange={event => {
                      setBusSearchQuery(event.target.value)
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
                    onClick={() => exportToExcel('PART')}
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
                        <TableCell align='center'>Category</TableCell>
                        <TableCell align='center'>Description</TableCell>
                        <TableCell align='center'>Material</TableCell>
                        <TableCell align='center'>Unit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {partFilteredRows
                        .filter(
                          row => row.item_code && row.item_code.toLowerCase().includes(partSearchQuery.toLowerCase())
                        )
                        .map((row, index) => (
                          <TableRow key={index}>
                            <TableCell align='left' style={{ width: '2px' }}>
                              <IconButton
                                onClick={() => {
                                  handleRouteSeat(row)
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
                                  handleView(row)
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
                                  handleRoute(row)
                                }}
                                aria-label='Edit'
                                color='primary'
                              >
                                <EditIcon />
                              </IconButton>
                            </TableCell>
                            <TableCell align='center'>{row.item_code}</TableCell>
                            <TableCell align='center'>{row.category}</TableCell>
                            <TableCell align='center'>{row.item_description}</TableCell>
                            <TableCell align='center'>{row.material}</TableCell>
                            <TableCell align='center'>{row.unit}</TableCell>
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
    </Grid>
  )
}

export default MasterPage
