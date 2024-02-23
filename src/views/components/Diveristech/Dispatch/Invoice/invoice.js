import React, { useState, useEffect, useRef, useContext } from 'react'
import { useRouter } from 'next/router'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import { Grid, Typography, Button, Box } from '@mui/material'
import themeConfig from 'src/configs/themeConfig'
import { AuthContext } from 'src/context/AuthContext'

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

// const CalcWrapper = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   '&:not(:last-of-type)': {
//     marginBottom: theme.spacing(2)
//   }
// }))

// const now = new Date()
// const currentMonth = now.toLocaleString('default', { month: 'short' })
// const currentDate = now.getDate()

// console.log(data.invoices[0].id)

const Invoice = props => {
  const { selectedDate } = useContext(AuthContext)
  const [Dispatchseats, setDispatchseats] = useState([])
  const Router = useRouter()
  const { dispatch_no, seats_no, dispatch_date } = Router.query
  let plan_no = dispatch_no
  const [rows, setRows] = useState([])

  const data = {
    invoices: [
      {
        id: 4987,

        // issuedDate: `${selectedDate}`,
        address: 'Vecv, Sector-i, 101-p Industrial Area, Pithampur, Dhar, Madhya Pradesh 454775',
        company: 'VE Commercial Vehicles Limited',
        companyEmail: 'abc@vecv.com',
        country: 'India',
        contact: '(+91) 11111-22222'
      }
    ]
  }

  const DispatchseatSubmit = () => {
    try {
      fetch('/api/Diversitech/Workers/Dispatch/Dispatchseats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_no, seats_no })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch data from the API')
          }

          return response.json()
        })
        .then(data => {
          setDispatchseats(data)
          setLoading(false)
        })
        .catch(error => {
          console.error(error)
        })
    } catch (error) {
      // console.error(error)
      setDispatchseats([])
    }
  }

  useEffect(() => {
    DispatchseatSubmit()
  }, [plan_no])

  const theme = useTheme()
  if (data) {
    return (
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <img
                    src='/images/Diversitech.png'
                    alt='Template Image'
                    style={{ marginRight: '10px', width: 200, height: 'auto' }}
                  />
                </Box>

                <Box>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Diversitech General Engg. Pvt. Ltd
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Plot no. 204, Pithampur Industrial Area, Sector no. 1, Pithampur, Madhya Pradesh 454775
                  </Typography>
                  <Typography variant='body2'>(+91)7292403106</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '200px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Invoice:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h6'>{`#${dispatch_no}`}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{selectedDate}</Typography>
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider
          sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(5.5)} !important` }}
        />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                Invoice To:
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoices[0].name}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoices[0].company}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoices[0].address}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoices[0].contact}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {data.invoices[0].companyEmail}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: '0 !important' }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align='left'>VECV No.</TableCell>
                <TableCell align='left'>Description</TableCell>
                <TableCell align='center'>Qty Per Bus</TableCell>
                <TableCell align='center'>Image</TableCell>
                <TableCell align='center'>Required Quantity</TableCell>
                <TableCell align='center'>Quantity</TableCell>
                <TableCell align='center'>Available Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Dispatchseats.map((row, index) => (
                <TableRow key={row.item_id}>
                  <TableCell component='th' scope='row' align='left'>
                    {row.vecv_part_no}
                  </TableCell>
                  <TableCell align='left'>{row.item_description}</TableCell>
                  <TableCell align='right'>{row.quantity}</TableCell>
                  <TableCell align='right'>
                    <img
                      alt='Dispatch'
                      width='50px'
                      src={JSON.parse(row.image_url).file2 || `/image/logo/unavailable.png`}
                      onClick={() => {
                        imagepopup(row), setpopupopen(true)
                      }}
                    />
                  </TableCell>
                  <TableCell align='right'>{row.request_quantity}</TableCell>
                  <TableCell align='right'>{row.dispatch_quantity}</TableCell>
                  <TableCell align='right'>{row.available_quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />

        <CardContent>
          <Typography variant='subtitle2' sx={{ color: 'text.primary' }}>
            <strong>Note:</strong> It was a pleasure working with you and your team. We hope you will keep us in mind
            for future freelance projects. Thank You!
          </Typography>
        </CardContent>
      </Card>
    )
  } else {
    return null
  }
}

export default Invoice
