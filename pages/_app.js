import { ChakraProvider } from "@chakra-ui/react";

import { theme } from "@/chakra";
import { ToastProvider } from "@/chakra/contexts/toast-context";
import { DefaultLayout } from "@/chakra/layouts/default";

const App = ({ Component, pageProps }) => {
  return (
    <>
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
