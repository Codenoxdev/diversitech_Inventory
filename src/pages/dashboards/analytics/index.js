import Grid from '@mui/material/Grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports

import AnalyticsWeeklySales from 'src/views/dashboards/analytics/AnalyticsWeeklySales'

import AnalyticsSalesCountry from 'src/views/dashboards/analytics/AnalyticsSalesCountry'
import AnalyticsCongratulations from 'src/views/dashboards/analytics/AnalyticsCongratulations'

import AnalyticsTotalTransactions from 'src/views/dashboards/analytics/AnalyticsTotalTransactions'
import AnalyticsProjectStatistics from 'src/views/dashboards/analytics/AnalyticsProjectStatistics'
import { useContext } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import AnalyticsSessions from 'src/views/dashboards/analytics/AnalyticsSessions'
import AnalyticsPerformance from 'src/views/dashboards/analytics/AnalyticsPerformance'
import AnalyticsTotalRevenue from 'src/views/dashboards/analytics/AnalyticsTotalRevenue'
import AnalyticsOverview from 'src/views/dashboards/analytics/AnalyticsOverview'
import AnalyticsTopReferralSources from 'src/views/dashboards/analytics/AnalyticsTopReferralSources'
import AnalyticsVisitsByDay from 'src/views/dashboards/analytics/AnalyticsVisitsByDay'

const AnalyticsDashboard = () => {
  const { analytics } = useContext(AuthContext)
  console.log(analytics)
  console.log(analytics.topTwoSubTransactions)

  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        {/* <Grid item xs={12} md={8}>
          <AnalyticsCongratulations />
        </Grid> */}
        <Grid item xs={6} md={5}>
          <CardStatisticsVertical
            stats={analytics.totalTodayProductionQty} //'155k'
            color='primary'
            trendNumber='+22%'
            title='Today Production'
            chipText={new Date().toLocaleDateString()} //'Last 4 Month'
            icon={<Icon icon='mdi:package-variant-closed' />}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <AnalyticsSessions />
        </Grid>

        <Grid item xs={6} md={5}>
          <CardStatisticsVertical
            stats={analytics.totalTodayDispatchQty} //'155k'
            color='primary'
            trendNumber='+22%'
            title='Today Dispatched'
            chipText={new Date().toLocaleDateString()} //'Last 4 Month'
            icon={<Icon icon='mdi:ambulance' />}
          />
        </Grid>

        <Grid item xs={12} md={12}>
          <AnalyticsTotalTransactions data={analytics.weeks} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsPerformance />
        </Grid>
        <Grid item xs={6}>
          <AnalyticsTotalRevenue />
        </Grid>
        <Grid item xs={6}>
          <AnalyticsOverview />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsProjectStatistics
            topFive={analytics.topTwoSubTransactions ? analytics.topTwoSubTransactions : null}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsSalesCountry topFive={analytics.topTwoAddTransactions} />
        </Grid>
        {/* <Grid item xs={12} md={8}>
          <AnalyticsTopReferralSources />
        </Grid> */}
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsVisitsByDay />
        </Grid>
        {/* <Grid item xs={12} md={8}>
    <AnalyticsActivityTimeline />
  </Grid> */}

        <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWeeklySales />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

AnalyticsDashboard.acl = {
  action: 'read',
  subject: 'acl-page'
}

export default AnalyticsDashboard
