import React from 'react';
import { TrendingUp, Clock, Calendar, DollarSign } from 'lucide-react';

interface SummaryCard {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: 'blue' | 'yellow' | 'green' | 'purple';
  onClick?: () => void;
}

interface PaymentSummaryCardsProps {
  totalPaid: number;
  unpaidInvoices: number;
  thisMonthBills: number;
  totalRevenue: number;
  onCardClick?: (cardType: string) => void;
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200',
  yellow: 'from-yellow-50 to-yellow-100 border-yellow-200',
  green: 'from-green-50 to-green-100 border-green-200',
  purple: 'from-purple-50 to-purple-100 border-purple-200',
};

const iconColorClasses = {
  blue: 'text-blue-600 bg-blue-200',
  yellow: 'text-yellow-600 bg-yellow-200',
  green: 'text-green-600 bg-green-200',
  purple: 'text-purple-600 bg-purple-200',
};

export const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({
  totalPaid,
  unpaidInvoices,
  thisMonthBills,
  totalRevenue,
  onCardClick,
}) => {
  const cards: SummaryCard[] = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Total Paid',
      value: `₱${totalPaid.toLocaleString()}`,
      color: 'blue',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Unpaid Invoices',
      value: unpaidInvoices,
      color: 'yellow',
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "This Month's Bills",
      value: thisMonthBills,
      color: 'green',
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      title: 'Total Revenue',
      value: `₱${totalRevenue.toLocaleString()}`,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          onClick={() => onCardClick?.(card.title)}
          className={`bg-gradient-to-br ${colorClasses[card.color]} border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`${iconColorClasses[card.color]} p-3 rounded-lg`}>
              {card.icon}
            </div>
          </div>
          <p className="text-gray-600 text-sm font-medium mb-2">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-full rounded-full ${
                card.color === 'blue'
                  ? 'bg-blue-500'
                  : card.color === 'yellow'
                    ? 'bg-yellow-500'
                    : card.color === 'green'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(100, (index + 1) * 25)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
