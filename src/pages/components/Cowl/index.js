// ** React Imports
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import CowlImg from 'src/views/components/Diveristech/Cowl/CowlImage/cowlimg'

const Cowl = () => {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12}>
          <CowlImg />
        </Grid>
      </Grid>
      {/* <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href='/components/Diversitech/Workers/Cowl/'>
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid> */}
    </Grid>
  )
}

Cowl.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Cowl
