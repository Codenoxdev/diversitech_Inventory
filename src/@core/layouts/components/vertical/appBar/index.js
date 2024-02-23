// import { styled, useTheme } from '@mui/material/styles'
// import useScrollTrigger from '@mui/material/useScrollTrigger'
// import MuiAppBar from '@mui/material/AppBar'
// import MuiToolbar from '@mui/material/Toolbar'

// // ** Util Import
// import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

// const AppBar = styled(MuiAppBar)(({ theme }) => ({
//   transition: 'none',
//   alignItems: 'center',
//   justifyContent: 'center',
//   padding: theme.spacing(0, 6),
//   backgroundColor: 'transparent',
//   color: theme.palette.text.primary,
//   minHeight: theme.mixins.toolbar.minHeight,
//   [theme.breakpoints.down('sm')]: {
//     paddingLeft: theme.spacing(4),
//     paddingRight: theme.spacing(4)
//   }
// }))

// const Toolbar = styled(MuiToolbar)(({ theme }) => ({
//   width: '100%',
//   padding: '0 !important',
//   borderBottomLeftRadius: theme.shape.borderRadius,
//   borderBottomRightRadius: theme.shape.borderRadius,
//   minHeight: `${theme.mixins.toolbar.minHeight}px !important`,
//   transition: 'padding .25s ease-in-out, box-shadow .25s ease-in-out, background-color .25s ease-in-out'
// }))

// const LayoutAppBar = props => {
//   // ** Props
//   const { settings, appBarProps, appBarContent: userAppBarContent } = props

//   // ** Hooks
//   const theme = useTheme()
//   const scrollTrigger = useScrollTrigger({ threshold: 0, disableHysteresis: true })

//   // ** Vars
//   const { skin, appBar, appBarBlur, contentWidth } = settings

//   const appBarFixedStyles = () => {
//     return {
//       px: `${theme.spacing(6)} !important`,
//       boxShadow: skin === 'bordered' ? 0 : 3,
//       ...(appBarBlur && { backdropFilter: 'blur(8px)' }),
//       backgroundColor: hexToRGBA(theme.palette.background.paper, appBarBlur ? 0.9 : 1),
//       ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}`, borderTopWidth: 0 })
//     }
//   }
//   if (appBar === 'hidden') {
//     return null
//   }
//   let userAppBarStyle = {}
//   if (appBarProps && appBarProps.sx) {
//     userAppBarStyle = appBarProps.sx
//   }
//   const userAppBarProps = Object.assign({}, appBarProps)
//   delete userAppBarProps.sx

//   return (
//     <AppBar
//       elevation={0}
//       color='default'
//       className='layout-navbar'
//       sx={{ ...userAppBarStyle }}
//       position={appBar === 'fixed' ? 'sticky' : 'static'}
//       {...userAppBarProps}
//     >
//       <Toolbar
//         className='navbar-content-container'
//         sx={{
//           ...(appBar === 'fixed' && scrollTrigger && { ...appBarFixedStyles() }),
//           ...(contentWidth === 'boxed' && {
//             '@media (min-width:1440px)': { maxWidth: `calc(1440px - ${theme.spacing(6)} * 2)` }
//           })
//         }}
//       >
//         {(userAppBarContent && userAppBarContent(props)) || null}
//       </Toolbar>
//     </AppBar>
//   )
// }

// export default LayoutAppBar

// ** Next Import
import Link from 'next/link'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

const LayoutAppBar = props => {
  // ** Props
  const { appBarContent: userAppBarContent, appBarBranding: userAppBarBranding } = props

  // ** Hooks
  const theme = useTheme()

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userAppBarBranding ? (
        userAppBarBranding(props)
      ) : (
        <LinkStyled href='/'>
          <img alt='Diversitech' width='200px' height='50px' src='/images/Diversitech.png ' />

          {/* <Typography variant='h4' sx={{ ml: -1, color: 'black', fontWeight: 700, lineHeight: 1.2 }}>
            {themeConfig.templateName}
          </Typography> */}
        </LinkStyled>
      )}
      {userAppBarContent ? userAppBarContent(props) : null}
    </Box>
  )
}

export default LayoutAppBar
