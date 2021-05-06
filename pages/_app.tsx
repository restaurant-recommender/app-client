import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"
import Head from "next/head"
import * as locales from "../locale"
import dynamic from "next/dynamic";
// import { CookiesProvider } from 'react-cookie'

import "../styles/global.scss";
import "../styles/antd.less";
import { en, th } from "../locale";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale, pathname } = router
  const messages = locales[locale]

  return (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      <Head>
        <title>{locale === 'th' ? th.appName : en.appName}</title>
      </Head>
      <div className="app">
        <Component {...pageProps} />
      </div>
    </IntlProvider>
  ) 
}

// export default dynamic(() => Promise.resolve(MyApp), {
//   ssr: false,
// });