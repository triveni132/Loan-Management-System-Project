import { useState } from "react";

export default function LoanModal({ isOpen, onClose, onSubmit }) {
  const [amount, setAmount] = useState("");
  const [tenure, setTenure] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ amountRequested: amount, tenureMonths: tenure });
    setAmount("");
    setTenure("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Apply for Loan</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
            {/* Amount Field */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Loan Amount (&#8377;)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter loan amount"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Tenure Field */}
            <div>
              <label
                htmlFor="tenure"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tenure (months)
              </label>
              <input
                type="number"
                id="tenure"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="Enter tenure in months"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
