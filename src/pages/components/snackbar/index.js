import Grid from '@mui/material/Grid'
import SupervisorsLanding from 'src/views/components/Diveristech/Landingpage/supervisors/Landing'

const Snackbar = () => {
  return (
    <Grid container className='match-height'>
      <Grid item xs={12}>
        <SupervisorsLanding />
      </Grid>
    </Grid>
  )
}

Snackbar.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Snackbar
