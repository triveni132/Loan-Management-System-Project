import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../store/slice/authSlice.js";
import { toast } from "react-toastify";

export default function RegisterComponent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [salary, setSalary] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [branch, setBranch] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        navigate("/");
      }
    }
  }, [loading, isAuthenticated]);
  if (loading || isAuthenticated) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );
  }

  const handleRegister = (e) => {
    e.preventDefault();

    const registrationData = {
      name: username,
      email,
      password,
      role,
      ...(role === "CUSTOMER" && {
        salary: Number(salary),
        creditScore: Number(creditScore),
      }),
      ...(role === "OFFICER" && { branch }),
    };

    dispatch(register(registrationData)).then((result) => {
      if (result.success) {
        toast.success(result.response.message);
        navigate("/login");
      } else {
        toast.error(result.error.response.data.message);
      }
    });
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-md overflow-y-scroll h-full scroll-hide rounded-lg">
        <div className="bg-white  shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Create Account
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Register to get started
          </p>

          {isSubmitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                Registration successful! Redirecting to login...
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
            </div>

            {/* Role Select */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="OFFICER">Officer</option>
              </select>
            </div>

            {/* Conditional Fields - Customer Role */}
            {role === "CUSTOMER" && (
              <>
                <div>
                  <label
                    htmlFor="salary"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Salary
                  </label>
                  <input
                    type="number"
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="Enter your salary"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="creditScore"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Credit Score
                  </label>
                  <input
                    type="number"
                    id="creditScore"
                    value={creditScore}
                    onChange={(e) => setCreditScore(e.target.value)}
                    placeholder="Enter your credit score"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </>
            )}

            {/* Conditional Fields - Officer Role */}
            {role === "OFFICER" && (
              <div>
                <label
                  htmlFor="branch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Branch
                </label>
                <input
                  type="text"
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="Enter your branch"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            )}

            {/* Register Button */}
            <button
              onClick={handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 mt-6"
            >
              Register
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
