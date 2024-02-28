import connection from 'src/configs/db'
import { transporter } from 'src/configs/nodemailer'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwtConfig } from 'src/@fake-db/auth/jwt'

export default async function handle(req, res) {
  try {
    const SelectQuery = `SELECT tim.item_code,
    tim.vecv_part_no,
    tsl.trans_type,
    tsl.trans_qty,
    tsl.transaction_no,
    tsl.transaction_date,
    tsl.transaction_no FROM tbl_stock_ledger tsl
      JOIN tbl_item_master tim ON tim.item_id = tsl.item_id
    `

    connection.query(SelectQuery, (err, result) => {
      if (err) {
        console.error('Error fetching data:', err)

        return res.status(500).json({ success: false, error: 'Error fetching data from the database' })
      }

      let inventoryData

      // if (!Array.isArray(addTransactions)) {
      //   addTransactions = [];
      // }
      let addTransactions = []
      let subTransactions = []
      const currentDate = new Date().toISOString().split('T')[0]
      let totalTodayProductionQty = 0
      let totalTodayDispatchQty = 0
      const dailyProduction = {}
      const dailyDispatch = {}
      const last_Weeks = []
      const this_Weeks = []
      let series

      result.forEach(item => {
        const { item_code, trans_qty, trans_type, transaction_date } = item

        const parsedDate = new Date(transaction_date)
        const formattedDate = parsedDate.toISOString().split('T')[0]

        if (!addTransactions[item_code]) {
          addTransactions[item_code] = { total_qty: 0, transactions: [] }
        }

        if (!subTransactions[item_code]) {
          subTransactions[item_code] = { total_qty: 0, transactions: [] }
        }

        if (trans_type === 'add') {
          const existingIndex = addTransactions.findIndex(entry => entry.item_code === item_code)
          if (existingIndex !== -1) {
            addTransactions[existingIndex].total_qty += parseFloat(trans_qty)
          } else {
            addTransactions.push({ item_code, total_qty: parseFloat(trans_qty) })
          }

          if (currentDate === formattedDate) {
            totalTodayProductionQty += parseFloat(trans_qty)
          }

          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(new Date().getDate() - 14)
          if (parsedDate >= sevenDaysAgo && parsedDate) {
            const formattedProductionDate = parsedDate.toISOString().split('T')[0]
            dailyProduction[formattedProductionDate] =
              (dailyProduction[formattedProductionDate] || 0) + parseFloat(trans_qty)
          }
        } else {
          // subTransactions[item_code].total_qty += parseFloat(trans_qty)
          const existingIndex = subTransactions.findIndex(entry => entry.item_code === item_code)
          if (existingIndex !== -1) {
            subTransactions[existingIndex].total_qty += parseFloat(trans_qty)
          } else {
            subTransactions.push({ item_code, total_qty: parseFloat(trans_qty) })
          }

          if (currentDate === formattedDate) {
            totalTodayDispatchQty += parseFloat(trans_qty)
          }
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(new Date().getDate() - 14)

          if (parsedDate >= sevenDaysAgo && parsedDate) {
            const formattedDispatchDate = parsedDate.toISOString().split('T')[0]
            dailyDispatch[formattedDispatchDate] = (dailyDispatch[formattedDispatchDate] || 0) + parseFloat(trans_qty)
          }
        }
      })

      for (let i = 0; i < 14; i++) {
        const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
        const formattedDate = date.toISOString().split('T')[0]
        if (i < 7) {
          this_Weeks.push({
            date: formattedDate,
            production: dailyProduction[formattedDate] || 0,
            dispatch: dailyDispatch[formattedDate] || 0
          })
        } else {
          last_Weeks.push({
            date: formattedDate,
            production: dailyProduction[formattedDate] || 0,
            dispatch: dailyDispatch[formattedDate] || 0
          })
        }
      }

      // console.log(this_Weeks)
      // console.log(last_Weeks)

      // const extractValues = (data, type) => {
      //   return data.map(entry => {
      //     return type === 'production' ? entry.production : entry.dispatch
      //   })
      // }
      const extractValues = (data, type, reverse) => {
        return data.map(entry => {
          const value = type === 'production' ? entry.production : entry.dispatch

          return reverse ? -value : value
        })
      }

      // const extractValues = (data, type) => {
      //   return data
      //     .map(entry => {
      //       const value = type === 'production' ? entry.production : entry.dispatch

      //       // return -Math.abs(value)
      //       return value
      //     })
      //     .reverse()
      // }

      const thisWeekData = extractValues(this_Weeks, 'production', true).reverse()
      const lastWeekData = extractValues(last_Weeks, 'production', false).reverse()
      series = [
        { name: 'Last Week', data: lastWeekData },
        { name: 'This Week', data: thisWeekData }
      ]

      addTransactions = Object.fromEntries(
        Object.entries(addTransactions).filter(([item_code, { total_qty }]) => total_qty > 0)
      )
      subTransactions = Object.fromEntries(
        Object.entries(subTransactions).filter(([item_code, { total_qty }]) => total_qty)
      )

      // Convert addTransactions and subTransactions objects to arrays
      const addTransactionsArray = Object.values(addTransactions)
      const subTransactionsArray = Object.values(subTransactions)

      // Sorting the arrays by production and dispatch properties
      const sortedDataByProduction = addTransactionsArray.sort((a, b) => b.production - a.production).slice(0, 2)
      const sortedDataByDispatch = subTransactionsArray.sort((a, b) => b.dispatch - a.dispatch).slice(0, 2)

      console.log(sortedDataByProduction, sortedDataByDispatch)

      // const sortedAddEntries = Object.entries(addTransactions).sort((a, b) => b[1].total_qty - a[1].total_qty)
      // const topTwoAddEntries = sortedAddEntries.slice(0, 2)
      // const topTwoAddTransactions = Object.fromEntries(topTwoAddEntries)

      // const sortedSubEntries = Object.entries(subTransactions).sort((a, b) => b[1].total_qty - a[1].total_qty)
      // const topTwoSubEntries = sortedSubEntries.slice(0, 5)
      // const topTwoSubTransactions = Object.fromEntries(topTwoSubEntries)

      inventoryData = {
        topTwoAddTransactions: sortedDataByProduction,
        topTwoSubTransactions: sortedDataByDispatch,
        totalTodayProductionQty: totalTodayProductionQty,
        totalTodayDispatchQty: totalTodayDispatchQty,
        weeks: series
      }

      console.log('inventoryData:', inventoryData)

      res.status(200).json({ success: true, message: inventoryData })
    })

    // Close the database connection after the query execution
    // connection.end();
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}

// import connection from 'src/configs/db'
// import { transporter } from 'src/configs/nodemailer'
// import bcrypt from 'bcrypt'
// import jwt from 'jsonwebtoken'
// import { jwtConfig } from 'src/@fake-db/auth/jwt'

// export default async function handle(req, res) {
//   try {
//     const SelectQuery = `SELECT tim.item_code,
//     tim.vecv_part_no,
//     tsl.trans_type,
//     tsl.trans_qty,
//     tsl.transaction_no,
//     tsl.transaction_date,
//     tsl.transaction_no FROM tbl_stock_ledger tsl
//       JOIN tbl_item_master tim ON tim.item_id = tsl.item_id
//     `
//     connection.query(SelectQuery, (err, result) => {
//       if (err) {
//         console.error('Error fetching data:', err)

//         return
//       }

//       let inventoryData
//       let addTransactions = {}
//       let subTransactions = {}
//       const currentDate = new Date().toISOString().split('T')[0]
//       let totalTodayProductionQty = 0
//       let totalTodayDispatchQty = 0
//       const dailyProduction = {}
//       const dailyDispatch = {}
//       const last_Weeks = []
//       const this_Weeks = []
//       let series

//       result.forEach(item => {
//         const { item_code, trans_qty, trans_type, transaction_date } = item

//         const parsedDate = new Date(transaction_date)
//         const formattedDate = parsedDate.toISOString().split('T')[0]

//         if (!addTransactions[item_code]) {
//           addTransactions[item_code] = { total_qty: 0, transactions: [] }
//         }

//         if (!subTransactions[item_code]) {
//           subTransactions[item_code] = { total_qty: 0, transactions: [] }
//         }

//         if (trans_type === 'add') {
//           addTransactions[item_code].total_qty += parseFloat(trans_qty)

//           // addTransactions[item_code].transactions.push({
//           //   trans_qty
//           // })
//           if (currentDate === formattedDate) {
//             totalTodayProductionQty += parseFloat(trans_qty)
//           }

//           // const sevenDaysAgo = new Date()
//           // sevenDaysAgo.setDate(new Date().getDate() - 7)
//           // dailyProduction[formattedDate].production += parseFloat(trans_qty);

//           const sevenDaysAgo = new Date()
//           const currentDateCheck = new Date()
//           sevenDaysAgo.setDate(new Date().getDate() - 14)
//           if (parsedDate >= sevenDaysAgo && parsedDate) {
//             const formattedProductionDate = parsedDate.toISOString().split('T')[0]
//             dailyProduction[formattedProductionDate] =
//               (dailyProduction[formattedProductionDate] || 0) + parseFloat(trans_qty)
//           }

//           // if (parsedDate >= sevenDaysAgo && parsedDate <= currentDate) {
//           //   dailyDispatch[formattedDate] = (dailyDispatch[formattedDate] || 0) + parseFloat(trans_qty)
//           // }
//         } else {
//           subTransactions[item_code].total_qty += parseFloat(trans_qty)

//           // subTransactions[item_code].transactions.push({
//           //   trans_qty
//           // })
//           if (currentDate === formattedDate) {
//             totalTodayDispatchQty += parseFloat(trans_qty)
//           }
//           const sevenDaysAgo = new Date()
//           sevenDaysAgo.setDate(new Date().getDate() - 14)

//           console.log(parsedDate >= sevenDaysAgo && parsedDate <= currentDate)

//           if (parsedDate >= sevenDaysAgo && parsedDate) {
//             const formattedDispatchDate = parsedDate.toISOString().split('T')[0]
//             dailyDispatch[formattedDispatchDate] = (dailyDispatch[formattedDispatchDate] || 0) + parseFloat(trans_qty)
//           }
//         }
//       })

//       console.log(dailyProduction)
//       console.log(dailyDispatch)

//       // const lastTwoWeeks = []
//       for (let i = 0; i < 14; i++) {
//         const date = new Date(new Date().getTime() - i * 24 * 60 * 60 * 1000)
//         const formattedDate = date.toISOString().split('T')[0]
//         if (i < 7) {
//           // Push dates within last week
//           this_Weeks.push({
//             date: formattedDate,
//             production: dailyProduction[formattedDate] || 0,
//             dispatch: dailyDispatch[formattedDate] || 0
//           })
//         } else {
//           // Push dates from 7th day ago to 13th day ago
//           last_Weeks.push({
//             date: formattedDate,
//             production: dailyProduction[formattedDate] || 0,
//             dispatch: dailyDispatch[formattedDate] || 0
//           })
//         }

//         const extractValues = (data, type) => {
//           return data.map(entry => {
//             return type === 'production' ? entry.production : entry.dispatch
//           })
//         }

//         const thisWeekData = extractValues(this_Weeks, 'production').reverse()

//         // const thisWeekData = extractValues(this_Weeks, 'dispatch').reverse()
//         const lastWeekData = extractValues(last_Weeks, 'production').reverse()

//         // const lastWeekData = extractValues(last_Weeks, 'dispatch').reverse()
//         series = [
//           { name: 'Last Week', data: lastWeekData },
//           { name: 'This Week', data: thisWeekData }
//         ]

//         // lastTwoWeeks.push({
//         //   date: formattedDate,
//         //   production: dailyProduction[formattedDate] || 0,
//         //   dispatch: dailyDispatch[formattedDate] || 0
//         // })
//       }
//       addTransactions = Object.fromEntries(
//         Object.entries(addTransactions).filter(([item_code, { total_qty }]) => total_qty > 0)
//       )
//       subTransactions = Object.fromEntries(
//         Object.entries(subTransactions).filter(([item_code, { total_qty }]) => total_qty)
//       )

//       const sortedAddEntries = Object.entries(addTransactions).sort((a, b) => b[1].total_qty - a[1].total_qty)
//       const topTwoAddEntries = sortedAddEntries.slice(0, 2)
//       const topTwoAddTransactions = Object.fromEntries(topTwoAddEntries)

//       const sortedSubEntries = Object.entries(subTransactions).sort((a, b) => b[1].total_qty - a[1].total_qty)
//       const topTwoSubEntries = sortedSubEntries.slice(0, 5)
//       const topTwoSubTransactions = Object.fromEntries(topTwoSubEntries)

//       inventoryData = {
//         topTwoAddTransactions: topTwoAddTransactions,
//         topTwoSubTransactions: topTwoSubTransactions,
//         totalTodayProductionQty: totalTodayProductionQty,
//         totalTodayDispatchQty: totalTodayDispatchQty,
//         weeks: series
//       }
//       console.log('inventoryData')

//       // console.log(totalTodayDispatchQty)

//       return res.status(500).json({ success: true, message: inventoryData })
//     })
//   } catch (err) {
//     console.error('Error:', err)
//     res.status(500).json({ error: 'Internal server error' })
//   }
// }
