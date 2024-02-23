import { useState } from 'react'
import { Button, Card, Grid, IconButton, TableRow, Typography } from '@mui/material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import Link from 'next/link'
import cowlDetails from '../CowlDetails/cowldetails'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import { useRouter } from 'next/router'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  '&:last-of-type td, &:last-of-type th': {
    border: 0
  }
}))

const CowlImg = () => {
  const [clickedPart, setClickedPart] = useState(null)
  const router = useRouter()
  const { item_code, ClickPart, condition } = router.query
  const Condition = typeof condition === 'string' ? condition.toLowerCase() === 'true' : undefined

  const handlePartClick = (item_code, part) => {
    setClickedPart({ item_code, part })

    const targetPage = `/components/Cowl/CowlDetails/?item_code=${item_code}&part=${part}`
    router.push(targetPage)
  }

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    let month = today.getMonth() + 1
    let day = today.getDate()

    // Ensure month and day are formatted with leading zeros if necessary
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day

    return `${day}-${month}-${year}`
  }

  return (
    <Card>
      {item_code && (
        <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant='h5'>Part Number: {item_code}</Typography>
          </div>
          <div>
            <Typography variant='h5'>Cowl Inspection Process</Typography>
          </div>

          <div>
            <Typography variant='h5'>Date: {getCurrentDate()}</Typography>
          </div>
        </div>
      )}
      <Grid container direction='column' justifyContent='center' alignItems='center'>
        <div className='image-container'>
          {[1, 2, 3, 4].map(part => (
            <div
              key={part}
              className={`image-box ${
                Condition === true
                  ? ClickPart == part
                    ? 'highlight'
                    : ''
                  : Condition === false && ClickPart == part
                  ? 'highlight-red'
                  : ''
              }`}
              onClick={() => handlePartClick(item_code, part)}
            >
              <div
                className={`image-part`}
                style={{
                  backgroundImage: `url('/image/cowl/${part}.PNG')`,
                  backgroundPosition:
                    part === 1 ? 'top left' : part === 2 ? 'top right' : part === 3 ? 'bottom left' : 'bottom right',
                  backgroundSize: 'cover',
                  width: '100%',
                  height: '100%',
                  cursor: 'pointer'
                }}
              />
            </div>
          ))}
        </div>
      </Grid>
      <Grid container padding='20px' justifyContent='center' alignItems='center'>
        <Link href='/components/Diversitech/Workers/Cowl/'>
          <Button size='medium' variant='contained'>
            Back
          </Button>
        </Link>
      </Grid>

      {/* Internal CSS */}
      <style jsx>{`
        .image-container {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          width: 400px;
          height: 400px;
        }

        .image-box {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .highlight {
          border: 5px solid green;
        }
        .highlight-red {
          border: 5px solid red;
        }
      `}</style>
    </Card>
  )
}

export default CowlImg
