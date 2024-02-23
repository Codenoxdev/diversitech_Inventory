import Grid from '@mui/material/Grid'
import PaintCom from 'src/views/components/Paints/Paintcom'

const Paints = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <PaintCom />
        </Grid>
      </Grid>
    </Grid>
  )
}

Paints.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Paints
