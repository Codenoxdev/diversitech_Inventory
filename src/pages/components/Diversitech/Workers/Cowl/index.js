import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import Cowltable from 'src/views/components/Diveristech/Cowl'

const Cowl = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <Cowltable />
        </Grid>
        <Grid container padding='20px' justifyContent='center' alignItems='center'>
          <Link href='/components/Wdashboard/'>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

Cowl.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Cowl
