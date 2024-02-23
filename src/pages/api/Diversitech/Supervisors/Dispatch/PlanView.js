import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { dispatch_no } = req.query

    const statusID = 9

    if (dispatch_no) {
      const updatequery = 'UPDATE tbl_dispatch SET status_id = ? WHERE dispatch_no = ?'

      connection.query(updatequery, [statusID, dispatch_no], (err, result) => {
        // console.log(result)

        if (err) {
          console.error('Error occurred while fetching data from tbl_planning_bom_detail:', err)
          res.status(500).send('An error occurred while fetching data.')
        } else {
          console.log('Update Successfully')
        }
      })
    }

    const Plandataview = `SELECT * FROM tbl_dispatch_bom_detail`
    const Plandateview = `SELECT dispatch_date, status_id FROM tbl_dispatch WHERE dispatch_no = ?`

    connection.query(Plandataview, async (err, result) => {
      if (err) {
        console.error('Error occurred while fetching data from tbl_planning_bom_detail:', err)
        res.status(500).send('An error occurred while fetching data.')
      } else {
        const planQuantities = []

        for (const row of result) {
          const { dispatch_no, request_quantity, dispatch_quantity } = row

          const prodQty = parseFloat(request_quantity) || 0
          const actualFrameQty = parseFloat(dispatch_quantity) || 0

          const existingEntry = planQuantities.find(entry => entry.plan_no === dispatch_no)
          if (existingEntry) {
            existingEntry.total_plan_qty += prodQty
            existingEntry.total_FrameQty += actualFrameQty
          } else {
            planQuantities.push({
              plan_no: dispatch_no,
              total_plan_qty: prodQty,
              total_FrameQty: actualFrameQty
            })
          }
        }

        const planStatusArray = []
        for (const item of planQuantities) {
          const { plan_no, total_plan_qty, total_FrameQty } = item

          const frameStatus =
            total_FrameQty === null || total_FrameQty === 0
              ? 'Open'
              : total_FrameQty !== total_plan_qty
              ? 'InProcess'
              : 'Complete'

          connection.query(Plandateview, [plan_no], async (err, result) => {
            if (err) {
              console.error('Error Will Be Created In PlanDateView = ', err)
              res.status(500).send('An error occurred while fetching data.')
            } else {
              const planDate = result[0].dispatch_date

              // const Status = result[0].status_description
              const selectStatus = `SELECT status_description FROM tbl_status WHERE status_id = ${result[0].status_id}`
              connection.query(selectStatus, (err, result) => {
                if (err) {
                  console.error('Error Will Be Created In PlanDateView = ', err)
                  res.status(500).send('An error occurred while fetching data.')
                } else {
                  const Status = result[0].status_description
                  planStatusArray.push({
                    plan_no,
                    frameStatus,
                    planDate,
                    Status
                  })
                  if (planStatusArray.length === planQuantities.length) {
                    res.status(200).json(planStatusArray)

                    //   // console.log(planStatusArray)
                  }
                }
              })
            }
          })
        }
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('An error occurred while fetching data.')
  }
}
