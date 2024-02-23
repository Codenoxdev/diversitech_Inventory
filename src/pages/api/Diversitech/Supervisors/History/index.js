import connection from 'src/configs/db'

export default async function handle(req, res) {
  try {
    const selectquery = `
    SELECT tsl.item_id,
    tsl.trans_qty,
    tsl.trans_type,
    tsl.transaction_no,
    tsl.transaction_date,
    tim.item_code,
    tim.product_type
    FROM tbl_stock_ledger tsl
    JOIN tbl_item_master tim ON tim.item_id = tsl.item_id
    `

    connection.query(selectquery, (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).send('Error occurred while querying the database.')

        return
      }

      let History = []
      let Dispatch = ''
      let Production = ''

      for (const item of result) {
        const { item_id, trans_qty, trans_type, transaction_no, transaction_date, item_code, product_type } = item

        if (product_type === 'FRAME' && trans_type === 'sub') {
          // console.log(trans_type + product_type + item_id)
        } else {
          if (product_type === 'SEAT' && trans_type === 'sub') {
            // console.log('Dispatch' + ' ' + item_id + ' ' + trans_type)  ||
            Dispatch = 'Dispatched'

            const itemData = {
              item_id: item_id,
              item_code: item_code,
              Dispatch: Dispatch,
              product_type: product_type,
              trans_type: trans_type,
              trans_qty: trans_qty,
              transaction_no: transaction_no,
              transaction_date: transaction_date
            }
            History.push(itemData)
          } else {
            Production = 'Production'
            if (Dispatch) {
              const itemData = {
                item_id: item_id,
                item_code: item_code,
                Production: Production,
                product_type: product_type,
                trans_type: trans_type,
                trans_qty: trans_qty,
                transaction_no: transaction_no,
                transaction_date: transaction_date
              }
              History.push(itemData)
            }
          }
        }
      }

      res.json(History)
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('An error occurred.')
  }
}
