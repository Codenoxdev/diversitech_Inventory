import Grid from '@mui/material/Grid'
import Link from 'next/link'

const Documentation = () => {
  return (
    <Grid container className='match-height'>
      <Grid item xs={12}>
        <Link href='https://www.youtube.com/watch?v=hzOlfYptY5o'>Supervisor</Link>
      </Grid>
      <Grid item xs={12}>
        <Link href='https://www.youtube.com/watch?v=6z_caZ0jA0A&feature=youtu.be'>Worker</Link>
      </Grid>
    </Grid>
  )
}

Documentation.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default Documentation
