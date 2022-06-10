import '../styles/styles.css'
import React from 'react'
import type { AppProps } from 'next/app'

function MyApp ({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

module.exports = MyApp
