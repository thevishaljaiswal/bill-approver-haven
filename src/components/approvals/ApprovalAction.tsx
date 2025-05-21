
import React, { useState } from 'react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';
import { useBillContext, BillStatus } from '@/context/BillContext';
import { useToast } from '@/hooks/use-toast';

interface ApprovalActionProps {
  billId: string;
  currentStage: number;
  status: BillStatus;
  className?: string;
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({
  billId,
  currentStage,
  status,
  className
}) => {
  const { updateApproval } = useBillContext();
  const { toast } = useToast();
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [comments, setComments] = useState('');
  
  // Determine if actions should be disabled
  const isActionDisabled = status === BillStatus.REJECTED || status === BillStatus.APPROVED;

  const handleApprovalSubmit = () => {
    const approverName = "Current User"; // In a real app, this would come from auth context
    updateApproval(billId, currentStage, approverName, BillStatus.APPROVED, comments);
    toast({
      title: "Bill Approved",
      description: "The bill has been successfully approved and moved to the next stage.",
      variant: "default",
    });
    setComments('');
    setIsApprovalDialogOpen(false);
  };

  const handleRejectionSubmit = () => {
    const approverName = "Current User"; // In a real app, this would come from auth context
    updateApproval(billId, currentStage, approverName, BillStatus.REJECTED, comments);
    toast({
      title: "Bill Rejected",
      description: "The bill has been rejected. The process is now stopped.",
      variant: "destructive",
    });
    setComments('');
    setIsRejectionDialogOpen(false);
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        onClick={() => setIsApprovalDialogOpen(true)}
        variant="outline"
        className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
        disabled={isActionDisabled}
      >
        <CheckCircle className="mr-2 h-4 w-4" />
        Approve
      </Button>

      <Button
        onClick={() => setIsRejectionDialogOpen(true)}
        variant="outline"
        className="border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
        disabled={isActionDisabled}
      >
        <XCircle className="mr-2 h-4 w-4" />
        Reject
      </Button>

      {/* Approval Dialog */}
      <AlertDialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Bill</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve this bill. This action will move the bill to the next approval stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add comments (optional)"
              className="w-full min-h-[100px]"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprovalSubmit} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Approval
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Dialog */}
      <AlertDialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Bill</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject this bill. This action will stop the approval process and mark the bill as rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add rejection reason (required)"
              className="w-full min-h-[100px]"
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectionSubmit} className="bg-red-600 hover:bg-red-700">
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApprovalAction;
