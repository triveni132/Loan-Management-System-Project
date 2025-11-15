import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import HomeComponent from "./pages/HomePage.js";
import LoginComponent from "./pages/LoginPage.js";
import RegisterComponent from "./pages/RegisterPage.js";
import { ToastContainer } from "react-toastify";
import { getUser } from "./store/slice/authSlice.js";
import { useEffect } from "react";

function App() {
  const { loading, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Run only once on refresh/mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // GLOBAL LOADING SCREEN (before checking authentication)
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="select-none">
      <Router>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/register" element={<RegisterComponent />} />
        </Routes>
        <ToastContainer theme="dark" />
      </Router>
    </div>
  );
}

export default App;
