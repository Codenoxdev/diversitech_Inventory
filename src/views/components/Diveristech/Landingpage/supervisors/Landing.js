// ** React Imports
import { Fragment, useContext, useState } from 'react'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@material-ui/core/styles'
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

const SupervisorsLanding = () => {
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

        <Grid container spacing={5} alignItems='center' justifyContent='center'>
          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Supervisors/Inventory'>
              <img
                alt='Inventory'
                title='Inventory'
                width='200'
                height='200'
                src={`/image/Super/Inventory.png`}
                className={classes.img}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Supervisors/PlanView/Production/'>
              <img
                alt='Planning'
                width='200'
                height='200'
                title='Planning'
                src={`/image/Super/Planning.png`}
                className={classes.img}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Supervisors/PlanView/Dispatch/'>
              <img
                alt='Dispatch'
                width='200'
                title='Dispatch'
                height='200'
                src={`/image/Super/Dispatch.png`}
                className={classes.img}
              />
            </Link>
          </Grid>

          <Grid item xs={12} md={2}>
            <Link href='/components/Diversitech/Supervisors/AddInventory'>
              <img
                alt='Add Part'
                title='Add Part'
                width='150'
                height='120'
                style={{ marginBottom: '80px' }}
                src={`/image/Super/NewProd.png`}
                className={classes.img}
              />
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default SupervisorsLanding
