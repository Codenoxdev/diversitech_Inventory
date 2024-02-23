import Grid from '@mui/material/Grid'
import ProductionCom from 'src/views/components/Production/Production'

const Production = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container>
        <Grid item xs={12}>
          <ProductionCom />
        </Grid>
      </Grid>
    </Grid>
  )
}

Production.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Production
