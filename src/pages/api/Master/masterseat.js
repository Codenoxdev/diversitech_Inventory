import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const { item_id, seat } = req.body

    // console.log(item_id, seat)

    let Selectquery
    if (seat === 'BUS' || seat === 'SEAT') {
      Selectquery = ` SELECT
      tib.item_id AS seat_item_id,
      tim.product_type,
      tim1.item_code,
      tim1.item_description,
      tim2.item_id AS frame_item_id,
      tim2.item_description AS frame_item_description,
      tim1.frame_no,
      tim1.vecv_part_no,
      tim1.material AS seat_material,
      tim2.material AS frame_material,
      tim1.unit AS seat_unit,
      tim2.unit AS frame_unit,
      tim2.welding_no,
      tim2.mtgauge_no,
      tim2.legpart_no,
      tim2.frame_model,
      tim2.dwg_division,
      tib.quantity
    From tbl_item_master tim
    JOIN tbl_item_bom tib ON tib.parent_item_id = tim.item_id
    JOIN tbl_item_master tim1 ON tim1.item_id =  tib.item_id
    JOIN tbl_item_master tim2 ON tim2.item_code = tim1.frame_no
    WHERE tim.item_id = ?;
    `
    } else {
      Selectquery = `SELECT
      tib.item_id AS seat_item_id,
      tim.product_type,
      tim1.item_code,
      tim1.item_description,
      tim1.material AS seat_material,
      tim1.unit AS seat_unit,
      tim1.dwg_division,
      tib.quantity
  FROM tbl_item_master tim
  JOIN tbl_item_bom tib ON tib.parent_item_id = tim.item_id
  JOIN tbl_item_master tim1 ON tim1.item_id = tib.item_id
  WHERE tim.item_id = ?;`
    }

    connection.query(Selectquery, [item_id], (err, data) => {
      if (err) {
        console.error('error execution sql Query:', err)
        res.status(200).send('Error')

        return
      } else {
        // console.log('Master data Get to database:- ', data)
        res.status(200).json(data)
      }
    })
  } catch (err) {
    // console.log('Error in try and catch:', err)

    return res.status(500).json({ message: 'Internal server error' })
  }
}
