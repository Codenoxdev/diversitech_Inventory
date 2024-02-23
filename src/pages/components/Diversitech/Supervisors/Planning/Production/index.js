import Grid from '@mui/material/Grid'
import PlanningProduction from 'src/views/components/Diveristech/Production/SPlanning/Productionplan'

const Production = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <PlanningProduction />
        </Grid>
      </Grid>
    </Grid>
  )
}

Production.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Production
