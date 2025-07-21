import { FC, useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import apiClient from "../services/api";

const Balance: FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [amount, setAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "withdraw">("add");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch balance on mount and poll every 5 seconds
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await apiClient.getBalance(0, 0);
        setBalance(Number((res as any).current));
      } catch (err: any) {
        setError(err.message || "Error al obtener el saldo");
      }
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = (type: "add" | "withdraw") => {
    setModalType(type);
    setAmount("");
    setError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setAmount("");
    setError(null);
  };

  const handleSubmit = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Por favor ingresa un monto válido");
      return;
    }
    if (modalType === "withdraw" && numAmount > balance) {
      setError("No tienes suficiente saldo");
      return;
    }
    setLoading(true);
    try {
      if (modalType === "add") {
        await apiClient.addMoney(numAmount);
      } else {
        await apiClient.reduceMoney(numAmount);
      }
      // Refresh balance after operation
      const res = await apiClient.getBalance(0, 0);
      setBalance(Number((res as any).current));
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || "Error en la operación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl w-full shadow-sm p-6 flex flex-col justify-around">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Balance</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenModal("add")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <FaPlus /> Agregar
          </button>
          <button
            onClick={() => handleOpenModal("withdraw")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaMinus /> Retirar
          </button>
        </div>
      </div>

      <div className="text-center">
        <p className="text-3xl font-bold text-gray-900">
          ${balance.toLocaleString("es-CO")}
        </p>
        <p className="text-sm text-gray-500 mt-1">Saldo actual</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              {modalType === "add" ? (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-600 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                </span>
              )}
              {modalType === "add" ? "Agregar Dinero" : "Retirar Dinero"}
            </h3>
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Monto
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-base font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="block w-full text-black pl-10 pr-16 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg py-3 bg-gray-50 transition-all duration-150"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-base font-bold">COP</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg font-semibold transition-colors border border-gray-200 shadow-sm hover:bg-gray-200"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!amount || loading}
                className={`px-5 py-2.5 text-white rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  modalType === "add"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {loading
                  ? "Procesando..."
                  : modalType === "add"
                  ? "Agregar"
                  : "Retirar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
