import Grid from '@mui/material/Grid'
import Link from 'next/link'

import Button from '@mui/material/Button'

import QStable from 'src/views/components/DTables/QualitySeatTable'
import { useRouter } from 'next/router'

const QSeats = () => {
  const router = useRouter()
  const { plan_no, plan_date } = router.query

  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <QStable />
        </Grid>
        <Grid container padding='20px' justifyContent='center' alignItems='center'>
          <Grid>
            <Link href={`/components/Diversitech/Workers/PlanView/BusPlan/?plan_no=${plan_no}&plan_date=${plan_date}`}>
              <Button size='medium' variant='contained'>
                Back
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

QSeats.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default QSeats
