import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      {/* App Routes */}
      <AppRoutes />
      
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;