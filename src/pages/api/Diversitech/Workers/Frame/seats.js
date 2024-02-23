// import connection from 'src/configs/db'

// export default async function handle(req, res) {
//   try {
//     const { plan_no } = req.query // Get the plan_no from the request query parameters

//     if (!plan_no) {
//       res.status(400).json({ message: 'Missing plan_no in query parameters' })

//       return
//     }

//     const Plandataview = `
//       SELECT
//         tbl_planning_bom_detail.frame_plan_qty,
//         tbl_planning_bom_detail.seat_item_id,
//         tbl_item_master.item_id,
//         tbl_item_master.item_code,
//         tbl_item_master.item_description
//       FROM tbl_planning_bom_detail
//       JOIN tbl_item_master ON tbl_planning_bom_detail.seat_item_id = tbl_item_master.item_id
//       WHERE tbl_planning_bom_detail.plan_no = ?;
//     `

//     connection.query(Plandataview, [plan_no], (err, data) => {
//       if (err) {
//         console.error('Error executing SQL Query:', err)
//         console.error('Master Data Not Get')
//         res.status(500).json({ error: 'Error fetching data from the database' })

//         return
//       }

//       console.log('Master data Get from the database:', JSON.stringify(data))
//       res.status(200).json(data)
//     })
//   } catch (err) {
//     console.error('Error in try and catch:', err)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }
