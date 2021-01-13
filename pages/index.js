import Head from "next/head";
import { Box, Code, Flex, Heading, Image, Link, Text } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box layerStyle='container'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Box pt='12' textAlign='center'>
        <Heading as='h1' color='blue.600'>
          Welcome to <a href='https://nextjs.org'>Next.js!</a>
        </Heading>

        <Text>
          Get started by editing{" "}
          <Code bg='gray.200' borderRadius='5px' p={2} fontSize='sm'>
            pages/index.js
          </Code>
        </Text>

        <Flex
          layerStyle='responsive'
          align='center'
          justify='center'
          flexWrap='wrap'
        >
          <Link href='https://nextjs.org/docs' layerStyle='card'>
            <Heading as='h3'>Documentation &rarr;</Heading>
            <Text lineHeight='6' fontSize='md'>
              Find in-depth information about Next.js features and API.
            </Text>
          </Link>

          <Link href='https://nextjs.org/learn' layerStyle='card'>
            <Heading as='h3' mb={5}>
              Learn &rarr;
            </Heading>
            <Text lineHeight='6' fontSize='md'>
              Learn about Next.js in an interactive course with quizzes!
            </Text>
          </Link>

          <Link
            href='https://github.com/vercel/next.js/tree/master/examples'
            layerStyle='card'
          >
            <Heading as='h3' mb={5}>
              Examples &rarr;
            </Heading>
            <Text lineHeight='6' fontSize='md'>
              Discover and deploy boilerplate example Next.js projects.
            </Text>
          </Link>

          <Link
            href='https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
            layerStyle='card'
          >
            <Heading as='h3' mb={5}>
              Deploy &rarr;
            </Heading>
            <Text lineHeight='6' fontSize='md'>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </Text>
          </Link>
        </Flex>
      </Box>

      <Flex layerStyle='flexCenter'>
        <Link
          href='https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app'
          target='_blank'
          rel='noopener noreferrer'
          textAlign='center'
          mx='auto'
        >
          Powered by <Image src='/vercel.svg' alt='Vercel Logo' h='3' mx="auto"/>
        </Link>
      </Flex>
    </Box>
  );
}
