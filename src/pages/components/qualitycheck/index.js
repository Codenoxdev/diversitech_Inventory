import Grid from '@mui/material/Grid'

import QualityCom from 'src/views/components/qualitycheck/qualitycom'

const qualitycheck = () => {
  return (
    <Grid item xs={12} md={6}>
      <Grid container className='match-height'>
        <Grid item xs={12}>
          <QualityCom />
        </Grid>
      </Grid>
    </Grid>
  )
}

qualitycheck.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default qualitycheck
