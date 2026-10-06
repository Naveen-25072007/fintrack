import axios from "axios";

const API = axios.create({
  baseURL: "https://finsight-api-dp50.onrender.com",
});

// Dashboard
export const getDashboard = async (token) => {
  const response = await API.get("/dashboard/summary", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Financial Wellness
export const getWellnessScore = async (token) => {
  const response = await API.get("/wellness/score", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Spending Analytics
export const getCategorySpending = async (token) => {
  const response = await API.get(
    "/analytics/spending-by-category",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Transactions
export const addTransaction = async (token, transaction) => {
  const response = await API.post(
    "/transactions/",
    transaction,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// Budgets
export const getBudgets = async (token) => {
  const response = await API.get("/budgets/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addBudget = async (token, budget) => {
  const response = await API.post(
    "/budgets/",
    budget,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};