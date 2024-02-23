// import Box from '@mui/material/Box'

// // ** Config Import
// import themeConfig from 'src/configs/themeConfig'

// // ** Menu Components
// import HorizontalNavItems from './HorizontalNavItems'

// const Navigation = props => {
//   return (
//     <Box
//       className='menu-content'
//       sx={{
//         display: 'flex',
//         flexWrap: 'wrap',
//         alignItems: 'center',
//         '& > *': {
//           '&:not(:last-child)': { mr: 2 },
//           ...(themeConfig.menuTextTruncate && { maxWidth: 220 })
//         }
//       }}
//     >
//       <HorizontalNavItems {...props} />
//     </Box>
//   )
// }

// export default Navigation

import themeConfig from 'src/configs/themeConfig'
import ListItemIcon from '@mui/material/ListItemIcon'
import HorizontalNavItems from 'src/@core/layouts/components/horizontal/navigation/HorizontalNavItems'
import { Box, Typography, Chip, styled, Icon } from '@mui/material'
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import MuiListItem from '@mui/material/ListItem'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'

import navigation from 'src/navigation/horizontal'

// import workernavigation from 'src/navigation/horizontal/Workerhorizontal'

import Link from 'next/link'

const Navigation = () => {
  // const Wrapper = !hasParent ? List : Fragment
  const role = JSON.parse(localStorage.getItem('userData'))
  const navigationItems = navigation(role.role)

  const ListItem = styled(MuiListItem)(({ theme }) => ({
    width: 'auto',
    paddingTop: theme.spacing(2.25),
    color: theme.palette.text.primary,
    paddingBottom: theme.spacing(2.25),
    '&:hover': {
      backgroundColor: theme.palette.action.hover
    },
    '&.active, &.active:hover': {
      backgroundColor: hexToRGBA(theme.palette.primary.main, 0.08)
    },
    '&.active .MuiTypography-root, &.active .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
    '&:focus-visible': {
      outline: 0,
      backgroundColor: theme.palette.action.focus
    }
  }))

  return (
    <>
      {navigationItems.map((item, index) => (
        <ListItem key={index}>
          <Box sx={{ gap: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ListItemIcon>
                {item.icon}
                {/* <HomeOutlinedIcon /> */}
              </ListItemIcon>
              <Link href={item.path} style={{ textDecoration: 'none' }}>
                <Typography>{item.title}</Typography>
              </Link>
            </Box>
          </Box>
        </ListItem>
      ))}
    </>

    // <Typography>Home</Typography>
    // <ListItem>
    //   <Box sx={{ gap: 2, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center'

    //         // ...(menuTextTruncate && { overflow: 'hidden' })
    //       }}
    //     >
    //       <ListItemIcon sx={{}}>
    //         <UserIcon />
    //       </ListItemIcon>
    //       <Typography>{/*<Translations text={item.title} />*/} Home</Typography>
    //     </Box>
    // {/* {item.badgeContent ? ( */}
    //     <Chip
    //       size='small'

    //       // label={item.badgeContent}
    //       // color={'primary'}
    //       // sx={{ '& .MuiChip-label': { px: 2.5, lineHeight: 1.385, textTransform: 'capitalize' } }}
    //     />
    //     {/* ) : null} */}
    //   </Box>
    // </ListItem>

    // <Box
    //   className='menu-content'
    //   sx={{
    //     display: 'flex',
    //     flexWrap: 'wrap',
    //     alignItems: 'center',
    //     '& > *': {
    //       '&:not(:last-child)': { mr: 2 },
    //       ...(themeConfig.menuTextTruncate && { maxWidth: 220 })
    //     }
    //   }}
    // >
    //   <HorizontalNavItems {...props} />
    // </Box>
  )
}

export default Navigation
