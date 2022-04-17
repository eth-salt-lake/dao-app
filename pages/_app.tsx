import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../components/hoc/Layout'
import Head from "next/head"
import theme from "../lib/theme"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ETH Salt Lake</title>
      </Head>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
      <script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
    </>
  )
}

export default MyApp
