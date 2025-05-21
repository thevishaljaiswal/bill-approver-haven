
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { approvalStages, BillStatus } from '@/context/BillContext';
import ApprovalStages from '@/components/ui/ApprovalStages';
import ApprovalAction from './ApprovalAction';
import { cn } from '@/lib/utils';

interface ApprovalHistoryItem {
  stage: number;
  approverName: string;
  status: BillStatus;
  date: Date | null;
  comments: string;
}

interface ApprovalDetailProps {
  billId: string;
  currentStage: number;
  status: BillStatus;
  approvals: ApprovalHistoryItem[];
  className?: string;
}

const ApprovalDetail: React.FC<ApprovalDetailProps> = ({
  billId,
  currentStage,
  status,
  approvals,
  className
}) => {
  const isCompleted = status === BillStatus.APPROVED && currentStage >= approvalStages.length - 1;
  const isRejected = status === BillStatus.REJECTED;
  
  // Get the current stage label
  const getCurrentStageLabel = () => {
    if (isCompleted) {
      return "Completed";
    } else if (isRejected) {
      return "Rejected";
    } else {
      return approvalStages[currentStage];
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Approval Process</span>
          <span className={cn(
            "text-sm px-3 py-1 rounded-full",
            isCompleted ? "bg-green-100 text-green-800" : 
            isRejected ? "bg-red-100 text-red-800" : 
            "bg-blue-100 text-blue-800"
          )}>
            {getCurrentStageLabel()}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="mb-8">
          <ApprovalStages 
            currentStage={currentStage}
            approvals={approvals}
            className="w-full"
          />
        </div>
        
        {!isCompleted && !isRejected && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-base font-medium mb-4">Current Action Required</h3>
            <div className="flex items-center p-4 rounded-lg bg-blue-50 mb-4">
              <Clock className="h-5 w-5 mr-3 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">
                  Waiting for: {approvalStages[currentStage]}
                </p>
                <p className="text-sm text-blue-700">
                  This bill needs approval to proceed to the next stage
                </p>
              </div>
            </div>
            
            <ApprovalAction 
              billId={billId}
              currentStage={currentStage}
              status={status}
            />
          </div>
        )}
        
        {/* Approval History */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-base font-medium mb-4">Approval History</h3>
          
          {approvals.length === 0 ? (
            <p className="text-gray-500">No approval history yet.</p>
          ) : (
            <div className="space-y-4">
              {approvals.map((approval, index) => (
                <div 
                  key={index}
                  className="p-4 border rounded-lg flex items-start"
                >
                  {approval.status === BillStatus.APPROVED ? (
                    <CheckCircle className="h-5 w-5 mr-3 text-green-500 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-3 text-red-500 mt-1" />
                  )}
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-medium">
                        {approvalStages[approval.stage]}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {approval.date ? approval.date.toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      <span className="font-medium">Approver: </span> 
                      {approval.approverName}
                    </p>
                    {approval.comments && (
                      <div className="mt-2 text-sm bg-gray-50 p-3 rounded border">
                        <span className="block font-medium mb-1">Comments:</span>
                        {approval.comments}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalDetail;
