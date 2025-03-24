
import React from 'react';
import { approvalStages, BillStatus } from '@/context/BillContext';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, CircleDashed, Circle } from 'lucide-react';

interface ApprovalStagesProps {
  currentStage: number;
  approvals: Array<{
    stage: number;
    status: BillStatus;
    approverName: string;
    date: Date | null;
    comments: string;
  }>;
  className?: string;
}

const ApprovalStages: React.FC<ApprovalStagesProps> = ({
  currentStage,
  approvals,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-in-out"
            style={{
              width: `${(currentStage / (approvalStages.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {approvalStages.map((stage, index) => {
            const approval = approvals.find(a => a.stage === index);
            const isActive = index === currentStage;
            const isPassed = index < currentStage;
            
            let StepIcon;
            if (approval?.status === BillStatus.APPROVED) {
              StepIcon = CheckCircle;
            } else if (approval?.status === BillStatus.REJECTED) {
              StepIcon = XCircle;
            } else if (isActive) {
              StepIcon = CircleDashed;
            } else {
              StepIcon = Circle;
            }

            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col items-center transform transition-all duration-300',
                  isActive ? 'scale-110' : 'scale-100'
                )}
              >
                <div
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300',
                    isActive
                      ? 'bg-primary text-white'
                      : isPassed
                      ? 'bg-primary/80 text-white'
                      : 'bg-gray-100 text-gray-400'
                  )}
                >
                  <StepIcon
                    className={cn(
                      'w-6 h-6',
                      approval?.status === BillStatus.APPROVED
                        ? 'text-green-500'
                        : approval?.status === BillStatus.REJECTED
                        ? 'text-red-500'
                        : isActive
                        ? 'text-white animate-pulse'
                        : 'text-gray-400'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 text-xs font-medium transition-colors duration-300 text-center',
                    isActive ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {stage}
                </span>
                {approval?.approverName && (
                  <span className="text-xs text-gray-400 mt-1">
                    {approval.approverName}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApprovalStages;
