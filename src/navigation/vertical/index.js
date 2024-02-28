const navigation = () => {
  const role = JSON.parse(localStorage.getItem('userData'))

  // console.log('role = ' + role.role)
  // console.log('role = ' + role)

  return [
    {
      icon: 'mdi:home-outline',
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
      icon: role.role === 'admin' || role.role === 'supervisors' ? 'mdi:apps' : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-master' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Master' : null,
      path: '/components/Diversitech/Masterdata'
    },

    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? 'mdi-tooltip-outline-plus' : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-planning' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Planning' : null,
      path: '/components/Diversitech/Supervisors/PlanView/Production/'
    },
    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? 'mdi-ambulance' : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-dispatch' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'Dispatch' : null,
      path: '/components/Diversitech/Supervisors/PlanView/Dispatch/'
    },
    {
      icon: role.role === 'admin' || role.role === 'supervisors' ? 'mdi-history' : null,
      label: role.role === 'admin' || role.role === 'supervisors' ? 'navbar-dispatch' : null,
      title: role.role === 'admin' || role.role === 'supervisors' ? 'History' : null,
      path: '/components/Diversitech/Supervisors/History/'
    }
  ]
}

export default navigation
