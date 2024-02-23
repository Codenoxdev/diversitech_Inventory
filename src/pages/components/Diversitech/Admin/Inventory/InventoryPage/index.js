import { styled, useTheme } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import { CardContent, TableContainer, TextField } from '@mui/material'
import Link from 'next/link'
import { Card, Typography, Grid, Box, Dialog, DialogTitle, DialogContent, Button } from '@mui/material'
import { useRouter } from 'next/router'
import TableSortLabel from '@mui/material/TableSortLabel'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import SearchIcon from '@mui/icons-material/Search'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as XLSX from 'xlsx'
import Icon from 'src/@core/components/icon'

const InventoryPage = () => {
  // const theme = useTheme()

  const [busPlans, setBusPlans] = useState([])
  const [open, setopen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'item_code', direction: 'asc' })
  const [popuppath, setpopuppath] = useState('')

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

  const handleSortRequest = property => {
    const direction = sortConfig.key === property && sortConfig.direction === 'asc' ? 'dec' : 'asc'
    setSortConfig({ key: property, direction: direction })
  }

  const sortedBusPlans = [...busPlans].sort((a, b) => {
    const isAsc = sortConfig.direction === 'asc'

    if (sortConfig.key === 'item_code') {
      return isAsc ? a.item_code?.localeCompare(b.item_code) || 0 : b.item_code?.localeCompare(a.item_code) || 0
    }
    if (sortConfig.key === 'product_type') {
      return isAsc
        ? a.product_type?.toString()?.localeCompare(b.product_type?.toString()) || 0
        : b.product_type?.toString()?.localeCompare(a.product_type?.toString()) || 0
    }
    if (sortConfig.key === 'item_description') {
      return isAsc
        ? a.item_description?.localeCompare(b.item_description) || 0
        : b.item_description?.localeCompare(a.item_description) || 0
    }

    // Handle other columns if needed.
    return 0
  })

  useEffect(() => {
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

      setLoading(false)
    } catch (error) {
      console.error('Error:', error)

      setBusPlans([])
      setLoading(false)
    }
  }

  const imagepopup = row => {
    // console.log('row.image_url' + row.image_url + 'row.item_code ' + row.item_code)

    row.product_type === 'PART'
      ? setpopuppath(JSON.parse(row.image_url).partimage0)
      : setpopuppath(JSON.parse(row.image_url).file2)
  }

  const exportToExcel = () => {
    const filteredBusPlans = busPlans.filter(row => row.product_type !== 'BUS')

    const customData = filteredBusPlans.map(row => ({
      'Part Number': row.item_code || '',
      Description: row.item_description || '',
      Type: row.product_type || '',
      'Available Quantity': row.available_quantity || ''
    }))
    const ws = XLSX.utils.json_to_sheet(customData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'InventoryData')
    XLSX.writeFile(wb, 'inventory_data.xlsx')
  }

  return (
    <Card>
      <CardContent>
        <Grid item xs={12} md={6}>
          <Grid>
            <Typography variant='h5' sx={{ mb: 4.5 }}>
              Welcome{' '}
              <Box component='span' sx={{ fontWeight: 'bold' }}>
                Admin
              </Box>
              ! 🎉
            </Typography>
          </Grid>
          <Box
            sx={{
              p: 5,
              pb: 3,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Button
              sx={{ mr: 4, mb: 2 }}
              onClick={exportToExcel}
              color='secondary'
              variant='outlined'
              startIcon={<Icon icon='mdi:export-variant' fontSize={20} />}
            >
              Export
            </Button>

            <Typography style={{ fontWeight: 'bold' }} variant='h5' sx={{ mb: 4.5 }}>
              Stock Summary
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                style={{ width: '150px' }}
                label='Search'
                variant='standard'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                InputProps={{ endAdornment: <SearchIcon /> }}
              />
            </Box>
          </Box>
        </Grid>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={sortConfig.direction === 'item_code'}
                    direction={sortConfig.direction === 'item_code' ? sortConfig.direction : sortConfig.direction}
                    onClick={() => handleSortRequest('item_code')}
                  >
                    Part Number
                  </TableSortLabel>
                </StyledTableCell>

                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={sortConfig.direction === 'item_description'}
                    direction={
                      sortConfig.direction === 'item_description' ? sortConfig.direction : sortConfig.direction
                    }
                    onClick={() => handleSortRequest('item_description')}
                  >
                    Description
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='left'>
                  <TableSortLabel
                    active={sortConfig.direction === 'product_type'}
                    direction={sortConfig.direction === 'product_type' ? sortConfig.direction : sortConfig.direction}
                    onClick={() => handleSortRequest('product_type')}
                  >
                    Type
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell align='right'>Available Quantity</StyledTableCell>
                <StyledTableCell align='right'>Image</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={6}>
                    <Typography>Loading...</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : busPlans.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell align='center' colSpan={6}>
                    <Typography>No data available</Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                sortedBusPlans
                  .filter(
                    row => row.product_type !== 'BUS' // Exclude rows where product_type is 'BUS'
                  )
                  .map((row, index) =>
                    !searchTerm ||
                    (row.item_code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                    (row.product_type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ? (
                      <StyledTableRow key={index}>
                        {/* {console.log(row.image_url + '=================')} */}
                        <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                        <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                        <StyledTableCell align='left'>{row.product_type}</StyledTableCell>
                        <StyledTableCell align='right'>{row.available_quantity}</StyledTableCell>
                        {/* {console.log(row.image_url)} */}
                        {row.image_url ? (
                          <StyledTableCell align='right'>
                            <img
                              alt={`Image`}
                              width='50px'
                              height='50px'
                              style={{ cursor: 'pointer' }}
                              src={
                                row.product_type === 'PART'
                                  ? JSON.parse(row.image_url).partimage0 || '/image/logo/unavailable.png'
                                  : JSON.parse(row.image_url).file2 || '/image/logo/unavailable.png'
                              }
                              onError={e => {
                                e.target.src = '/image/logo/unavailable.png'
                              }}
                              onClick={() => {
                                imagepopup(row), setopen(true)
                              }}
                            />
                            {/* ))} */}

                            {/* )} */}
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell align='right'>
                            <img
                              alt='Image'
                              width='50px'
                              height='50px'
                              style={{ cursor: 'pointer' }}
                              src={`/image/logo/unavailable.png`}

                              // onClick={() => {
                              //   imagepopup(row), setopen(true)
                              // }}
                            />
                            {/* )} */}
                          </StyledTableCell>
                        )}
                        {/* {console.log('check_image' + JSON.parse(row.image_url).file)} */}
                      </StyledTableRow>
                    ) : null
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={() => setopen(false)}>
          <DialogContent>
            <img
              alt='Image'
              width='150px'
              height='150px'
              style={{ cursor: 'pointer' }}
              src={`${popuppath}` || `/image/logo/unavailable.png`}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

InventoryPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default InventoryPage
