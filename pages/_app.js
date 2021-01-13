import { ChakraProvider } from "@chakra-ui/react";
import { DefaultSeo } from "next-seo";

import { theme } from "@/chakra";
import { ToastProvider } from "@/chakra/contexts/toast-context";
import { DefaultLayout } from "@/chakra/layouts/default";
import SEO from "../next-seo.config";

const App = ({ Component, pageProps }) => {
  return (
    <>
      <DefaultSeo {...SEO} />
      <ChakraProvider resetCSS theme={theme}>
        <ToastProvider>
          <DefaultLayout config={{ headerShow: true, footerShow: true }}>
            <Component {...pageProps} />
          </DefaultLayout>
        </ToastProvider>
      </ChakraProvider>
    </>
  );
};

export default App;
