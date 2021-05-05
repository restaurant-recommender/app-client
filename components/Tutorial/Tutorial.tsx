import { useEffect, useState } from "react"
import { Box } from "../Box/Box"

interface IProp {
  pages: string[]
  visible: boolean
  onClose: () => void
}

export const Tutorial = (prop: IProp) => {

  // const [visible, setVisible] = useState<boolean>(prop.active)
  const [currentPage, setCurrentPage] = useState<number>(0)

  // useEffect(() => {
  //   console.log('update visible')
  //   setVisible(prop.active)
  // }, [prop.active])

  const handleClick = (e: Event) => {
    e.stopPropagation()
    if (currentPage === prop.pages.length - 1) {
      // setVisible(false)
      prop.onClose()
      setCurrentPage(0)
    } else {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <>{prop.visible && <Box onClick={handleClick} position="fixed" left="0" top="0" background="#666666" width="100%" height="100%" display="flex" zIndex={10000}>
      <img src={`/tutorial/${prop.pages[currentPage]}.png`} style={{objectFit: "contain", minHeight: "100%", minWidth: "100%"}}/>
      <Box position="fixed" bottom="1rem" right="1rem" color="white" zIndex={10001}>Tap anywhere to continue.</Box>
    </Box>}</>
  )
}