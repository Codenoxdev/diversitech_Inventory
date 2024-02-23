import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Grid, Button, Modal, Typography, Card } from '@mui/material'
import Link from 'next/link'
import CloseIcon from '@mui/icons-material/Close'

const CowlDetails = () => {
  const router = useRouter()
  const { item_code, part } = router.query

  const partImageMap = {
    1: '/image/cowl/zone1.png',
    2: '/image/cowl/zone2.png',
    3: '/image/cowl/zone3.png',
    4: '/image/cowl/zone4.png'
  }

  const partImageMap2 = {
    1: '/image/cowl/zone3.png',
    2: '/image/cowl/zone4.png',
    3: '/image/cowl/zone1.png',
    4: '/image/cowl/zone2.png'
  }

  const partImage = {
    1: '/image/cowl/zone.png',
    2: '/image/cowl/zone+.png',
    3: '/image/cowl/zone.png',
    4: '/image/cowl/zone+.png'
  }

  const imageUrl = partImageMap[part]
  const image = partImage[part]
  const imageUrl2 = partImageMap2[part]

  const partBlocks = {
    1: [
      { x: -140, y: -120 },
      { x: -110, y: -80 },
      { x: -10, y: 100 },
      { x: 90, y: 0 },
      { x: 150, y: -170 }
    ],
    2: [
      { x: -80, y: -120 },
      { x: -110, y: -60 },
      { x: 110, y: 60 },
      { x: -10, y: 100 },
      { x: 170, y: -170 }
    ],
    3: [
      { x: 60, y: 130 },
      { x: 110, y: -80 },
      { x: 0, y: -110 },
      { x: 50, y: -160 },
      { x: -100, y: -150 }
    ],
    4: [
      { x: 85, y: -160 },
      { x: 100, y: -110 },
      { x: -120, y: -30 },
      { x: -150, y: 50 },
      { x: 150, y: -190 }
    ]
  }

  const [blocks, setBlocks] = useState(partBlocks[part] || [])
  const [submitted, setSubmitted] = useState(false)
  const [printPreviewOpen, setPrintPreviewOpen] = useState(false)
  const [actualCondition, setActualCondition] = useState(false)

  const handleBlockClick = index => {
    if (!submitted) {
      const newBlocks = [...blocks]
      newBlocks[index] = { ...newBlocks[index], color: 'green' }
      setBlocks(newBlocks)
    }
  }

  const allBlocksGreen = blocks.every(block => block.color === 'green')

  // Update actualCondition based on allBlocksGreen
  useEffect(() => {
    setActualCondition(allBlocksGreen)
  }, [allBlocksGreen])

  const handlePrintConfirmation = () => {
    if (allBlocksGreen) {
      setPrintPreviewOpen(true)
    } else {
      setPrintPreviewOpen(true)
    }
  }

  const handlePrint = () => {
    console.log('Printing...')
    window.print()
    const targetPage = `/components/Cowl/?item_code=${item_code}&ClickPart=${part}&condition=${actualCondition}`
    router.push(targetPage)
  }

  const handleSave = () => {
    console.log('Saving...')
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
      <Grid>
        {item_code && (
          <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Typography variant='h5'>Part Number: {item_code}</Typography>
            </div>
            <div>
              <Typography variant='h5'>Sub Part: {part}</Typography>
            </div>

            <div>
              <Typography variant='h5'>Date: {getCurrentDate()}</Typography>
            </div>
          </div>
        )}
        <Grid item>
          <img src={image} alt={`Part ${part} Image`} style={{ width: '200px', height: '200px', marginLeft: '10px' }} />
        </Grid>
        <Grid container direction='column' justifyContent='center' alignItems='center'>
          <Grid item>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={imageUrl}
                alt={`Part ${part} Image`}
                style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              />
              {blocks.map((block, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: block.x,
                    top: block.y,
                    backgroundColor: block.color || 'red',
                    width: '20px',
                    height: '20px',
                    zIndex: 999
                  }}
                  onClick={() => handleBlockClick(index)}
                />
              ))}
            </div>
          </Grid>
        </Grid>

        <Modal
          open={printPreviewOpen}
          onClose={() => setPrintPreviewOpen(false)}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Grid
            container
            direction='column'
            justifyContent='center'
            alignItems='center'
            style={{
              minHeight: '50vh',
              minWidth: '50vw',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px'
            }}
          >
            <CloseIcon
              onClick={() => setPrintPreviewOpen(false)}
              style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'red' }}
            />
            <Grid item id='print-content'>
              <p className='image-info'>
                Image ID: {item_code} Part: {part}
              </p>
              {actualCondition ? <p>result: Pass</p> : <p>result: Failed</p>}
              <img src={imageUrl} alt={`Part ${part} Image`} style={{ maxWidth: '100%', maxHeight: '70vh' }} />
            </Grid>
            <Grid item>
              <Button variant='contained' onClick={handlePrint} className='print-button'>
                Print
              </Button>
            </Grid>
          </Grid>
        </Modal>

        <style jsx global>{`
          @media print {
            .print-button,
            .image-info {
              display: none;
            }
          }
        `}</style>
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <img
            src={imageUrl2}
            alt={`Part ${part} Image`}
            style={{ width: '300px', height: '300px', marginRight: '-600px' }}
          />
        </Grid>
        <Grid container padding='10px' justifyContent='center' alignItems='center'>
          <Link href={`/components/Cowl?item_code=${item_code}`}>
            <Button size='medium' variant='contained'>
              Back
            </Button>
          </Link>
          <Button size='medium' variant='contained' onClick={handleSave} style={{ marginLeft: '10px' }}>
            Save
          </Button>

          <Button
            size='medium'
            variant='contained'
            onClick={handlePrintConfirmation}
            className='print-button'
            style={{ marginLeft: '10px' }}
          >
            Print
          </Button>
        </Grid>
      </Grid>
    </Card>
  )
}

export default CowlDetails
