
import React from 'react';
import { Bill } from '@/context/BillContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign } from 'lucide-react';

interface PaymentDetailsProps {
  bill: Bill;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({ bill }) => {
  const getPaymentAmount = () => {
    switch (bill.type) {
      case 'Department Overhead Bills':
        return bill.amount;
      case 'Construction Contract Bills':
        return bill.invoiceAmount;
      case 'Purchase Bills':
        return bill.totalAmount;
      case 'Advance Request Bills':
        return bill.amountRequested;
      default:
        return 0;
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Payment Details</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Amount</TableCell>
              <TableCell>${getPaymentAmount().toLocaleString()}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Status</TableCell>
              <TableCell>{bill.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Stage</TableCell>
              <TableCell>
                {bill.currentStage === bill.approvals.length ? 
                  'Payment Processing' : 
                  'Pending Approvals'
                }
              </TableCell>
            </TableRow>
            {bill.type === 'Construction Contract Bills' && (
              <TableRow>
                <TableCell className="font-medium">Retention Amount</TableCell>
                <TableCell>${bill.retentionAmount.toLocaleString()}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PaymentDetails;
