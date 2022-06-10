import '../styles/styles.css'
import { AuthProvider } from '../hooks/useAuth'

function MyApp({ Component, pageProps }) {

  //wrap entire application in authentication
  
  return ( 
  <AuthProvider>
    <Component {...pageProps} />
  </AuthProvider>
  )
  
}

export default MyApp