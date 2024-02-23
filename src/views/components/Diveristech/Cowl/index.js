import React, { useState, useEffect } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import SearchIcon from '@mui/icons-material/Search'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

const dummyData = [
  {
    item_code: '001',
    item_description: 'Dummy Item 1',
    image_url: '{"file2": "/image/cowl/c1.png"}'
  },
  {
    item_code: '002',
    item_description: 'Dummy Item 2',
    image_url: '{"file2": "/dummy_images/image2.png"}'
  },
  {
    item_code: '003',
    item_description: 'Dummy Item 3',
    image_url: '{"file2": "/dummy_images/image3.png"}'
  }
]

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

const Cowltable = ({ onPlanSelected }) => {
  const [busPlans, setBusPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dec, setDec] = useState('item_code')
  const [inc, setInc] = useState('asc')
  const [open, setOpen] = useState(false)
  const [popupPath, setPopupPath] = useState('')
  const router = useRouter()

  const handleSortRequest = property => {
    const newOrder = dec === property && inc === 'asc' ? 'desc' : 'asc'
    setInc(newOrder)
    setDec(property)
  }

  useEffect(() => {
    setBusPlans(dummyData)
    setLoading(false)
  }, [])

  const handleImageClick = row => {
    setPopupPath(JSON.parse(row.image_url).file2 || '/image/logo/unavailable.png')
    setOpen(true)
  }

  const handleFrameColumn = row => {
    const targetPage = `/components/Cowl/?item_code=${row.item_code}`

    router.push(targetPage)
  }

  return (
    <Paper>
      <ToastContainer />
      <Box
        sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant='h4' style={{ color: 'Black' }}>
            Cowl Inspection Process
          </Typography>
        </Box>
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

      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_code'}
                  direction={inc === 'item_code' ? inc : inc}
                  onClick={() => handleSortRequest('item_code')}
                >
                  Part Number
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='left'>
                <TableSortLabel
                  active={inc === 'item_description'}
                  direction={inc === 'item_description' ? inc : inc}
                  onClick={() => handleSortRequest('item_description')}
                >
                  Description
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align='right'>Image</StyledTableCell>
              <StyledTableCell align='right'></StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              busPlans.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell align='left'>{row.item_code}</StyledTableCell>
                  <StyledTableCell align='left'>{row.item_description}</StyledTableCell>
                  <StyledTableCell align='right'>
                    <img
                      alt='Paint'
                      width='50px'
                      height='50px'
                      src={JSON.parse(row.image_url).file2}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleImageClick(row)}
                    />
                  </StyledTableCell>
                  <StyledTableCell align='center' style={{ width: '2px' }}>
                    <IconButton onClick={() => handleFrameColumn(row)} aria-label='unavailable' color='primary'>
                      <PlayCircleOutlineIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <img alt='Image' width='150px' height='150px' style={{ cursor: 'pointer' }} src={popupPath} />
        </DialogContent>
      </Dialog>
    </Paper>
  )
}

export default Cowltable
