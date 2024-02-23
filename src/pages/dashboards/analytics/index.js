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

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12} md={8}>
          <AnalyticsCongratulations />
        </Grid>
        {/* <Grid item xs={6} md={4}>
          <CardStatisticsVertical
            stats='155k'
            color='primary'
            trendNumber='+22%'
            title='Total Orders'
            chipText='Last 4 Month'
            icon={<Icon icon='mdi:cart-plus' />}
          />
        </Grid> */}

        {/* <Grid item xs={12} md={12}>
          <AnalyticsTotalTransactions />
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4}>
          <AnalyticsProjectStatistics />
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4}>
          <AnalyticsSalesCountry />
        </Grid> */}

        {/* <Grid item xs={12} sm={6} md={4}>
          <AnalyticsWeeklySales />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
