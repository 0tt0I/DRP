import '../styles/styles.css'
import { AuthProvider } from '../hooks/useAuth'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {

  //wrap entire application in authentication
  
  return ( 
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  )
  
}

export default MyApp