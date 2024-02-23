import connection from 'src/configs/db'

export default function handle(req, res) {
  try {
    const { plan_no } = req.query
    const statusID = 8

    if (plan_no) {
      const updatequery = 'UPDATE tbl_planning SET status_id = ? WHERE plan_no = ?'

      connection.query(updatequery, [statusID, plan_no], (err, result) => {
        if (err) {
          console.error('Error occurred while fetching data from tbl_planning_bom_detail:', err)
          res.status(500).send('An error occurred while fetching data.')
        } else {
          console.log('Update Successfully')
        }
      })
    }

    const Plandataview = `SELECT * FROM tbl_planning_bom_detail`

    const Plandateview = `SELECT plan_date, status_id FROM tbl_planning WHERE plan_no = ?`

    connection.query(Plandataview, async (err, result) => {
      if (err) {
        console.error('Error occurred while fetching data from tbl_planning_bom_detail:', err)
        res.status(500).send('An error occurred while fetching data.')
      } else {
        const planQuantities = []

        for (const row of result) {
          const { plan_no, frame_prod_qty, frame_plan_qty, frame_paint_qty, seat_prod_qty, qc_qty } = row

          const prodQty = parseFloat(frame_plan_qty) || 0
          const actualFrameQty = parseFloat(frame_prod_qty) || 0
          const actualPaintQty = parseFloat(frame_paint_qty) || 0
          const actualSeatQty = parseFloat(seat_prod_qty) || 0
          const actualQCQty = parseFloat(qc_qty) || 0

          const existingEntry = planQuantities.find(entry => entry.plan_no === plan_no)
          if (existingEntry) {
            existingEntry.total_plan_qty += prodQty
            existingEntry.total_FrameQty += actualFrameQty
            existingEntry.total_PaintQty += actualPaintQty
            existingEntry.total_SeatQty += actualSeatQty
            existingEntry.total_QCQty += actualQCQty
          } else {
            planQuantities.push({
              plan_no: plan_no,
              total_plan_qty: prodQty,
              total_FrameQty: actualFrameQty,
              total_PaintQty: actualPaintQty,
              total_SeatQty: actualSeatQty,
              total_QCQty: actualQCQty
            })
          }
        }

        const planStatusArray = []
        for (const item of planQuantities) {
          const { plan_no, total_plan_qty, total_FrameQty, total_PaintQty, total_SeatQty, total_QCQty } = item

          // console.log(plan_no, total_plan_qty, total_FrameQty, total_PaintQty, total_SeatQty, total_QCQty)

          const frameStatus =
            total_FrameQty === null || total_FrameQty === 0
              ? 'Open'
              : total_FrameQty !== total_plan_qty
              ? 'InProcess'
              : 'Complete'

          const paintStatus =
            total_PaintQty === null || total_PaintQty === 0
              ? 'Open'
              : total_PaintQty !== total_plan_qty
              ? 'InProcess'
              : 'Complete'

          const seatStatus =
            total_SeatQty === null || total_SeatQty === 0
              ? 'Open'
              : total_SeatQty !== total_plan_qty
              ? 'InProcess'
              : 'Complete'

          const qcStatus =
            total_QCQty === null || total_QCQty === 0
              ? 'Open'
              : total_QCQty !== total_plan_qty
              ? 'InProcess'
              : 'Complete'

          connection.query(Plandateview, [plan_no], async (err, result) => {
            if (err) {
              console.error('Error Will Be Created In PlanDateView = ', err)
              res.status(500).send('An error occurred while fetching data.')
            } else {
              const planDate = result[0].plan_date
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
                    paintStatus,
                    seatStatus,
                    qcStatus,
                    planDate,
                    Status
                  })

                  // console.log('planStatusArray' + planStatusArray)
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

    // }
    // else {
    //   res.status(405).send('Method Not Allowed')
    // }
  } catch (err) {
    console.error(err)
    res.status(500).send('An error occurred while processing data.')
  }
}
