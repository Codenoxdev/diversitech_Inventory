import { Button } from '@mui/material'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import MasterPage from 'src/views/components/Diveristech/Master/Masterpage'
import authConfig from 'src/configs/auth'

const Master = () => {
  // const [open, setOpen] = useState(false)
  const { role } = useContext(AuthContext)

  return (
    <Grid container rowSpacing={5}>
      <Grid container item direction='row' spacing={2} justifyContent='flex-end'>
        <Grid item>
          <Link href='/components/Diversitech/Supervisors/AddStock/'>
            <Button size='medium' variant='contained'>
              Add Stock
            </Button>
          </Link>
        </Grid>
        <Grid item alignItems='center' justifyContent='center'>
          <Link href='/components/Diversitech/Supervisors/AddInventory/'>
            <Button size='medium' variant='contained'>
              Create Item
            </Button>
          </Link>
        </Grid>
        <Grid item>
          <Link href='/components/Diversitech/Supervisors/AddBom'>
            <Button size='medium' variant='contained'>
              Create Bom
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MasterPage />
      </Grid>
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
  )
}
Master.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Master
