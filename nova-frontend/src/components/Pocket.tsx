import { FaEllipsisH } from "react-icons/fa";
import { Pocket as PocketType } from "@/types/api";

interface PocketProps {
  pocket: PocketType;
  currentAmount: number;
  color?: "green" | "blue" | "red" | "yellow" | "purple" | "pink" | "cyan";
  onOptionsClick?: () => void;
}

const getColorClasses = (color: PocketProps["color"] = "blue") => {
  const colors = {
    green: {
      border: "border-green-500",
      bg: "bg-green-500",
    },
    blue: {
      border: "border-blue-500",
      bg: "bg-blue-500",
    },
    red: {
      border: "border-red-500",
      bg: "bg-red-500",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-500",
    },
    purple: {
      border: "border-purple-500",
      bg: "bg-purple-500",
    },
    pink: {
      border: "border-pink-500",
      bg: "bg-pink-500",
    },
    cyan: {
      border: "border-cyan-500",
      bg: "bg-cyan-500",
    },
  };

  return colors[color];
};

const Pocket = ({
  pocket,
  currentAmount,
  color = "blue",
  onOptionsClick,
}: PocketProps) => {
  const completedPercentage = Math.min(
    Math.round((currentAmount / pocket.max_amount) * 100),
    100
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const colorClasses = getColorClasses(color);

  return (
    <div
      className={`pocket-card bg-white rounded-xl shadow-sm p-5 border-l-4 ${colorClasses.border}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-800">{pocket.name}</h3>
          <p className="text-gray-500 text-sm">
            Meta: {formatCurrency(pocket.max_amount)}
          </p>
        </div>
        <button
          className="text-gray-400 hover:text-gray-600"
          onClick={onOptionsClick}
        >
          <FaEllipsisH />
        </button>
      </div>
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`${colorClasses.bg} h-2.5 rounded-full`}
            style={{ width: `${completedPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-700 font-medium">
          {formatCurrency(currentAmount)}
        </p>
        <p className="text-sm text-gray-500">
          {completedPercentage}% completado
        </p>
      </div>
    </div>
  );
};

export default Pocket;
