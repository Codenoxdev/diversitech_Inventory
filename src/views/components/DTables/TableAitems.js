import { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Grid, TextField, Typography, TableSortLabel } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useRouter } from 'next/router'

const DTableAitem = () => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code')
  const [inc, setInc] = useState('asc')
  const router = useRouter()
  const { seat_id } = router.query

  useEffect(() => {
    fetch(`/api/Diversitech/Workers/Assembly/SeatPart/?seat_id=${seat_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        // console.log('Data:', data)
        setRows(data)
        setLoading(false) // Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false) // Set loading to false in case of an error
      })
  }, [seat_id])

  const filteredRows = rows.filter(row => row.product_type === 'PART')

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

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
              <TableCell align='left'>Image</TableCell>
              <TableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Part No
                </TableSortLabel>
              </TableCell>
              <TableCell align='left'>Description</TableCell>
              <TableCell align='right'>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell align='center' colSpan={2}>
                  <Typography>Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell align='center' colSpan={2}>
                  <Typography>No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows
                .filter(row => !searchTerm || row.item_code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(row => (
                  <TableRow
                    key={row.item_code}
                    sx={{
                      '&:last-of-type td, &:last-of-type th': {
                        border: 0
                      }
                    }}
                  >
                    {' '}
                    {/* {console.log(row.item_code)} */}
                    <TableCell align='left'>
                      {/* {console.log(`${row.image_url}${row.item_code}.png`)} */}
                      {row.seat_img_url === JSON.parse(row.seat_img_url).partimage ? (
                        <img
                          alt='Image'
                          width='50px'
                          height='50px'
                          style={{ cursor: 'pointer' }}
                          src={JSON.parse(row.seat_img_url).partimage}
                          onError={e => {
                            e.target.src = '/image/logo/unavailable.png' // Provide the path to your default image
                          }}
                          onClick={() => {
                            imagepopup(row), setopen(true)
                          }}
                        />
                      ) : (
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
                      )}
                      {/* <img
                        alt='Image'
                        width='50px'
                        height='50px'
                        style={{ cursor: 'pointer' }}
                        src={`${row.image_url}${row.item_code}.png`}
                        onClick={() => {
                          imagepopup(row), setopen(true)
                        }}
                      /> */}
                    </TableCell>
                    <TableCell component='th' scope='row' align='left'>
                      {row.item_code}
                    </TableCell>
                    <TableCell align='left'>{row.item_description}</TableCell>
                    <TableCell align='right'>{row.quantity}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default DTableAitem
