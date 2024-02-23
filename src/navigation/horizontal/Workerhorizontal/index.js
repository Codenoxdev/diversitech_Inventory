import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined'
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'

const navigation = () => {
  const role = JSON.parse(localStorage.getItem('userData'))

  // console.log('role = ' + role.role)

  return [
    {
      icon: <HomeOutlinedIcon />,
      label: 'navbar-home',
      title: 'Home',
      path:
        role.role === 'admin'
          ? '/components/Diversitech/Admin/Inventory/InventoryPage/'
          : role.role === 'supervisors'
          ? '/components/snackbar'
          : '/components/Wdashboard/'
    },
    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? <AppsOutlinedIcon /> : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-master' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Master' : null,
      path: '/components/Diversitech/Masterdata'
    },

    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? <AddCommentOutlinedIcon /> : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-planning' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Planning' : null,
      path: '/components/Diversitech/Supervisors/PlanView/Production/'
    },
    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? <LocalShippingOutlinedIcon /> : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-dispatch' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Dispatch' : null,
      path: '/components/Diversitech/Supervisors/PlanView/Dispatch/'
    },
    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? <HistoryOutlinedIcon /> : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-history' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'History' : null,
      path: '/components/Diversitech/Supervisors/History/'
    }
  ]
}

export default navigation
