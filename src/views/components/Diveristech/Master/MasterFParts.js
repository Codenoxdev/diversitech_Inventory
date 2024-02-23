import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { Button, Card } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

const createData = (PartNo, Description, Qty, Img) => {
  return { PartNo, Description, Qty, Img }
}

const MasterFParts = () => {
  const [rows, setRows] = useState([
    createData('S100F01039', 'Hex Bolt M8x20mmL Trivalent Plating For SCB Plywood', 50, '/image/SeatsAssembly/1.png')
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [UpdateState, setUpdateState] = useState(-1)
  const [data, setData] = useState(createData)
  const router = useRouter()

  const handleDeleteRow = index => {
    setRows(prevRows => prevRows.filter((row, i) => i !== index))
  }

  const handleChange = event => {
    const { name, value } = event.target
    setData({ ...data, [name]: value })
  }

  const handleImageClick = img => {
    // Navigate to the new image details page
    router.push(img)
  }

  return (
    <Card>
      <TextField
        id='search-bar'
        className='text'
        placeholder='Enter a Part No'
        value={searchQuery}
        onChange={event => setSearchQuery(event.target.value)}
        variant='outlined'
        size='small'
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Part No</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Qty Parts</TableCell>
              <TableCell>Image</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .filter(row => row.PartNo.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((row, index) =>
                UpdateState === row.PartNo ? (
                  <TableRow key={index}>
                    <TableCell align='right'>
                      <TextField
                        style={{ width: '150px' }}
                        id='part-no'
                        className='text'
                        placeholder='Enter a Part No'
                        value={data.PartNo}
                        name='PartNo'
                        variant='outlined'
                        size='small'
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <TextField
                        id='description'
                        className='text'
                        placeholder='Enter a description'
                        value={data.Description}
                        name='Description'
                        variant='outlined'
                        size='small'
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <TextField
                        id='qty'
                        className='text'
                        placeholder='Enter a Qty'
                        value={data.Qty}
                        name='Qty'
                        variant='outlined'
                        size='small'
                        onChange={handleChange}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      {/* Use onClick to handle image click */}
                      <img
                        src={row.Img}
                        alt='Image'
                        style={{ cursor: 'pointer', width: '70px', height: '50px' }}
                        onClick={() => handleImageClick(row.Img)}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <img
                        src={`/image/logo/update.png`}
                        alt='Image'
                        style={{ cursor: 'pointer', width: '80px', height: '60px' }}
                        onClick={() => setUpdateState(row.FretCode)}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={index}>
                    <TableCell align='right'>{row.PartNo}</TableCell>
                    <TableCell align='right'>{row.Description}</TableCell>
                    <TableCell align='right'>{row.Qty}</TableCell>
                    <TableCell align='right'>
                      {/* Use onClick to handle image click */}
                      <img
                        src={row.Img}
                        alt='Image'
                        style={{ cursor: 'pointer', width: '70px', height: '50px' }}
                        onClick={() => handleImageClick(row.Img)}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <img
                        src={`/image/logo/edit.png`}
                        alt='Image'
                        style={{ cursor: 'pointer', width: '50px', height: '30px' }}
                        onClick={() => setUpdateState(row.PartNo)}
                      />
                    </TableCell>
                    <TableCell align='right'>
                      <img
                        src={`/image/logo/delete.png`}
                        alt='Image'
                        style={{ cursor: 'pointer', width: '50px', height: '30px' }}
                        onClick={() => handleDeleteRow(index)}
                      />
                    </TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default MasterFParts
