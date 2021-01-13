import React, { useState } from 'react'
import { Box, Button, Code } from '@chakra-ui/react'

export const Json = ({ data }) => {
  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    setOpen(data ? true : false)
  }, [data])

  return (
    open && (
      <Box
        // position="absolute"
        // top="2em"
        // right="1em"
        bg="blue"
        border="1px sold red"
      >
        <Button top="10px" left="10px" onClick={() => setOpen(false)}>
          X
        </Button>
        <Code>{JSON.stringify(data, null, 2)}</Code>
      </Box>
    )
  )
}
