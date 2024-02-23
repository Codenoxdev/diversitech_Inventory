import Grid from '@mui/material/Grid'
import DisPlansView from 'src/views/components/Diveristech/Dispatch/PlanView/Planview'
import Link from 'next/link'

import Button from '@mui/material/Button'

const WDisPlanView = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            padding='20px'
            alignItems='center'
            justifyContent='center'
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <DisPlansView />
          </Grid>
        </Grid>
        <Grid container justifyContent='center' alignItems='center'>
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

WDisPlanView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default WDisPlanView
