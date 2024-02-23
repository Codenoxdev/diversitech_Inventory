// ** React Imports
import Grid from '@mui/material/Grid'

import DTableAitem from 'src/views/components/DTables/TableAitems'

const Productionpaint = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <DTableAitem />
        </Grid>
      </Grid>
    </Grid>
  )
}

Productionpaint.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Productionpaint
