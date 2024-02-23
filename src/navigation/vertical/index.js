const navigation = () => {
  const role = JSON.parse(localStorage.getItem('userData'))

  // console.log('role = ' + role.role)

  return [
    {
      icon: 'mdi:home-outline',
      title: 'Home',
      path: role.role === 'admin' ? '/components/Diversitech/Admin/Inventory/InventoryPage/' : '/components/snackbar'
    },
    {
      icon: 'mdi:apps',
      title: 'Master',
      path: '/components/Diversitech/Masterdata'
    },

    {
      icon: 'mdi-tooltip-outline-plus',
      title: 'Planning',
      path: '/components/Diversitech/Supervisors/PlanView/Production/'
    },
    {
      icon: 'mdi-ambulance',
      title: 'Dispatch',
      path: '/components/Diversitech/Supervisors/PlanView/Dispatch/'
    },
    {
      icon: 'mdi-history',
      title: 'History',
      path: '/components/Diversitech/Supervisors/History/'
    }
  ]
}

export default navigation
