import '../styles/styles.css'
import React from 'react'
import { AuthProvider } from '../hooks/useAuth'
import { AppProps } from 'next/app'
import LoadingPlaceholder from '../components/LoadingPlaceholder'

function MyApp ({ Component, pageProps }: AppProps) {
  // wrap entire application in authentication
  return (
    <AuthProvider>
      <LoadingPlaceholder />
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
