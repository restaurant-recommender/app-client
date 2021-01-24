import { Box } from "../Box/Box"

import "./Loading.scss"

interface ILoading {
  message: string
}

export const Loading = (prop: ILoading) => {
  return (
    <div>
      { prop.message && prop.message !== '|' && <Box display="flex" width="100vw" height="100vh" position="fixed" zIndex={1999} background="#00000050" top="0" left="0" backdropFilter="blur(6px)">
        <Box display="flex" background="white" borderRadius="16px" width="200px" height="200px" margin="auto">
          <Box margin="auto" textAlign="center">
            <Box height="1.5rem"/>
            <div className="lds-ripple"><div></div><div></div></div>
            <Box marginTop="1rem" color="#a0a0a0">
              {prop.message}
            </Box>
          </Box>
        </Box>
      </Box>}
    </div>
  )
}