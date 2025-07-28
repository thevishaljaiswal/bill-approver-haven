import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Bill, BillType, DepartmentOverheadBill, ConstructionContractBill, PurchaseBill, AdvanceRequestBill } from '@/context/BillContext';

interface BillDetailsCardProps {
  bill: Bill;
}

const BillDetailsCard: React.FC<BillDetailsCardProps> = ({ bill }) => {
  const getBillNumber = (): string => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return (bill as PurchaseBill).poNumber;
      case BillType.CONSTRUCTION_CONTRACT:
        return (bill as ConstructionContractBill).billNumber;
      case BillType.DEPARTMENT_OVERHEAD:
        return (bill as DepartmentOverheadBill).billNumber;
      case BillType.ADVANCE_REQUEST:
        return bill.id.substring(0, 8);
      default:
        return bill.id.substring(0, 8);
    }
  };

  const getDescription = (): string => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return (bill as PurchaseBill).itemDescription;
      case BillType.CONSTRUCTION_CONTRACT:
        return (bill as ConstructionContractBill).projectName;
      case BillType.DEPARTMENT_OVERHEAD:
        return (bill as DepartmentOverheadBill).description;
      case BillType.ADVANCE_REQUEST:
        return (bill as AdvanceRequestBill).purpose;
      default:
        return 'No description available';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4" />
          Bill Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div>
            <p className="text-xs text-muted-foreground">Bill Number</p>
            <p className="font-medium text-sm">{getBillNumber()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm">{getDescription()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm">{bill.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BillDetailsCard;