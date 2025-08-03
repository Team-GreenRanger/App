import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAndroidApi } from "../hooks";
import { HiChevronLeft, HiPlus, HiMinus } from "react-icons/hi";
import { CarbonCreditBalance, TransactionResponse } from "../types";
import { getCarbonCreditBalance, getCarbonCreditTransactions } from "../utils";

const CreditUsageHistoryPage = () => {
  const navigate = useNavigate();
  const { vibrate } = useAndroidApi();
  const [filter, setFilter] = useState<"all" | "EARNED" | "SPENT">("all");
  const [creditData, setCreditData] = useState<CarbonCreditBalance | null>(
    null
  );
  const [transactionData, setTransactionData] =
    useState<TransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [creditResult, transactionResult] = await Promise.all([
          getCarbonCreditBalance(),
          getCarbonCreditTransactions(),
        ]);
        setCreditData(creditResult);
        setTransactionData(transactionResult);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBackClick = () => {
    vibrate({ duration: 100 });
    navigate(-1);
  };

  const transactions = transactionData?.transactions || [];

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type === filter;
  });

  const totalEarned = creditData?.totalEarned || 0;
  const totalSpent = creditData?.totalSpent || 0;

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors mr-2"
          >
            <HiChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Credit Usage History
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {totalEarned.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Earned</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Spent</p>
          </div>
        </div>

        <div className="flex space-x-2">
          {[
            { id: "all", label: "All" },
            { id: "EARNED", label: "Earned" },
            { id: "SPENT", label: "Spent" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.id
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-20">
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg p-4 border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        transaction.type === "EARNED"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "EARNED" ? (
                        <HiPlus className="w-4 h-4 text-green-600" />
                      ) : (
                        <HiMinus className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {transaction.description}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {transaction.sourceType}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(transaction.createdAt)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            transaction.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold text-lg ${
                      transaction.type === "EARNED"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "EARNED" ? "+" : "-"}
                    {transaction.amount}
                  </span>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditUsageHistoryPage;
