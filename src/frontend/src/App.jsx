import { useEffect, useState } from "react";
import Login from "./Login";
import {
  getDashboard,
  getWellnessScore,
  getCategorySpending,
  addTransaction,
} from "./api";

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [dashboard, setDashboard] = useState(null);
  const [wellness, setWellness] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [transaction, setTransaction] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
  });

  // Check existing login
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setAuthenticated(true);
    }

    setAuthChecking(false);
  }, []);

  // Load dashboard data
  const loadDashboard = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setLoading(true);

      const [dashboardData, wellnessData, categoryData] =
        await Promise.all([
          getDashboard(token),
          getWellnessScore(token),
          getCategorySpending(token),
        ]);

      setDashboard(dashboardData);
      setWellness(wellnessData);
      setCategories(categoryData.spending_by_category || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      loadDashboard();
    }
  }, [authenticated]);

  // Handle transaction form
  const handleTransactionChange = (e) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  // Add transaction
  const handleAddTransaction = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      setMessage("");

      await addTransaction(token, {
        type: transaction.type,
        amount: Number(transaction.amount),
        category: transaction.category,
        description: transaction.description,
      });

      setMessage("Transaction added successfully.");

      setTransaction({
        type: "expense",
        amount: "",
        category: "Food",
        description: "",
      });

      // Refresh dashboard
      await loadDashboard();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail ||
          "Failed to add transaction."
      );
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");

    setAuthenticated(false);
    setDashboard(null);
    setWellness(null);
    setCategories([]);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading FinSight...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <Login
        onLogin={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              FinSight
            </h1>

            <p className="text-sm text-slate-400">
              Understand Your Money. Manage Your Future.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Page heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            Financial Dashboard
          </h2>

          <p className="text-slate-400 mt-2">
            Track your income, expenses and financial health.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-sm text-blue-400">
            Updating financial data...
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Total Income
            </p>

            <h3 className="text-3xl font-bold text-green-400 mt-2">
              ₹{dashboard?.total_income?.toFixed(2) || "0.00"}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Total Expenses
            </p>

            <h3 className="text-3xl font-bold text-red-400 mt-2">
              ₹{dashboard?.total_expenses?.toFixed(2) || "0.00"}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Current Balance
            </p>

            <h3 className="text-3xl font-bold text-blue-400 mt-2">
              ₹{dashboard?.balance?.toFixed(2) || "0.00"}
            </h3>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Savings Rate
            </p>

            <h3 className="text-3xl font-bold text-purple-400 mt-2">
              {dashboard?.savings_rate?.toFixed(1) || "0.0"}%
            </h3>
          </div>
        </div>

        {/* Add Transaction + Wellness */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          {/* Transaction Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold mb-6">
              Add Transaction
            </h2>

            <form
              onSubmit={handleAddTransaction}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              {/* Type */}
              <div>
                <label className="text-sm text-slate-300">
                  Transaction Type
                </label>

                <select
                  name="type"
                  value={transaction.type}
                  onChange={handleTransactionChange}
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="expense">
                    Expense
                  </option>

                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm text-slate-300">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={transaction.amount}
                  onChange={handleTransactionChange}
                  required
                  min="1"
                  step="0.01"
                  placeholder="Enter amount"
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-sm text-slate-300">
                  Category
                </label>

                <select
                  name="category"
                  value={transaction.category}
                  onChange={handleTransactionChange}
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Bills">Bills</option>
                  <option value="Entertainment">
                    Entertainment
                  </option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Salary">Salary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-slate-300">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={transaction.description}
                  onChange={handleTransactionChange}
                  required
                  placeholder="e.g. Grocery shopping"
                  className="w-full mt-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              {/* Button */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                >
                  Add Transaction
                </button>
              </div>
            </form>

            {message && (
              <div className="mt-4 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300">
                {message}
              </div>
            )}
          </div>

          {/* Wellness */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold">
              Financial Wellness
            </h2>

            <div className="flex flex-col items-center justify-center py-8">

              <div className="w-36 h-36 rounded-full border-8 border-blue-500 flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {wellness?.score || 0}
                </span>
              </div>

              <p className="text-slate-400 mt-5">
                Financial Health Score
              </p>

              <p className="text-xl font-semibold text-green-400 mt-2">
                {wellness?.status || "No Data"}
              </p>

              <p className="text-sm text-slate-500 mt-3 text-center">
                Based on savings, spending and budget management.
              </p>
            </div>
          </div>
        </div>

        {/* Spending Categories */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">

          <h2 className="text-xl font-bold mb-6">
            Spending by Category
          </h2>

          {categories.length === 0 ? (
            <p className="text-slate-500">
              No expense data available yet.
            </p>
          ) : (
            <div className="space-y-5">
              {categories.map((item) => {

                const maxAmount =
                  categories[0]?.amount || 1;

                const percentage =
                  (item.amount / maxAmount) * 100;

                return (
                  <div key={item.category}>

                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">
                        {item.category}
                      </span>

                      <span className="font-semibold">
                        ₹{item.amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Demo Flow */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">

          <h2 className="text-xl font-bold">
            FinSight Flow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-blue-400 font-bold">
                01
              </p>
              <p className="font-semibold mt-2">
                Add Income
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Record your earnings.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-blue-400 font-bold">
                02
              </p>
              <p className="font-semibold mt-2">
                Track Expenses
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Categorize your spending.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-blue-400 font-bold">
                03
              </p>
              <p className="font-semibold mt-2">
                Analyze
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Understand where money goes.
              </p>
            </div>

            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-blue-400 font-bold">
                04
              </p>
              <p className="font-semibold mt-2">
                Improve
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Monitor your financial wellness.
              </p>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default App;