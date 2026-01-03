import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import AppRoutes from './routes/AppRoutes';
import { useWebSocket } from './hooks/useWebSocket';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  // Initialize WebSocket connection (will connect when user is authenticated)
  useWebSocket();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        {/* App Routes */}
        <AppRoutes />
        <ScrollToTop />
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;