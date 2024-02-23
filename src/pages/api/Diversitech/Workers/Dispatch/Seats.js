import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'

export default async function handle(req, res) {
  try {
    const { Dispatchseats, plan_no } = req.body

    // console.log(plan_no)
    const CurrentDate = new Date().toISOString()
    const type = 'sub'
    if (!Dispatchseats || !plan_no) {
      res.status(400).json({ message: 'Missing Dispatch no in query parameters' })

      return
    }

    const DispatchData =
      'SELECT dispatch_no,request_quantity, dispatch_quantity,seat_item_id FROM tbl_dispatch_bom_detail WHERE seat_item_id = ? AND dispatch_no = ?'
    const updateQuery = `UPDATE tbl_dispatch_bom_detail SET dispatch_quantity = ? WHERE seat_item_id = ? and dispatch_no =?;`
    const InsertQuery = `INSERT INTO tbl_stock_ledger(item_id,trans_type,trans_qty,transaction_no) VALUES (?,?,?,?)`
    const SelectQuery = `SELECT available_quantity FROM tbl_stock_summary WHERE item_id = ?`

    let allInsertsSuccessful = true

    for (const data of Dispatchseats) {
      const { request_quantity, dispatch_quantity, item_id, vecv_part_no } = data
      connection.query(DispatchData, [item_id, plan_no], (err, result) => {
        if (err) {
          console.error('Error fetching dispatch data:', err)
          res.status(500).json({ success: false, message: 'Error fetching dispatch data' })

          return
        }

        for (const item of result) {
          const Db_request_quantity = item.request_quantity
          const Db_dispatch_quantity = item.dispatch_quantity

          if (Db_request_quantity === Db_dispatch_quantity) {
            continue

            // Data already matches, nothing to do here
          } else {
            if (dispatch_quantity != Db_dispatch_quantity) {
              if (Db_request_quantity != dispatch_quantity) {
                connection.query(updateQuery, [dispatch_quantity, item_id, plan_no], (err, result) => {
                  if (err) {
                    console.error('Error in updateQuery Dispatch Seats:', err)
                    allInsertsSuccessful = false
                  } else {
                    allInsertsSuccessful = true
                  }
                })
              } else {
                connection.query(updateQuery, [dispatch_quantity, item_id, plan_no], (err, result) => {
                  if (err) {
                    console.error('Error in updateQuery Dispatch Seats:', err)
                    allInsertsSuccessful = false
                  } else {
                    connection.query(SelectQuery, [item_id], (err, selectresult) => {
                      for (const summary of selectresult) {
                        if (summary.available_quantity >= dispatch_quantity) {
                          connection.query(InsertQuery, [item_id, type, dispatch_quantity, plan_no], (err, result) => {
                            if (err) {
                              console.error('Error in InsertQuery Dispatch Seats:', err)
                              allInsertsSuccessful = false
                            } else {
                              const mailOptions = {
                                from: process.env.MAILER_USER,
                                to: 'ayushji.kushwah@outlook.com',
                                subject: 'Diversitech_dispatch',
                                text: `Dispatch No. ${plan_no} of seat ${vecv_part_no} is Dispatch ${dispatch_quantity} Quantity..!`
                              }

                              const result = transporter.sendMail(mailOptions)

                              if (result) {
                                allInsertsSuccessful = true

                                // console.log('Email sent successfully')
                              } else {
                                allInsertsSuccessful = false

                                // console.log('An error occurred')
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                })
              }
            }
          }
        }
      })
    }

    // Wait for all database operations to complete before sending the response
    const interval = setInterval(() => {
      if (allInsertsSuccessful || Dispatchseats.length === 0) {
        clearInterval(interval)
        if (allInsertsSuccessful) {
          res.status(200).json({ success: true, message: 'Record save successfully' })
        } else {
          res.status(500).json({ success: false, message: 'At least one insertion failed' })
        }
      }
    }, 1000)
  } catch (err) {
    console.error('Error in try and catch:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
