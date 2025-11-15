import { useState } from "react";
import LoanModal from "./LoanModal.js";
import { useDispatch, useSelector } from "react-redux";
import { applyLoan, getMyLoans } from "../store/slice/loanSlice.js";
import { toast } from "react-toastify";

const dummyLoans = [
  {
    id: 1,
    status: "Approved",
    amount: 50000,
    appliedDate: "2024-01-15",
    tenure: "24 months",
  },
  {
    id: 2,
    status: "Pending",
    amount: 75000,
    appliedDate: "2024-02-20",
    tenure: "36 months",
  },
  {
    id: 3,
    status: "Rejected",
    amount: 100000,
    appliedDate: "2024-03-10",
    tenure: "48 months",
  },
];

export default function CustomerDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [loans, setLoans] = useState(dummyLoans);
  const dispatch = useDispatch();
  const { loading, error, message, myLoans, currentLoan } = useSelector(
    (state) => state.loan
  );

  const getMyLoansHandler = () => {
    dispatch(getMyLoans());
  };

  const handleApplyLoan = (loanData) => {
    dispatch(applyLoan(loanData)).then((result) => {
      if (result.success) {
        toast.success(result.response.message);
        setIsModalOpen(false);
      } else {
        toast.error(result.error.response.data.message);
        setIsModalOpen(false);
      }
    });

    setIsModalOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  return (
    <div>
      {/* Applied Loans Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Applied Loans</h2>
          <div className="flex gap-2 ">
            <button
              onClick={getMyLoansHandler}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Get My Loans
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Apply New Loan
            </button>
          </div>
        </div>

        {/* Loans Table */}
        {myLoans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Loan ID
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
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {myLoans?.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                      #{loan._id.slice(-4).padStart(7, ".")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      &#8377;{loan.amountRequested.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.tenureMonths}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getFormattedDate(loan.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          loan.status || "Pending"
                        )}`}
                      >
                        {loan.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loan Modal */}
      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplyLoan}
      />
    </div>
  );
}
