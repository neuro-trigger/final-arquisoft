"use client";

import { FC, useEffect, useState } from "react";
import {
  FaExchangeAlt,
  FaHandHoldingUsd,
  FaPiggyBank,
  FaBell,
  FaUser,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import Balance from "@/components/Balance";
import Pocket from "@/components/Pocket";
import Transaction from "@/components/Transaction";
import QuickAction from "@/components/QuickAction";
import { Movement, Pocket as PocketType } from "@/types/api";
import apiClient from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

const quickActions = [
  {
    name: "Transferir",
    icon: FaExchangeAlt,
    color: "purple",
    href: "#",
  },
  {
    name: "Solicitar",
    icon: FaHandHoldingUsd,
    color: "blue",
    href: "#",
  },
  
  
  
];

const POCKET_CATEGORIES = [
  { id: "home", label: "Hogar" },
  { id: "emergency", label: "Emergencia" },
  { id: "trips", label: "Viajes" },
  { id: "entertainment", label: "Entretenimiento" },
  { id: "studies", label: "Estudios" },
  { id: "transportation", label: "Transporte" },
  { id: "debt", label: "Deudas" },
  { id: "other", label: "Otros" },
] as const;

type PocketCategory = (typeof POCKET_CATEGORIES)[number]["id"];

const Dashboard: FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [pockets, setPockets] = useState<PocketType[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingPockets, setIsLoadingPockets] = useState(false);
  const [isLoadingMovements, setIsLoadingMovements] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedPocket, setSelectedPocket] = useState<PocketType | null>(null);
  const [pocketName, setPocketName] = useState("");
  const [pocketCategory, setPocketCategory] = useState<PocketCategory>("home");
  const [pocketMaxAmount, setPocketMaxAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferType, setTransferType] = useState<"transferir" | "solicitar">("transferir");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferUsername, setTransferUsername] = useState("");
  const [transferError, setTransferError] = useState<string | null>(null);
  const [transferLoading, setTransferLoading] = useState(false);

  const fetchPockets = async () => {
    if (!userId) return;

    try {
      setIsLoadingPockets(true);
      const pocketsResponse = await apiClient.getPockets();
      if (pocketsResponse?.success) {
        console.log("Pockets response:", pocketsResponse.pockets);
        setPockets(pocketsResponse.pockets || []);
      } else {
        setPockets([]);
      }
    } catch (err) {
      console.error("Error fetching pockets:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar los bolsillos"
      );
      setPockets([]);
    } finally {
      setIsLoadingPockets(false);
    }
  };

  useEffect(() => {
    console.log("Pockets state updated:", pockets);
  }, [pockets]);

  useEffect(() => {
    if (!userId) return;

    const fetchMovements = async () => {
      try {
        setIsLoadingMovements(true);
        const movementsResponse = await apiClient.getMovements(0, 0, true);
        if (movementsResponse?.success) {
          setMovements(movementsResponse.movements || []);
        } else {
          setMovements([]);
        }
      } catch (err) {
        setMovements([]);
      } finally {
        setIsLoadingMovements(false);
      }
    };

    // Fetch immediately on mount
    fetchMovements();

    const interval = setInterval(fetchMovements, 10000);

    // Clean up interval on unmount or userId change
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await apiClient.getBalance(0, 0);
      setBalance(Number((res as any).current));
    };
    fetchBalance();
    const interval = setInterval(fetchBalance, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    console.log("Movements state updated:", movements);
  }, [movements]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("User not authenticated, redirecting to login...");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user?.userID) {
      console.log("Setting user ID from auth state:", user.userID);
      setUserId(user.userID);
      apiClient.setUserId(user.userID);
      apiClient.setUsername(user.username);
      apiClient.setUserEmail(user.email);
    } else if (!loading && isAuthenticated) {
      console.error("No user ID found in auth state");
      setError("Error: No se pudo obtener el ID del usuario");
      apiClient.setUserId(null);
      apiClient.setUsername(null);
    }
  }, [user, loading, isAuthenticated]);

  const handleCreatePocket = async () => {
    if (!pocketName || !pocketMaxAmount) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.createPocket(
        pocketName,
        pocketCategory,
        Number(pocketMaxAmount)
      );
      if (response.success) {
        // Fetch updated pockets
        const pocketsResponse = await apiClient.getPockets();
        if (pocketsResponse?.success) {
          setPockets(pocketsResponse.pockets || []);
        }
        resetModal();
      } else {
        setError(response.message || "Error al crear el bolsillo");
      }
    } catch (error) {
      console.error("Error creating pocket:", error);
      setError("Error al crear el bolsillo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePocket = async () => {
    if (!selectedPocket || !pocketName || !pocketMaxAmount) {
      setError("Por favor completa todos los campos");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.updatePocket(
        selectedPocket.id,
        pocketName,
        pocketCategory,
        Number(pocketMaxAmount)
      );
      if (response.success) {
        // Fetch updated pockets
        const pocketsResponse = await apiClient.getPockets();
        if (pocketsResponse?.success) {
          setPockets(pocketsResponse.pockets || []);
        }
        resetModal();
      } else {
        setError(response.message || "Error al actualizar el bolsillo");
      }
    } catch (error) {
      console.error("Error updating pocket:", error);
      setError("Error al actualizar el bolsillo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePocket = async (pocketId: string) => {
    if (!userId) return;

    try {
      const response = await apiClient.deletePocket(pocketId);
      if (response.success) {
        // Fetch updated pockets
        const pocketsResponse = await apiClient.getPockets();
        if (pocketsResponse?.success) {
          setPockets(pocketsResponse.pockets || []);
        }
      }
    } catch (err) {
      console.error("Error deleting pocket:", err);
      setError(
        err instanceof Error ? err.message : "Error al eliminar el bolsillo"
      );
    }
  };

  const handleEditPocket = (pocket: PocketType) => {
    setSelectedPocket(pocket);
    setPocketName(pocket.name);
    setPocketCategory(pocket.category as PocketCategory);
    setPocketMaxAmount(pocket.max_amount.toString());
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setPocketName("");
    setPocketCategory("home");
    setPocketMaxAmount("");
    setSelectedPocket(null);
    setModalMode("create");
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.log("No user ID available, skipping data fetch");
        return;
      }

      try {
        // Fetch pockets
        setIsLoadingPockets(true);
        console.log("Fetching pockets...");
        const pocketsResponse = await apiClient.getPockets();
        console.log("Pockets response:", pocketsResponse);
        if (pocketsResponse?.success) {
          const newPockets = pocketsResponse.pockets || [];
          console.log("Setting new pockets:", newPockets);
          setPockets(newPockets);
        }
        setIsLoadingPockets(false);

        // Fetch movements
        setIsLoadingMovements(true);
        console.log("Fetching movements...");
        const movementsResponse = await apiClient.getMovements(0, 0, true);
        console.log("Movements response:", movementsResponse);
        if (movementsResponse?.success) {
          setMovements(movementsResponse.movements || []);
        }
        setIsLoadingMovements(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos");
        // Don't reset pockets on error, just show the error
        setIsLoadingPockets(false);
        setIsLoadingMovements(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleOpenTransferModal = (type: "transferir" | "solicitar") => {
    setTransferType(type);
    setTransferAmount("");
    setTransferUsername("");
    setTransferError(null);
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
    setTransferAmount("");
    setTransferUsername("");
    setTransferError(null);
  };

  const handleTransferSubmit = async () => {
    const numAmount = Number(transferAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setTransferError("Por favor ingresa un monto válido");
      return;
    }
    if (!transferUsername) {
      setTransferError("Por favor ingresa el nombre de usuario del destinatario");
      return;
    }
    setTransferLoading(true);
    setTransferError(null);
    try {
      // Look up user by username
      const userRes = await apiClient.getUserByName(transferUsername);
      if (!userRes || !userRes.success || !userRes.user_id) {
        setTransferError("Usuario no encontrado");
        setTransferLoading(false);
        return;
      }
      const otherUserId = userRes.user_id;
      const currentUserId = user?.userID;
      if (!currentUserId) {
        setTransferError("No se pudo obtener tu usuario actual");
        setTransferLoading(false);
        return;
      }
      if (transferType === "transferir") {
        await apiClient.createTransfer(otherUserId, numAmount, currentUserId);
      } else {
        await apiClient.createTransfer(currentUserId, numAmount, otherUserId);
      }
      handleCloseTransferModal();
    } catch (err: any) {
      setTransferError(err.message || "Error en la operación");
    } finally {
      setTransferLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenido, {user?.username || "Usuario"}!
      </h1>

      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="h-[260px] flex">
            <Balance />
          </div>
          <div className="flex flex-col gap-4 justify-center items-center bg-white rounded-xl shadow-sm p-6 h-[260px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="flex w-full gap-4">
              <button
                onClick={() => handleOpenTransferModal("transferir")}
                className="w-1/2 block bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                <div className="bg-purple-100 text-purple-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaExchangeAlt className="text-2xl" />
                </div>
                <span className="font-medium text-gray-700 text-sm">Transferir</span>
              </button>
              <button
                onClick={() => handleOpenTransferModal("solicitar")}
                className="w-1/2 block bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 hover:scale-105 focus:outline-none"
              >
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaHandHoldingUsd className="text-2xl" />
                </div>
                <span className="font-medium text-gray-700 text-sm">Solicitar</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/*
      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={index}
                name={action.name}
                icon={action.icon}
                color={
                  action.color as "blue" | "green" | "red" | "yellow" | "purple"
                }
                href={action.href}
              />
            ))}
          </div>
        </div>
      </section>
      */}

      <section className="mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Metas</h2>
            <button
              onClick={() => {
                setModalMode("create");
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Crear nueva meta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingPockets ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Cargando metas...</p>
              </div>
            ) : pockets.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-600">
                  No has creado ninguna meta aún
                </p>
              </div>
            ) : (
              pockets.map((pocket) => (
                <div
                  key={pocket.id}
                  className="relative bg-white rounded-xl shadow-sm"
                >
                  <Pocket
                    pocket={pocket}
                    currentAmount={balance}
                    color="purple"
                    onOptionsClick={() => {}}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditPocket(pocket)}
                      className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeletePocket(pocket.id)}
                      className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pocket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {modalMode === "edit"
                ? "Editar Meta"
                : "Crear Nueva Meta"}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="pocketName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre de la meta
                </label>
                <input
                  type="text"
                  id="pocketName"
                  value={pocketName}
                  onChange={(e) => setPocketName(e.target.value)}
                  className="block w-full text-black pl-10 pr-16 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg py-3 bg-gray-50 transition-all duration-150"
                  placeholder="Ej: Ahorro para viaje"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {POCKET_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setPocketCategory(category.id)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        pocketCategory === category.id
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="pocketMaxAmount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Monto esperado
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="pocketMaxAmount"
                    value={pocketMaxAmount}
                    onChange={(e) => setPocketMaxAmount(e.target.value)}
                    className="block w-full text-black pl-10 pr-16 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg py-3 bg-gray-50 transition-all duration-150"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">COP</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={
                  modalMode === "edit" ? handleUpdatePocket : handleCreatePocket
                }
                disabled={isSubmitting || !pocketName || !pocketMaxAmount}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? modalMode === "edit"
                    ? "Actualizando..."
                    : "Creando..."
                  : modalMode === "edit"
                  ? "Actualizar Meta"
                  : "Crear Meta"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Movements Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Movimientos Recientes
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoadingMovements ? (
            <div className="p-4 text-center text-gray-500">
              Cargando movimientos...
            </div>
          ) : movements.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No hay movimientos recientes
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {movements.slice(0, 5).map((movement: any) => {
                // Map movement to the expected structure for Transaction
                const tx: any = {
                  amount: movement.amount?.toString?.() ?? "",
                  fromUsername:
                    movement.fromUsername || movement.from_user || "",
                  toUsername: movement.toUsername || movement.to_user || "",
                  timestamp: movement.timestamp?.toString?.() ?? "",
                  transferId: movement.transferId || movement.id || "",
                };
                return <Transaction key={tx.transferId} transaction={tx} />;
              })}
            </div>
          )}
        </div>
      </section>

      {/* Transferir/Solicitar Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              {transferType === "transferir" ? (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-600 rounded-full">
                  <FaExchangeAlt className="w-5 h-5" />
                </span>
              ) : (
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full">
                  <FaHandHoldingUsd className="w-5 h-5" />
                </span>
              )}
              {transferType === "transferir" ? "Transferir Dinero" : "Solicitar Dinero"}
            </h3>
            {transferError && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" /></svg>
                {transferError}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label htmlFor="transferAmount" className="block text-sm font-semibold text-gray-700 mb-2">Monto</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-base font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    id="transferAmount"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="block w-full text-black pl-10 pr-16 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg py-3 bg-gray-50 transition-all duration-150"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-base font-bold">COP</span>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="transferUsername" className="block text-sm font-semibold text-gray-700 mb-2">Nombre de usuario del destinatario</label>
                <input
                  type="text"
                  id="transferUsername"
                  value={transferUsername}
                  onChange={(e) => setTransferUsername(e.target.value)}
                  className="block pl-4 w-full text-black rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg py-3 bg-gray-50 transition-all duration-150"
                  placeholder="usuario123"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCloseTransferModal}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-lg font-semibold transition-colors border border-gray-200 shadow-sm hover:bg-gray-200"
                disabled={transferLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleTransferSubmit}
                disabled={!transferAmount || !transferUsername || transferLoading}
                className={`px-5 py-2.5 text-white rounded-lg font-semibold shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  transferType === "transferir"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {transferLoading
                  ? "Procesando..."
                  : transferType === "transferir"
                  ? "Transferir"
                  : "Solicitar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
