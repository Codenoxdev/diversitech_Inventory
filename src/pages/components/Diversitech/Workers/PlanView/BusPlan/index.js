import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import BusPlan from 'src/views/components/Diveristech/Busplan/Busview'

const BusPindex = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <BusPlan />
        </Grid>
        <Grid container padding='20px' justifyContent='center' alignItems='center'>
          <Link href='/components/Diversitech/Workers/PlanView/'>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

BusPindex.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default BusPindex
