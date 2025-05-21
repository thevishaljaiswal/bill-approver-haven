
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBillContext } from '@/context/BillContext';
import BillDetailView from '@/components/bills/BillDetailView';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const BillDetail: React.FC = () => {
  const { billId } = useParams<{ billId: string }>();
  const navigate = useNavigate();
  const { getBill } = useBillContext();
  
  const bill = getBill(billId || '');
  
  if (!bill) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Bill Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The bill you are looking for does not exist or might have been deleted.
          </p>
          <Button onClick={() => navigate('/bills')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Bills
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 animate-fade-in">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Bill Details</h1>
          <p className="text-muted-foreground mt-1">
            Review and manage bill approval process
          </p>
        </div>
      </div>
      
      <BillDetailView bill={bill} />
    </div>
  );
};

export default BillDetail;
