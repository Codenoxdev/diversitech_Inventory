/**
 *  Set Home URL based on User Roles
 */
const getHomeRoute = role => {
  if (role === 'work') {
    return '/components/Wdashboard/'
  } else if (role === 'supervisors') {
    return '/components/snackbar/'
  } else {
    return '/components/Diversitech/Admin/Inventory/InventoryPage/'
  }

  // if (role === 'client') return '/components/Diversitech/Admin/Inventory/InventoryPage/'
  // else if (role === 'admin') return '/components/snackbar/'
  // else return '/components/Wdashboard/'
}

export default getHomeRoute
