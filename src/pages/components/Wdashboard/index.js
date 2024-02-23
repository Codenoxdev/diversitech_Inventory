import Grid from '@mui/material/Grid'
import WorkerLanding from 'src/views/components/Diveristech/Landingpage/Worker/Landing'

const Wdashboard = () => {
  return (
    <Grid container className='match-height'>
      <Grid item xs={12}>
        <WorkerLanding />
      </Grid>
    </Grid>
  )
}

Wdashboard.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Wdashboard
