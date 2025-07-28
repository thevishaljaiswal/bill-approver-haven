import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Bill, BillType } from '@/context/BillContext';

interface BankDetailsCardProps {
  bill: Bill;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ bill }) => {
  // Mock bank details - in a real app, this would come from the bill data
  const getBankDetails = () => {
    return {
      bankName: "City Bank",
      accountNumber: "**** **** **** 1234",
      routingNumber: "021000021",
      paymentMethod: bill.type === BillType.ADVANCE_REQUEST ? "Direct Transfer" : "Bank Transfer"
    };
  };

  const bankDetails = getBankDetails();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <CreditCard className="h-4 w-4" />
          Bank Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Bank Name</p>
            <p className="font-medium text-sm">{bankDetails.bankName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account</p>
            <p className="text-sm">{bankDetails.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="text-sm">{bankDetails.paymentMethod}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;