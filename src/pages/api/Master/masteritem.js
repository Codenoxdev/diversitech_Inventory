import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const query = `SELECT * FROM tbl_item_master`
    connection.query(query, (err, data) => {
      if (err) {
        console.error('error execution sql Query:', err)
        res.status(200).send('Error')

        return
      } else {
        res.status(200).json(data)
      }
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// import connection from 'src/configs/db'

// export default async function handle(req, res) {
//   try {
//     const { comp_code } = req.body

//     const query = `SELECT tim.item_code,
//     tim.item_description,
//     tim.engine_type,
//     tim.variant,
//     tim.bs_type,
//     tim.model,
//     tim.product_type,
//     tim.image_url,
//     tim.frame_no,
//     tim.vecv_part_no,
//     tim.dwg_division,
//     tim.material,
//     tim.unit,
//     tim.category,
//     tim.features,
//     tim.active,

//     tim.welding_no,
//     tim.mtgauge_no,
//     tim.legpart_no,
//     tim.frame_model,
//     tim.created_by,
//     tp.comp_code
//     FROM tbl_place tp
//     JOIN tbl_item_master_place timp ON timp.place_id = tp.place_id
//     JOIN tbl_item_master tim ON timp.item_id = tim.item_id
//     WHERE tp.comp_code =?;
//     `

//     connection.query(query, [comp_code], (err, data) => {
//       if (err) {
//         console.error('error execution sql Query:', err)
//         res.status(200).send('Error')

//         return
//       } else {
//         // console.log('Master data Get to database:- ', data)
//         res.status(200).json(data)
//       }
//     })
//   } catch (err) {
//     // console.log('Error in try and catch:', err)

//     return res.status(500).json({ message: 'Internal server error' })
//   }
// }
