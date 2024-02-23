import Grid from '@mui/material/Grid'
import { Link, Button } from '@mui/material'

// import { useRouter } from 'next/router'
import InventoryProduction from 'src/views/components/InventoryPlans/Productionplan/PBusInventory'

const ProBusInventory = () => {
  // const router = useRouter()
  // const { plan_no, item_id, plan_date } = router.query

  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <InventoryProduction />
        </Grid>
        <Grid container alignItems='center' justifyContent='center' style={{ padding: '20px' }}>
          <Link href='/components/Diversitech/Supervisors/PlanView/Production/'>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

ProBusInventory.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ProBusInventory
