"use client";

import { useDispatch, useSelector } from "react-redux";
import { getPendingLoans, reviewLoan } from "../store/slice/officerSlice.js";
import { toast } from "react-toastify";

const dummyPendingRequests = [
  {
    id: 1,
    customerName: "John Doe",
    amount: 50000,
    tenure: "24 months",
    appliedDate: "2024-02-01",
    creditScore: 750,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    amount: 75000,
    tenure: "36 months",
    appliedDate: "2024-02-05",
    creditScore: 680,
  },
  {
    id: 3,
    customerName: "Michael Johnson",
    amount: 100000,
    tenure: "48 months",
    appliedDate: "2024-02-10",
    creditScore: 720,
  },
];

export default function OfficerDashboard() {
  const { loading, error, message, pendingLoans } = useSelector(
    (state) => state.officer
  );
  const dispatch = useDispatch();
  const handleReviewLoan = (loanId) => {
    dispatch(reviewLoan(loanId)).then((res) => {
      if (res.success) {
        toast.success(res.response.message);
      }
    });
  };

  const getCreditScoreColor = (score) => {
    if (score >= 750) return "text-green-600";
    if (score >= 700) return "text-blue-600";
    if (score >= 650) return "text-yellow-600";
    return "text-red-600";
  };

  function getFormattedDate(date) {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function handleGetPendingLoans() {
    dispatch(getPendingLoans()).then((res) => {
      if (res.success) {
        toast.success(res.response.message);
      }
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Pending Loan Requests
        </h2>
        <div className="flex gap-2 ">
          <button
            onClick={handleGetPendingLoans}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Get Pending Loans
          </button>
        </div>
      </div>

      {/* Pending Requests Table */}
      {pendingLoans?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tenure{" "}
                  <span className="text-[10px] text-gray-600 lowercase">
                    (months)
                  </span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Credit Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingLoans.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                    #{request._id.slice(-4).padStart(7, ".")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.customerId.userId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    &#8377; {request.amountRequested?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {request.tenureMonths}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getCreditScoreColor(
                      request.customerId.creditScore
                    )}`}
                  >
                    {request.customerId.creditScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getFormattedDate(request.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleReviewLoan(request._id)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition duration-200"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
