import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MasterViewSeat from 'src/views/components/Diveristech/Master/MasterViewSeat'

const Masterseat = () => {
  // const [open, setOpen] = useState(false)
  const { role } = useContext(AuthContext)

  return (
    <Grid container rowSpacing={5}>
      <Grid item xs={12}>
        <MasterViewSeat />
      </Grid>

      <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href='/components/Diversitech/Masterdata/'>
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid>
      {/* {role === 'admin' ? () : (
        <Grid container padding='20px' justifyContent='center' alignItems='center'>
          <Link href='/components/snackbar/'>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
        </Grid>
      )} */}
    </Grid>
  )
}
Masterseat.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Masterseat
