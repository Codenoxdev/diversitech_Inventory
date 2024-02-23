// ** Mock Adapter
import mock from 'src/@fake-db/mock'

const data = {
  permissions: [
    {
      id: 1,
      name: 'Inventory',
      assignedTo: ['administrator', 'manager', 'supervisor'],
      createdDate: '18 Jul 2023, 6:43 PM'
    },
    {
      id: 2,
      assignedTo: ['administrator', 'manager', 'supervisor'],
      name: 'Planning',
      createdDate: '18 Jul 2023, 6:43 PM'
    },
    {
      id: 3,
      name: 'Supply Chain',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['administrator', 'manager', 'supervisor']
    },
    {
      id: 4,
      name: 'Add Data',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['administrator', 'manager', 'supervisor']
    },
    {
      id: 5,
      name: 'Dispatch',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['worker']
    },
    {
      id: 6,
      name: 'Frame',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['worker']
    },
    {
      id: 7,
      name: 'Paint',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['worker']
    },
    {
      id: 8,
      name: 'Assembly',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['worker']
    },
    {
      id: 9,
      name: 'Quality Checks',
      createdDate: '18 Jul 2023, 6:43 PM',
      assignedTo: ['worker']
    }
  ]
}

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/apps/permissions/data').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const filteredData = data.permissions.filter(
    permissions =>
      permissions.name.toLowerCase().includes(queryLowered) ||
      permissions.createdDate.toLowerCase().includes(queryLowered) ||
      permissions.assignedTo.some(i => i.toLowerCase().startsWith(queryLowered))
  )

  return [
    200,
    {
      params: config.params,
      allData: data.permissions,
      permissions: filteredData,
      total: filteredData.length
    }
  ]
})
