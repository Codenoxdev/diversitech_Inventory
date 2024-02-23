/* eslint-disable react-hooks/rules-of-hooks */
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import Button from '@mui/material/Button'
import CowlDetails from 'src/views/components/Diveristech/Cowl/CowlDetails/cowldetails'
import { useRouter } from 'next/router'

const cowldetails = () => {
  const router = useRouter()
  const { item_code, part } = router.query

  // const actualCondition = condition === 'true'
  const actualCondition = 'true'
  const ClickPart = part

  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12}>
          <CowlDetails />
        </Grid>
      </Grid>
      {/* <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href={`/components/Cowl/?item_code=${item_code}&ClickPart=${ClickPart}&condition=${actualCondition}`}>
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid> */}
    </Grid>
  )
}

cowldetails.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default cowldetails
