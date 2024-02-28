import dynamic from 'next/dynamic'

// Import ReactApexcharts dynamically to avoid 'Window is not defined' error
const ReactApexcharts = dynamic(() => import('react-apexcharts'), { ssr: false })

// // Assuming this component receives analytics.weeks as a prop
// const YourComponent = ({ data }) => {
//   return (
//     <>
//       <ReactApexcharts />
//     </>
//   )
// }

export default ReactApexcharts
