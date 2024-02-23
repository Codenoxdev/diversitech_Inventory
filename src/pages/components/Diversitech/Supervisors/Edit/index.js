import Grid from '@mui/material/Grid'

// import { useRouter } from 'next/router'
import EditPlanBuses from 'src/views/components/Diveristech/Edit/EditPlanBuses'

const ProBusInventory = () => {
  // const router = useRouter()

  // const { plan_no, item_id, plan_date } = router.query

  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <EditPlanBuses />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProBusInventory
