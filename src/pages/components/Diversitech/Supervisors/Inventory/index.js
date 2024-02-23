import React from 'react'
import InventoryPage from 'src/views/Inventory/Inventorypage'
import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'
import Link from 'next/link'

const Inventory = () => {
  return (
    <Grid container spacing={5} className='match-height'>
      <Grid item xs={12}>
        <InventoryPage />
      </Grid>
      <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href='/components/snackbar/'>
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid>
    </Grid>
  )
}

Inventory.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Inventory
