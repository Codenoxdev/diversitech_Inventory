import Grid from '@mui/material/Grid'

import WDTable from 'src/views/components/Diveristech/Dispatch/SeatsDispatch/Dispatchseats'

const WDisPlanView = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <WDTable />
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
