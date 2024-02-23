// ** React Imports
import Grid from '@mui/material/Grid'

import FrameCom from 'src/views/components/Frames/Frames'

const Frames = () => {
  return (
    <Grid item xs={12}>
      <Grid container>
        <Grid item xs={12}>
          <FrameCom />
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
