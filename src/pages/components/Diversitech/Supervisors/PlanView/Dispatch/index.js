import { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import SupervisorsDAllPlansView from 'src/views/components/Diveristech/Planview/Supervisors/Dispatch/Planview'
import { AuthContext } from 'src/context/AuthContext'

const SupervisorsDisPlansView = () => {
  const { role } = useContext(AuthContext)

  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12} md={10} padding='10px'></Grid>

        <SupervisorsDAllPlansView />

        {role === 'admin' ? (
          <Grid container padding='20px' justifyContent='center' alignItems='center'>
            <Link href='/components/Diversitech/Admin/Inventory/InventoryPage/'>
              <Button size='medium' variant='contained' title='Submit'>
                Back
              </Button>
            </Link>
          </Grid>
        ) : (
          <Grid container padding='20px' justifyContent='center' alignItems='center'>
            <Link href='/components/snackbar/'>
              <Button size='medium' variant='contained'>
                Back
              </Button>
            </Link>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}

SupervisorsDisPlansView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default SupervisorsDisPlansView
