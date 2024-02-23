// import connection from 'src/configs/db'

// export default async function handle(req, res) {
//   try {
//     const { plan_no, item_code, item_id, part_id } = req.body

//     // console.log(plan_no, item_code, item_id, part_id)

//     const Plandataview = `
//       SELECT
//         tim1.item_description,
//         tim.item_id,
//         tim.item_code,
//         tii.image_path AS frame_img_url,
//         tim.item_description AS frame_item_description
//       FROM tbl_item_bom tpdb
//       JOIN tbl_item_master tim ON tim.item_id = tpdb.parent_item_id
//       JOIN tbl_item_master tim1 ON tim1.item_id = tpdb.item_id
//       JOIN tbl_item_images tii ON tii.item_code = tim1.item_code
//       WHERE tpdb.parent_item_id = ? ;
//     `

//     connection.query(Plandataview, [part_id], (err, data) => {
//       if (err) {
//         console.error('Error executing SQL Query:', err)
//         res.status(500).json({ error: 'Error fetching data from the database' })

//         return
//       }

//       // console.log(data + 'daaaaaataaaaaa')

//       res.status(200).json(data)
//     })
//   } catch (err) {
//     console.error('Error in try and catch:', err)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }
