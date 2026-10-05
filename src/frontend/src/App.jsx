import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const spendingData = [
  { month: "May", income: 32000, expenses: 21000 },
  { month: "Jun", income: 35000, expenses: 23000 },
  { month: "Jul", income: 34000, expenses: 24500 },
  { month: "Aug", income: 38000, expenses: 22000 },
  { month: "Sep", income: 40000, expenses: 26000 },
  { month: "Oct", income: 42000, expenses: 24000 },
];

const categories = [
  { name: "Food & Dining", amount: 6200, percent: 72 },
  { name: "Transport", amount: 3100, percent: 48 },
  { name: "Shopping", amount: 2700, percent: 41 },
  { name: "Entertainment", amount: 1800, percent: 29 },
];

const transactions = [
  { name: "Salary", category: "Income", amount: "+ ₹42,000", type: "income" },
  { name: "Food & Dining", category: "Food", amount: "- ₹850", type: "expense" },
  { name: "Uber", category: "Transport", amount: "- ₹420", type: "expense" },
  { name: "Amazon", category: "Shopping", amount: "- ₹1,299", type: "expense" },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-800 bg-slate-950 p-6 lg:block">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Fin<span className="text-emerald-400">Sight</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Understand Your Money.
          </p>
        </div>

        <nav className="space-y-2">
          <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400">
            Dashboard
          </div>

          <div className="rounded-xl px-4 py-3 text-sm text-slate-400">
            Transactions
          </div>

          <div className="rounded-xl px-4 py-3 text-sm text-slate-400">
            Budgets
          </div>

          <div className="rounded-xl px-4 py-3 text-sm text-slate-400">
            Insights
          </div>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs text-slate-500">Financial Wellness</p>
          <p className="mt-2 text-2xl font-bold">82<span className="text-sm text-slate-500">/100</span></p>
          <p className="mt-1 text-xs text-emerald-400">Good financial health</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="border-b border-slate-800 px-6 py-5 md:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h2 className="mt-1 text-2xl font-semibold">
                Your Financial Overview
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-400">
              N
            </div>
          </div>
        </header>

        <div className="space-y-6 p-6 md:p-10">
          {/* Summary Cards */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Total Balance</p>
              <p className="mt-3 text-3xl font-bold">₹78,450</p>
              <p className="mt-2 text-xs text-emerald-400">↑ 8.4% this month</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Income</p>
              <p className="mt-3 text-3xl font-bold">₹42,000</p>
              <p className="mt-2 text-xs text-emerald-400">This month</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Expenses</p>
              <p className="mt-3 text-3xl font-bold">₹24,000</p>
              <p className="mt-2 text-xs text-orange-400">57% of income</p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm text-slate-500">Monthly Budget</p>
              <p className="mt-3 text-3xl font-bold">₹30,000</p>
              <p className="mt-2 text-xs text-emerald-400">₹6,000 remaining</p>
            </div>
          </section>

          {/* Chart + Wellness */}
          <section className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Income vs Expenses</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Track your financial movement over time
                </p>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>

                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#fb923c" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid stroke="#1e293b" vertical={false} />

                    <XAxis
                      dataKey="month"
                      stroke="#64748b"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#64748b"
                      tickLine={false}
                      axisLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: "12px",
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#34d399"
                      fill="url(#incomeGradient)"
                      strokeWidth={2}
                    />

                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#fb923c"
                      fill="url(#expenseGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wellness Score */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold">Financial Wellness</h3>
              <p className="mt-1 text-sm text-slate-500">
                Your overall financial health
              </p>

              <div className="flex flex-col items-center py-8">
                <div className="flex h-36 w-36 items-center justify-center rounded-full border-[10px] border-emerald-400/20">
                  <div className="text-center">
                    <p className="text-4xl font-bold">82</p>
                    <p className="text-xs text-slate-500">out of 100</p>
                  </div>
                </div>

                <p className="mt-5 font-semibold text-emerald-400">Good</p>
                <p className="mt-2 text-center text-sm text-slate-500">
                  You're maintaining healthy spending and saving habits.
                </p>
              </div>

              <div className="space-y-4 border-t border-slate-800 pt-5">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">Savings Rate</span>
                    <span>40%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[80%] rounded-full bg-emerald-400" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">Budget Control</span>
                    <span>75%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[75%] rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Categories + Transactions */}
          <section className="grid gap-6 xl:grid-cols-2">
            {/* Categories */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">Spending Categories</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Where your money is going
                </p>
              </div>

              <div className="space-y-5">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="mb-2 flex justify-between">
                      <span className="text-sm text-slate-300">
                        {category.name}
                      </span>
                      <span className="text-sm font-medium">
                        ₹{category.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-slate-800">
                      <div
                        className="h-2 rounded-full bg-emerald-400"
                        style={{ width: `${category.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Your latest financial activity
                  </p>
                </div>

                <button className="text-sm text-emerald-400">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.name}
                    className="flex items-center justify-between rounded-xl border border-slate-800 p-4"
                  >
                    <div>
                      <p className="text-sm font-medium">{transaction.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {transaction.category}
                      </p>
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-emerald-400"
                          : "text-slate-300"
                      }`}
                    >
                      {transaction.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Insight */}
          <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <p className="text-sm font-medium text-emerald-400">
              Financial Insight
            </p>
            <h3 className="mt-2 text-lg font-semibold">
              You're spending within your budget 🎯
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Your current expenses are below your monthly budget. Food and
              dining is your highest spending category, so reducing it slightly
              could improve your savings rate.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
