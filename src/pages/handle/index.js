export const get_coordinates = (event, setClickedArea) => {
  const image = event.target
  const rect = image.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  console.log(x + 'and' + y)

  setClickedArea({ x, y })
}
