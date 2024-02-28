export default {
  meEndpoint: '/auth/me',

  loginEndpoint: '/jwt/login',
  DiversitechBranchEndpoint: '/api/place',

  // loginEndpoint: '/api/Login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken', // logout | refreshToken
  SummaryEndpoint: '/api/Diversitech/Supervisors/Inventory/summary',
  MasterDataEndpoint: '/api/Master/masteritem/',
  ProductionPlanViewEndpoint: '/api/Diversitech/Supervisors/Production/PlanView/',
  DispatchPlanViewEndpoint: '/api/Diversitech/Supervisors/Dispatch/PlanView/',
  AddInventoryData: '/api/Diversitech/Supervisors/Addinventory/imageBackend',
  AddInventoryFrameList: '/api/Diversitech/Supervisors/Addinventory/FrameList/',
  DispatchBusView: '/api/Diversitech/Supervisors/Dispatch/Busview',
  DispatchSeatInventory: '/api/Diversitech/Supervisors/Inventory/DispatchSeatInventory',
  AnalyticsEndpoint: '/api/analytics'

  // DispatchPlanviewDelete: `/api/Diversitech/Supervisors/Dispatch/PlanView/`
}

// import authConfig from 'src/configs/auth'
