import React from 'react';
import { 
  Bill, 
  BillType, 
  DepartmentOverheadBill, 
  ConstructionContractBill, 
  PurchaseBill, 
  AdvanceRequestBill 
} from '@/context/BillContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';

interface BankDetailsCardProps {
  bill: Bill;
}

const BankDetailsCard: React.FC<BankDetailsCardProps> = ({ bill }) => {
  const getBankDetails = () => {
    // Mock bank details based on bill type - in real app this would come from the bill data
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return {
          accountName: 'Department Operations Account',
          accountNumber: '**** **** **** 1234',
          bankName: 'First National Bank',
          routingNumber: '123456789',
          paymentMethod: 'ACH Transfer'
        };
      
      case BillType.CONSTRUCTION_CONTRACT:
        return {
          accountName: 'Construction Projects Account',
          accountNumber: '**** **** **** 5678',
          bankName: 'Construction Finance Bank',
          routingNumber: '987654321',
          paymentMethod: 'Wire Transfer'
        };
      
      case BillType.PURCHASE:
        return {
          accountName: 'Vendor Payments Account',
          accountNumber: '**** **** **** 9012',
          bankName: 'Commercial Banking Corp',
          routingNumber: '456789123',
          paymentMethod: 'Check'
        };
      
      case BillType.ADVANCE_REQUEST:
        return {
          accountName: 'Employee Advance Account',
          accountNumber: '**** **** **** 3456',
          bankName: 'Payroll Services Bank',
          routingNumber: '789123456',
          paymentMethod: 'Direct Deposit'
        };
      
      default:
        return {
          accountName: 'General Account',
          accountNumber: '**** **** **** 0000',
          bankName: 'Default Bank',
          routingNumber: '000000000',
          paymentMethod: 'Transfer'
        };
    }
  };

  const bankDetails = getBankDetails();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Bank Details</CardTitle>
        <CreditCard className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Account Name</TableCell>
              <TableCell>{bankDetails.accountName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Account Number</TableCell>
              <TableCell>{bankDetails.accountNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Bank Name</TableCell>
              <TableCell>{bankDetails.bankName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Routing Number</TableCell>
              <TableCell>{bankDetails.routingNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Method</TableCell>
              <TableCell>{bankDetails.paymentMethod}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BankDetailsCard;