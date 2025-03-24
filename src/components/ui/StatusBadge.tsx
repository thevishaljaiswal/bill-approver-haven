
import React from 'react';
import { BillStatus } from '@/context/BillContext';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: BillStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = () => {
    switch (status) {
      case BillStatus.APPROVED:
        return 'bg-green-100 text-green-800 border-green-200';
      case BillStatus.REJECTED:
        return 'bg-red-100 text-red-800 border-red-200';
      case BillStatus.PENDING:
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getStatusColor(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
