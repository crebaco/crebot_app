import configureFakeBackend from './common/api/fake-backend'
import { AuthProvider, ThemeProvider } from './common/context'
import AllRoutes from './routes/Routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss'
import './assets/scss/icons.scss'

configureFakeBackend()

function App() {
	return (
		<ThemeProvider>
			<AuthProvider>
			<ToastContainer 
                    position="top-center" 
                    autoClose={2000} 
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    toastStyle={{ marginTop: '50px' }}
                />
				<AllRoutes />
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App
