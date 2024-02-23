import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'

const navigation = () => {
  const role = JSON.parse(localStorage.getItem('userData'))

  // console.log('role = ' + role.role)

  return [
    {
      icon: <HomeOutlinedIcon />,
      label: 'navbar-home',
      title: 'Home',
      path: role.role === 'admin' ? '/components/Diversitech/Admin/Inventory/InventoryPage/' : '/components/snackbar'
    }
  ]
}

export default navigation
