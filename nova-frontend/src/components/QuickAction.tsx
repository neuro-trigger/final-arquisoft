import { IconType } from "react-icons";

interface QuickActionProps {
  name: string;
  icon: IconType;
  color?: "green" | "blue" | "red" | "yellow" | "purple" | "pink" | "cyan";
  href: string;
}

const getColorClasses = (color: QuickActionProps["color"] = "blue") => {
  const colors = {
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-600",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
    },
    pink: {
      bg: "bg-pink-100",
      text: "text-pink-600",
    },
    cyan: {
      bg: "bg-cyan-100",
      text: "text-cyan-600",
    },
  };

  return colors[color];
};

const QuickAction = ({
  name,
  icon: Icon,
  color = "blue",
  href = "#",
}: QuickActionProps) => {
  const colorClasses = getColorClasses(color);

  return (
    <a
      href={href}
      className="block bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-all duration-300 hover:scale-105"
    >
      <div
        className={`${colorClasses.bg} ${colorClasses.text} w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3`}
      >
        <Icon className="text-2xl" />
      </div>
      <p className="font-medium text-gray-700 text-sm">{name}</p>
    </a>
  );
};

export default QuickAction;
