// ** React Imports
import Grid from '@mui/material/Grid'
import DTableFitem from 'src/views/components/DTables/TableFitems'

const Frames = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <DTableFitem />
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
