import React, { useEffect } from "react";
import { Avatar, Box, chakra, Flex, Heading, Slide } from "@chakra-ui/react";

import { Nav } from "./nav";

import { useNavDispatch } from "@/chakra/contexts/nav-context";
// import { useSession } from "next-auth/client";
import { constants } from "../structure/constants";

const SlideHeader = chakra(Slide, {
  shouldForwardProp: (prop) => !["no-op"].includes(prop),
});

export const Header = ({
  title,
  Logo,
  pages,
  controls,
  headerShow = false,
  ...rest
}) => {
  const { updatePages, updateControls } = useNavDispatch();
  // const [session] = useSession();

  useEffect(() => {
    if (!pages) return;
    updatePages(pages);
  }, []);

  useEffect(() => {
    if (!controls) return;
    updateControls(controls);
  }, []);

  return (
    headerShow && (
      <SlideHeader
        as='header'
        direction='top'
        in={headerShow}
        {...rest}
        layerStyle='header'
        style={{ width: "100%", height: constants.headerHeight, zIndex: 1100 }}
      >
        <Flex layerStyle='header.body'>
          {Logo ? (
            <Logo title={title} w={12} h={12} minW='1/5' mr='auto' />
          ) : (
            <Heading
              as='h1'
              m={0}
              color='inherit'
              fontSize={["2xl", null, null, "3xl"]}
              pl={[4, null, null, null, 0]}
              flex={0}
              minW='25%'
            >
              {title}
            </Heading>
          )}
          <Nav title={title} {...{ Logo }} />
          {/* {session && (
            <Avatar
              size='sm'
              src={session.user.profile.avatar}
              className='user'
              ml={4}
              my='auto'
            />
          )} */}
        </Flex>
      </SlideHeader>
    )
  );
};
