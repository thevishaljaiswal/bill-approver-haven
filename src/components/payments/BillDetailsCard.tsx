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
import { FileText } from 'lucide-react';

interface BillDetailsCardProps {
  bill: Bill;
}

const BillDetailsCard: React.FC<BillDetailsCardProps> = ({ bill }) => {
  const getBillSpecificDetails = () => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        const deptBill = bill as DepartmentOverheadBill;
        return [
          { label: 'Department', value: deptBill.department },
          { label: 'Vendor Name', value: deptBill.vendorName },
          { label: 'Description', value: deptBill.description },
          { label: 'Bill Number', value: deptBill.billNumber },
          { label: 'Due Date', value: deptBill.dueDate.toLocaleDateString() }
        ];
      
      case BillType.CONSTRUCTION_CONTRACT:
        const constructionBill = bill as ConstructionContractBill;
        return [
          { label: 'Contractor', value: constructionBill.contractorName },
          { label: 'Project', value: constructionBill.projectName },
          { label: 'Bill Number', value: constructionBill.billNumber },
          { label: 'Site Location', value: constructionBill.siteLocation },
          { label: 'Work Order', value: constructionBill.workOrderNumber },
          { label: 'Retention Amount', value: `$${constructionBill.retentionAmount.toLocaleString()}` }
        ];
      
      case BillType.PURCHASE:
        const purchaseBill = bill as PurchaseBill;
        return [
          { label: 'Vendor', value: purchaseBill.vendorName },
          { label: 'PO Number', value: purchaseBill.poNumber },
          { label: 'Item Description', value: purchaseBill.itemDescription },
          { label: 'Quantity', value: purchaseBill.quantity.toString() },
          { label: 'Unit Price', value: `$${purchaseBill.unitPrice.toLocaleString()}` },
          { label: 'GRN Number', value: purchaseBill.grnNumber }
        ];
      
      case BillType.ADVANCE_REQUEST:
        const advanceBill = bill as AdvanceRequestBill;
        return [
          { label: 'Vendor Name', value: advanceBill.vendorName },
          { label: 'Vendor ID', value: advanceBill.vendorId },
          { label: 'Contact Number', value: advanceBill.contactNumber },
          { label: 'Purpose', value: advanceBill.purpose },
          { label: 'Payment Method', value: advanceBill.paymentMethod }
        ];
      
      default:
        return [];
    }
  };

  const specificDetails = getBillSpecificDetails();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Bill Details</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Bill Type</TableCell>
              <TableCell>{bill.type}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Created Date</TableCell>
              <TableCell>{bill.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
            {specificDetails.map((detail, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{detail.label}</TableCell>
                <TableCell>{detail.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BillDetailsCard;