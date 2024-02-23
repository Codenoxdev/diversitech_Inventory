import Grid from '@mui/material/Grid'
import DWBusPlanView from 'src/views/components/Diveristech/Dispatch/Busplan/Busview'
import Link from 'next/link'
import Button from '@mui/material/Button'

const WbusplanView = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <DWBusPlanView />
        </Grid>
        <Grid container padding='20px' justifyContent='center' alignItems='center'>
          <Grid>
            <Link href='/components/Diversitech/Workers/Dispatch/Planview/'>
              <Button size='medium' variant='contained'>
                Back
              </Button>
            </Link>
          </Grid>
          <Grid padding='20px'>
            <Link href='/components/Diversitech/Workers/Dispatch/Planview'>
              <Button size='medium' type='submit' variant='contained'>
                Submit
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

WbusplanView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default WbusplanView
