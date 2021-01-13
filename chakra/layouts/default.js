import { useEffect } from "react";
import { Box, Flex } from "@chakra-ui/react";
import useColor from "../hooks/use-color";

import { Header, ModeToggle } from "../components";
// import { AuthButton } from "../../components/auth/auth-buttons";
import CustomLink from "@/components/link/custom-link";
import { NavProvider } from "../contexts/nav-context";
import { useToastState } from "../contexts/toast-context";
import { LogoIcon } from "@/components";
import data from "../../config/setup.json";

export function DefaultLayout({ title, SEO, config, Components = [], children}) {
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
          <Header
            title='Proto UI'
            pages={data?.pages || []}
            controls={[
              // AuthButton,
              CustomLink
            ]}
            headerShow={config?.headerShow}
            bg={color("barBg")}
            Logo={LogoIcon}
          />
        </NavProvider>
        <Box as='main' layerStyle='main'>
          {children}
        </Box>
        <Flex
          as='footer'
          bg={color("barBg")}
          layerStyle='footer'
          display={config?.footerShow ? "flex" : "none"}
        >
          <Box layerStyle='footer.body'>
            {Components.length && Components[1] ? Components[1] : "footer"}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
