// ** React Imports
import { useContext } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import WorkerLanding from 'src/views/components/Diveristech/Landingpage/Worker/Landing'

const ACLPage = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)

  return (
    <Grid container className='match-height'>
      <Grid item xs={12}>
        <WorkerLanding />
        {/* <Card>
          <CardHeader title='Common' />
          <CardContent>
            <Typography sx={{ mb: 4 }}>No ability is required to view this card</Typography>
            <Typography sx={{ color: 'primary.main' }}>This card is visible to 'user' and 'admin' both</Typography>
          </CardContent>
        </Card> */}
      </Grid>
      {/* {ability?.can('read', 'analytics') ? (
        <Grid item md={6} xs={12}>
          <Card>
            <CardHeader title='Analytics' />
            <CardContent>
              <Typography sx={{ mb: 4 }}>User with 'Analytics' subject's 'Read' ability can view this card</Typography>
              <Typography sx={{ color: 'error.main' }}>This card is visible to 'admin' only</Typography>
            </CardContent>
          </Card>
        </Grid>
      ) : null} */}
    </Grid>
  )
}

ACLPage.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default ACLPage

// import { useContext } from 'react'
// import Grid from '@mui/material/Grid'
// import WorkerLanding from 'src/views/components/Diveristech/Landingpage/Worker/Landing'
// import { AbilityContext } from 'src/layouts/components/acl/Can'

// const ACLPage = () => {
//   const ability = useContext(AbilityContext)

//   return (
//     <Grid container className='match-height'>
//       <Grid item xs={12}>
//         {ability?.can('read', 'analytics') ? <WorkerLanding /> : null}
//       </Grid>
//     </Grid>
//   )
// }
// ACLPage.acl = {
//   action: 'read',
//   subject: 'acl-page'
// }

// export default ACLPage
