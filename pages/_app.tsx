import { IntlProvider } from "react-intl"
import { useRouter } from "next/router"
import * as locales from "../locale"

import "../styles/global.scss";
import "../styles/antd.less";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { locale, defaultLocale, pathname } = router
  const localeCopy = locales[locale]
  const messages = localeCopy[pathname]

  return (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
      <div className="app">
        <Component {...pageProps} />
      </div>
    </IntlProvider>
  ) 
}