// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableBasic from 'src/views/table/mui/TableBasic'

// ** Demo Components Imports
// import TableBasic from 'src/views/tables/TableBasic'
import TableDense from 'src/views/table/mui/TableDense'
import TableSpanning from 'src/views/table/mui/TableSpanning'
import TableCustomized from 'src/views/table/mui/TableCustomized'
import TableCollapsible from 'src/views/table/mui/TableCollapsible'
import TableStickyHeader from 'src/views/table/mui/TableStickyHeader'

const MUITable = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h5'>
          <Link href='https://mui.com/components/tables/' target='_blank'>
            MUI Tables
          </Link>
        </Typography>
        <Typography variant='body2'>Tables display sets of data. They can be fully customized</Typography>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Basic Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableBasic />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Dense Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableDense />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Production-Planning' titleTypographyProps={{ variant: 'h6' }} />
          <TableStickyHeader />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Collapsible Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableCollapsible />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Spanning Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableSpanning />
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Customized Table' titleTypographyProps={{ variant: 'h6' }} />
          <TableCustomized />
        </Card>
      </Grid>
    </Grid>
  )
}

export default MUITable
