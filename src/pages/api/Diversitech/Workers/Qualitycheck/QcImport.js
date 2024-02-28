import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'

export default async function handle(req, res) {
  try {
    const { item_code, count_value, plan_no, type, frame_id, subCount } = req.body

    // console.log(item_code, count_value, plan_no, type, subCount)
    const status = 'QC'
    const Type = type
    const subtype = 'fsub'

    if (count_value < 0) {
      return res.status(200).json({
        success: false,
        message: 'Negative value Inserted'
      })
    }

    if (subCount != 0) {
      const mailOptions = {
        from: process.env.MAILER_USER,
        to: 'ayushji.kushwah@outlook.com',
        subject: 'Diversitech_QC_Substract',
        text: `A worker subtracts a quantity of ${subCount} from seat assembly number ${item_code} with plan number ${plan_no}.`
      }

      const result = await transporter.sendMail(mailOptions)

      if (result) {
        console.log('Substract Mail send ')
      } else {
        console.log('Substract Mail Not send ')
      }
    }

    if (!item_code) {
      return res.status(400).json({ error: 'Invalid input data' })
    }

    const CurrentDate = new Date().toISOString()
    const SelectQuery = `SELECT item_id FROM tbl_item_master WHERE item_code = ?`
    const SelectCheckQuery = `SELECT * FROM tbl_planning_bom_detail WHERE seat_item_id = ? AND plan_no = ?`
    const StatusQuery = `SELECT status_id FROM tbl_status WHERE status_description = ?`

    const InsertQuery = `INSERT INTO tbl_stock_ledger(item_id,trans_type,trans_qty,transaction_no) VALUES (?,?,?,?)`

    const UpdateQuery = `
        UPDATE tbl_planning_bom_detail
        SET qc_qty = LEAST(COALESCE(qc_qty, 0) + ?, seat_prod_qty),updated_on = ?
        WHERE seat_item_id = ? AND plan_no = ?;
      `

    connection.query(SelectQuery, [item_code], async (err, itemResult) => {
      if (err) {
        console.error('Error in SelectQuery:', err)

        return res.status(500).json({ error: 'Internal server error' })
      }

      if (itemResult.length === 0) {
        return res.status(400).json({ error: 'Item not found' })
      }

      const { item_id } = itemResult[0]

      connection.query(SelectCheckQuery, [item_id, plan_no], async (err, checkResult) => {
        if (err) {
          console.error('Error in SelectCheckQuery:', err)

          return res.status(500).json({ error: 'Internal server error' })
        }

        let canInsert = true

        for (const frame of checkResult) {
          const { qc_qty, seat_prod_qty, seat_plan_qty } = frame
          const totalQC = parseFloat(qc_qty) + parseFloat(count_value)

          if (parseFloat(seat_plan_qty) === totalQC) {
            const mailOptions = {
              from: process.env.MAILER_USER,
              to: 'ayushji.kushwah@outlook.com',
              subject: 'Diversitech_QualityCheck',
              text: `Production for Plan No ${plan_no} of Seat ${item_code} has been successfully completed with a total quantity of ${totalQC}.`
            }

            const result = await transporter.sendMail(mailOptions)

            if (result) {
              console.log('Email send Succesfully')
            } else {
              console.log('Email An error occurred')

              // res.status(500).send('An error occurred')
            }
          }

          if (seat_prod_qty < parseInt(qc_qty) + parseInt(count_value)) {
            canInsert = false
            break
          }
        }

        // console.log(canInsert)

        if (canInsert) {
          await new Promise((resolve, reject) => {
            connection.query(InsertQuery, [item_id, Type, count_value, plan_no], err => {
              // console.log('Insert Query Work')
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })

          await new Promise((resolve, reject) => {
            connection.query(InsertQuery, [frame_id, subtype, count_value, plan_no], err => {
              // console.log('Insert Query Work')
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })

          await new Promise((resolve, reject) => {
            connection.query(UpdateQuery, [count_value, CurrentDate, item_id, plan_no], err => {
              // console.log('Update Query Work')
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })

          return res.status(200).json({
            success: true,
            message: `Data for Plan ${plan_no} and Item ${item_code} has been successfully inserted.`
          })
        } else {
          return res.status(200).json({
            success: false,
            message: 'Please refresh the page if the produced quantity exceeds the requested quantity '
          })
        }
      })
    })
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
}
