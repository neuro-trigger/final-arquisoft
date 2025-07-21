import { IconType } from "react-icons";
import { FaShoppingBag } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

interface Movement {
  amount: string;
  fromUsername: string;
  toUsername: string;
  timestamp: string;
  transferId: string;
}

interface TransactionProps {
  transaction: Movement;
  icon?: IconType;
  color?: string;
}

const Transaction = ({
  transaction,
  icon: Icon = FaShoppingBag,
  color = "indigo",
}: TransactionProps) => {
  // Convert amount to number
  const amountNum = Number(transaction.amount);
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    }
    return date.toLocaleDateString("es-CO", {
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formattedDate = formatDate(transaction.timestamp);
  const formattedTime = formatTime(transaction.timestamp);
  
  const isIncoming = transaction.toUsername === user?.username;
  const isOutgoing = transaction.fromUsername === user?.username;

  return (
    <div className="transaction-item p-4 hover:bg-gray-50 cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div
            className={`bg-${color}-100 text-${color}-600 w-10 h-10 rounded-full flex items-center justify-center`}
          >
            <Icon />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {isIncoming
                ? transaction.fromUsername
                : transaction.toUsername}
            </p>
            <p className="text-sm text-gray-500">
              {formattedDate}, {formattedTime}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`font-medium ${
              isOutgoing ? "text-red-500" : "text-green-500"
            }`}
          >
            {isOutgoing ? "-" : "+"}
            {formatCurrency(amountNum)}
          </p>
          <p className="text-xs text-gray-500">Completado</p>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
