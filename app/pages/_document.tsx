import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head>
          <link rel="manifest" href="/manifest.json"></link>
          <link rel="apple-touch-icon" href="/public/coffee-icon-192.png"></link>
          <meta name="theme-color" content="#414243" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
