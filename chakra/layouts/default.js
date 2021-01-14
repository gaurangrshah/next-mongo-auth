import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import useColor from "../hooks/use-color";

import { ModeToggle } from "../components";
import { NavProvider } from "../../components/chakra/contexts/nav-context";
import { useToastState } from "../contexts/toast-context";

export function DefaultLayout({ bars = [], children }) {
  const { color } = useColor();
  const { msg, toast } = useToastState();

  useEffect(() => {
    if (!msg) return;
    toast(msg);
  }, [msg]);

  return (
    <>
      <ModeToggle />
      <Flex className='wrapper' layerStyle='wrapper'>
        <NavProvider>
          {bars.length && bars[0] ? bars[0] : null}
        </NavProvider>
        <Box as='main' layerStyle='main'>
          {children}
        </Box>
        <Flex
          as='footer'
          bg={color("barBg")}
          layerStyle='footer'
        >
          <Box layerStyle='footer.body'>
            {bars.length && bars[1] ? bars[1] : "footer"}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
