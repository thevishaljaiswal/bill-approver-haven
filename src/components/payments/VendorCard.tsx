import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { Bill, BillType, DepartmentOverheadBill, ConstructionContractBill, PurchaseBill, AdvanceRequestBill } from '@/context/BillContext';

interface VendorCardProps {
  bill: Bill;
}

const VendorCard: React.FC<VendorCardProps> = ({ bill }) => {
  const getVendorName = (): string => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return (bill as PurchaseBill).vendorName;
      case BillType.CONSTRUCTION_CONTRACT:
        return (bill as ConstructionContractBill).contractorName;
      case BillType.DEPARTMENT_OVERHEAD:
        return (bill as DepartmentOverheadBill).vendorName;
      case BillType.ADVANCE_REQUEST:
        return (bill as AdvanceRequestBill).vendorName;
      default:
        return 'Unknown';
    }
  };

  const getVendorType = (): string => {
    switch (bill.type) {
      case BillType.PURCHASE:
        return 'Vendor';
      case BillType.CONSTRUCTION_CONTRACT:
        return 'Contractor';
      case BillType.DEPARTMENT_OVERHEAD:
        return 'Vendor';
      case BillType.ADVANCE_REQUEST:
        return 'Requester';
      default:
        return 'Party';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Building2 className="h-4 w-4" />
          {getVendorType()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <p className="font-medium">{getVendorName()}</p>
          <p className="text-xs text-muted-foreground">{bill.type}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorCard;