import Grid from '@mui/material/Grid'
import PlanningDispatch from 'src/views/components/Diveristech/Dispatch/SPlanning/Dispatchplan'

const Dispatch = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <PlanningDispatch />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Dispatch
