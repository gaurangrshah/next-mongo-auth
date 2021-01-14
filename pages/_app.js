import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";

import { theme } from "@/chakra";
import { ToastProvider } from "@/chakra/contexts/toast-context";
import { DefaultLayout } from "@/chakra/layouts/default";
import SEO from "../next-seo.config";
import Footer from "@/components/chakra/footer";
import Header from "@/components/chakra/nav-bar/header"
import CustomLink from "@/components/link/custom-link";
import Nprogress from "@/components/nprogress";
import data from "@/config/setup.json"

const App = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ChakraProvider resetCSS theme={theme}>
        <Nprogress />
        <ToastProvider>
          <DefaultLayout
            bars={[
              <Header
                title='Proto UI'
                pages={data?.pages || []}
                controls={[CustomLink]}
                headerShow={true}
              />,
              <Footer />,
            ]}
          >
            <Component {...pageProps} />
          </DefaultLayout>
        </ToastProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
