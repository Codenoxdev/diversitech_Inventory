import React from 'react'
import Grid from '@mui/material/Grid'
import MainInventory from 'src/views/Inventory/InventoryTable'
import { Link, Button } from '@mui/material'
import { useRouter } from 'next/router'

const MInventory = () => {
  const router = useRouter()
  const { plan_no, item_id, plan_date } = router.query

  return (
    <Grid container spacing={5} className='match-height'>
      <Grid item xs={12}>
        <MainInventory />
      </Grid>
      <Grid container alignItems='center' justifyContent='center' style={{ padding: '20px' }}>
        <Link
          href={`/components/Diversitech/Supervisors/Inventory/BusInventory/?plan_no=${encodeURIComponent(
            plan_no
          )}&plan_date=${encodeURIComponent(plan_date)}`}
        >
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid>
    </Grid>
  )
}
MInventory.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default MInventory
