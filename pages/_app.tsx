import "../styles/global.scss";
import "../styles/antd.less";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <div className="app">
    <Component {...pageProps} />
  </div>
}