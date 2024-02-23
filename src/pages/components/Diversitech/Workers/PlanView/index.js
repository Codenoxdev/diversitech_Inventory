import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import AllPlansView from 'src/views/components/Diveristech/Planview/Worker/Planview'

const Plans = () => {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid
          item
          xs={12}
          alignItems='center'
          justifyContent='center'
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <AllPlansView />
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

Plans.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Plans
