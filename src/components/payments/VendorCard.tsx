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
import { User } from 'lucide-react';

interface VendorCardProps {
  bill: Bill;
}

const VendorCard: React.FC<VendorCardProps> = ({ bill }) => {
  const getVendorInfo = () => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        const deptBill = bill as DepartmentOverheadBill;
        return {
          name: deptBill.vendorName,
          type: 'Vendor'
        };
      
      case BillType.CONSTRUCTION_CONTRACT:
        const constructionBill = bill as ConstructionContractBill;
        return {
          name: constructionBill.contractorName,
          type: 'Contractor'
        };
      
      case BillType.PURCHASE:
        const purchaseBill = bill as PurchaseBill;
        return {
          name: purchaseBill.vendorName,
          type: 'Vendor'
        };
      
      case BillType.ADVANCE_REQUEST:
        const advanceBill = bill as AdvanceRequestBill;
        return {
          name: advanceBill.vendorName,
          type: 'Vendor'
        };
      
      default:
        return {
          name: 'Unknown',
          type: 'Vendor'
        };
    }
  };

  const vendorInfo = getVendorInfo();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{vendorInfo.type} Information</CardTitle>
        <User className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{vendorInfo.name}</div>
        <p className="text-sm text-muted-foreground mt-1">
          {vendorInfo.type} for {bill.type.toLowerCase().replace('_', ' ')} bill
        </p>
      </CardContent>
    </Card>
  );
};

export default VendorCard;