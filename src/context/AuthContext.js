// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  // role: null,
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)

  const [role, setRole] = useState('')

  // console.log(role)

  const [loading, setLoading] = useState(defaultProvider.loading)

  // ============PlanningProduction===================
  const [rows, setRows] = useState([])

  //  ========================SupervisorsProductionPlanView====================
  const [SplanView, setSplanView] = useState([])
  const [branch, setBranch] = useState()
  const [analytics, setAnalytics] = useState([])

  // console.log('analytics')
  // console.log(analytics)

  //  ========================SupervisorsDispatchPlanView====================
  const [DplanView, setDplanView] = useState([])

  // ============PlanningDispatch===================
  const [Drows, setDrows] = useState([])

  // ============MasterData===================
  const [Masterdata, setMasterdata] = useState([])

  const [busFilteredRows, setBusFilteredRows] = useState([])
  const [busSearchQuery, setBusSearchQuery] = useState('')

  const [seatFilteredRows, setSeatFilteredRows] = useState([])
  const [seatSearchQuery, setSeatSearchQuery] = useState('')

  const [frameFilteredRows, setFrameFilteredRows] = useState([])
  const [frameSearchQuery, setFrameSearchQuery] = useState('')

  const [partFilteredRows, setPartFilteredRows] = useState([])
  const [partSearchQuery, setPartSearchQuery] = useState('')

  const [selectedDate, setSelectedDate] = useState('')

  const router = useRouter()

  useEffect(() => {
    const UserData = JSON.parse(window.localStorage.getItem('userData'))
    if (UserData && UserData.role) {
      setRole(UserData.role)
    }

    // ===================Date=====================
    const date = new Date()
    const day = date.getDate().toString().padStart(2, '0') // Ensure 2-digit day
    const month = date.toLocaleDateString('default', { month: 'short' }) // Ensure 2-digit month (months are zero-based)
    const year = date.getFullYear()
    const formattedDate = `${day} ${month} ${year}`
    setSelectedDate(formattedDate)

    const initAuth = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        await axios
          .get(authConfig.meEndpoint, {
            headers: {
              Authorization: storedToken
            }
          })
          .then(async response => {
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
      }
    }
    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps

    // ========================MasterIteamGet==============================
    fetch(authConfig.MasterDataEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        setMasterdata(data)

        setBusFilteredRows(data.filter(row => row.product_type === 'BUS'))
        setSeatFilteredRows(data.filter(row => row.product_type === 'SEAT'))
        setFrameFilteredRows(data.filter(row => row.product_type === 'FRAME'))
        setPartFilteredRows(data.filter(row => row.product_type === 'PART'))
      })
      .catch(error => {
        console.error('Error fetching master item data:', error)
      })

    //  ========================Supervisors_Production_PlanView====================
    fetch(authConfig.ProductionPlanViewEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        setSplanView(data)
      })
      .catch(error => {
        console.error('Error fetching master item data:', error)
      })

    //  ========================Supervisors_Dispatch_PlanView====================
    fetch(authConfig.DispatchPlanViewEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        setDplanView(data)
      })
      .catch(error => {
        console.error('Error fetching master item data:', error)
      })

    // =============================Diversitech_Branches======================================
    fetch(authConfig.DiversitechBranchEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        setBranch(data)
      })
      .catch(error => {
        console.error('Error fetching master item data:', error)
      })

    // =============================Analytics_Endpoints======================================
    fetch(authConfig.AnalyticsEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then(data => {
        setAnalytics(data.message)
      })
      .catch(error => {
        console.error('Error fetching master item data:', error)
      })
  }, [])

  const handleLogin = (params, errorCallback) => {
    axios
      .post(authConfig.loginEndpoint, params)
      .then(async response => {
        params.rememberMe
          ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
          : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.userData })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params, errorCallback) => {
    console.log(params)
    axios
      .post(authConfig.registerEndpoint, params)
      .then(async response => {
        console.log(response)

        // params.rememberMe
        //   ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
        //   : null
        // const returnUrl = router.query.returnUrl
        // setUser({ ...response.data.userData })
        // params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.userData)) : null
        // const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        // router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    user,
    role,
    setRole,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    rows,
    setRows,
    Drows,
    setDrows,
    Masterdata,
    setMasterdata,
    busFilteredRows,
    setBusFilteredRows,
    busSearchQuery,
    setBusSearchQuery,
    seatFilteredRows,
    setSeatFilteredRows,
    seatSearchQuery,
    setSeatSearchQuery,
    frameFilteredRows,
    setFrameFilteredRows,
    frameSearchQuery,
    setFrameSearchQuery,
    partFilteredRows,
    setPartFilteredRows,
    partSearchQuery,
    setPartSearchQuery,
    SplanView,
    setSplanView,
    DplanView,
    setDplanView,
    selectedDate,
    setSelectedDate,
    branch,
    analytics

    // FilteredRows,
    // setFilteredRows
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
