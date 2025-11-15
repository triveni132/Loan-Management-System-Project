"use client";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slice/authSlice.js";
import CustomerDashboard from "../components/CustomerDashboard.js";
import OfficerDashboard from "../components/OfficerDashboard.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HomeComponent() {
  const {
    loading,
    error,
    message,
    user: userData,
    isAuthenticated,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate("/login");
      }
    }
  }, [loading, isAuthenticated]);

  if (loading || !isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Loan Management System
            </h1>
            <p className="text-gray-600 text-sm">Welcome, {userData.name}</p>
          </div>
          <button
            onClick={() => {
              dispatch(logout());
            }}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600 text-sm font-medium">Name</p>
              <p className="text-gray-900 font-semibold">{userData.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Email</p>
              <p className="text-gray-900 font-semibold">{userData.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-medium">Role</p>
              <p className="text-gray-900 font-semibold">{userData.role}</p>
            </div>

            {userData.role === "CUSTOMER" && (
              <>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Salary</p>
                  <p className="text-gray-900 font-semibold">
                    &#8377;{userData.salary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    Credit Score
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {userData.creditScore}
                  </p>
                </div>
              </>
            )}

            {userData.role === "OFFICER" && (
              <div>
                <p className="text-gray-600 text-sm font-medium">Branch</p>
                <p className="text-gray-900 font-semibold">{userData.branch}</p>
              </div>
            )}
          </div>
        </div>

        {/* Role-based Dashboard */}
        {userData.role === "CUSTOMER" ? (
          <CustomerDashboard userData={userData} />
        ) : (
          <OfficerDashboard userData={userData} />
        )}
      </main>
    </div>
  );
}
