import '../styles/styles.css'
import React from 'react'
import { AuthProvider } from '../hooks/useAuth'
import { AppProps } from 'next/app'
import LoadingPlaceholder from '../components/LoadingPlaceholder'

function MyApp ({ Component, pageProps }: AppProps) {
  // wrap entire application in authentication
  return (
    <AuthProvider>
      <div className="resp-scale min-w-screen min-h-screen flex flex-col items-center justify-center gap-8">
        <img src="/ml.png" />
        <div id="loading-and-content">
          <LoadingPlaceholder />
          <Component {...pageProps} />
        </div>
      </div>
    </AuthProvider>
  )
}

export default MyApp
