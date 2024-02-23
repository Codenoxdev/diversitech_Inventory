import { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Button, Card, Grid, TextField, Typography, TableSortLabel } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'

const DTableFitem = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code')
  const [inc, setInc] = useState('asc')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/Master/masteritem/')
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()

        // console.log('Data:', data)
        setRows(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching master item data:', error)
      }
    }

    fetchData()
  }, [])

  const filteredRows = rows.filter(row => row.product_type === 'PART')

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  const sortedBusPlans = filteredRows.slice().sort((a, b) => {
    const isAsc = inc === 'asc'
    if (dec === 'item_code') {
      return isAsc ? a.item_code.localeCompare(b.item_code) : b.item_code.localeCompare(a.item_code)
    }

    return 0
  })

  return (
    <>
      <Grid container alignItems='right' justifyContent='right' style={{ padding: '2px' }}>
        <Grid>
          <TextField
            style={{ width: '150px' }}
            label='Search'
            variant='standard'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{ endAdornment: <SearchIcon /> }}
          />
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>Part No</TableCell>
              <TableCell align='left'>Description</TableCell>
              {/* <TableCell align='center'>Qty</TableCell>
              <TableCell align='center'>Image</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell align='center' colSpan={6}>
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredRows.length === 0 ? (
              <TableRow>
                <TableCell align='center' colSpan={6}>
                  <Typography>No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              sortedBusPlans
                .filter(row => !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(row => (
                  <TableRow
                    key={row.item_code} // Corrected: Use 'item_code' as the key, not 'name'
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    <TableCell component='th' scope='row' align='left'>
                      <TableSortLabel
                        active={inc === 'item_code'}
                        direction={inc === 'item_code' ? inc : inc}
                        onClick={() => handleSortRequest('item_code')}
                      >
                        {row.item_code}
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align='left'>{row.item_description}</TableCell>
                    {/* <TableCell align='center'>{row.Qty}</TableCell>
                  <TableCell align='center'>
                    <img src={row.image} alt='Product' style={{ width: '100px', height: '100px' }} />
                  </TableCell> */}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default DTableFitem
