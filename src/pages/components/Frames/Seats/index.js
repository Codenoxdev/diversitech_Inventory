import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import FrameView from 'src/views/components/DTables/FrameView'
import { useRouter } from 'next/router'

const Frames = () => {
  const router = useRouter()
  const { plan_no, item_code, plan_date } = router.query

  return (
    <Grid item xs={12} md={6}>
      <Grid item xs={12}>
        <FrameView />
      </Grid>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid padding='10px'>
          <Link href={`/components/Diversitech/Workers/PlanView/BusPlan/?plan_no=${plan_no}&plan_date=${plan_date}`}>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Grid>
  )
}

Frames.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Frames
