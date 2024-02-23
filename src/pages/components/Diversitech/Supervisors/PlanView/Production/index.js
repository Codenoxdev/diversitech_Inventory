import { useContext } from 'react'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import SupervisorsAllPlansView from 'src/views/components/Diveristech/Planview/Supervisors/Production/Planview'
import { AuthContext } from 'src/context/AuthContext'

const SupervisorsPlansView = () => {
  const { role } = useContext(AuthContext)

  // console.log('AUTHROLE = ' + role)

  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <SupervisorsAllPlansView />

        {role === 'admin' ? (
          <Grid container padding='20px' justifyContent='center' alignItems='center'>
            <Link href='/components/Diversitech/Admin/Inventory/InventoryPage/'>
              <Button size='medium' variant='contained'>
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

SupervisorsPlansView.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default SupervisorsPlansView
