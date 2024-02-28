// ** React Imports
import { Fragment, useContext, useState } from 'react'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'

import { Card, CardContent } from '@mui/material'
import { AuthContext } from 'src/context/AuthContext'

const useStyles = makeStyles({
  img: {
    transition: '.5s ease',

    '&:hover': {
      opacity: 0.5,

      transform: 'scale(1.2)'
    }
  }
})

const WorkerLanding = () => {
  const classes = useStyles()
  const { selectedDate } = useContext(AuthContext)

  return (
    <Card>
      <CardContent>
        <Grid item xs={12} alignItems='center' justifyItems='center'>
          Date:- {selectedDate}
        </Grid>
        <Grid
          container
          spacing={6}
          alignItems='center'
          justifyContent='center'
          style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}
        >
          <Grid>
            <Link href='#'>
              <img alt='diversitech' src={`/image/Chair.png`} />
            </Link>
          </Grid>

          <Grid item xs={12} md={4}>
            <Link href='#'>
              <img alt='diversitech' width='400' height='100' src={`/image/logo.png`} />
            </Link>

            <Typography sx={{ mb: 4 }}>Enterprise Resource Planning</Typography>
          </Grid>
        </Grid>

        <Grid container spacing={2} alignItems='center' justifyContent='center'>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/PlanView'>
              <img
                label='navbar-frame'
                alt='navbar-frame'
                title='Frame'
                width='120px'
                height='120px'
                src='/image/Worker/Frame.png'
                className={classes.img}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/PlanView/'>
              <img
                label='navbar-paint'
                alt='Paint'
                title='Paint'
                width='100px'
                height='100px'
                src='/image/Worker/Paint.png'
                className={classes.img}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/PlanView/'>
              <img
                label='navbar-assembly'
                alt='Assembly'
                title='Assembly'
                width='100px'
                height='100px'
                src='/image/Worker/Assembly.png'
                className={classes.img}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/PlanView/'>
              <img
                label='navbar-quality-check'
                alt='Quality'
                title='Quality'
                width='100px'
                height='100px'
                src='/image/Worker/Quality.png'
                className={classes.img}
              />
            </Link>
          </Grid>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/Dispatch/Planview'>
              <img
                label='navbar-dispatch'
                alt='Dispatch'
                title='Dispatch'
                width='140px'
                height='100px'
                src='/image/Worker/Dispatch.png'
                className={classes.img}
              />
            </Link>
          </Grid>

          {/* <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Workers/Cowl'>
              <img
                label='navbar-cowl'
                alt='Cowl'
                title='Cowl'
                width='140px'
                height='100px'
                src='/image/Worker/cowl.png'
                className={classes.img}
              />
            </Link>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  )
}

WorkerLanding.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default WorkerLanding
