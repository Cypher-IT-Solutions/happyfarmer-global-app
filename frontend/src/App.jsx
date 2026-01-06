import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import FarmerList from "./pages/FarmerList";
import FarmerDetail from "./pages/FarmerDetail";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Cart from "./pages/Cart";
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerProducts from './pages/FarmerProducts';
import MyOrders from './pages/MyOrders';
import BecomeFarmer from './pages/BecomeFarmer';
import Profile from './pages/Profile';
import ChangePassword from './pages/settings/ChangePassword';
import UpdateAddress from './pages/settings/UpdateAddress';
import InactivityTimer from './components/InactivityTimer';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <InactivityTimer timeout={1800000} /> {/* 30 minutes timeout */}
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/farmers" element={<FarmerList />} />
              <Route path="/farmers/:id" element={<FarmerDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route path="/products" element={<FarmerProducts />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/become-farmer" element={<BecomeFarmer />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings/password" element={<ChangePassword />} />
              <Route path="/settings/address" element={<UpdateAddress />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
