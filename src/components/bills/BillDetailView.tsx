
import React from 'react';
import { Bill, BillType } from '@/context/BillContext';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from '@/components/ui/table';
import { FileText } from 'lucide-react';
import ApprovalDetail from '@/components/approvals/ApprovalDetail';
import PaymentDetails from '@/components/payments/PaymentDetails';

interface BillDetailViewProps {
  bill: Bill;
}

const BillDetailView: React.FC<BillDetailViewProps> = ({ bill }) => {
  // Get common bill fields for display
  const getBillTypeDisplay = () => {
    return bill.type;
  };

  const getBillReference = () => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        return 'Bill #' + (bill as any).billNumber;
      case BillType.CONSTRUCTION_CONTRACT:
        return 'Contract Bill #' + (bill as any).billNumber;
      case BillType.PURCHASE:
        return 'PO #' + (bill as any).poNumber;
      case BillType.ADVANCE_REQUEST:
        return 'Advance Request #' + bill.id.substring(0, 8);
      default:
        return bill.id;
    }
  };

  const getBillSpecificDetails = () => {
    switch (bill.type) {
      case BillType.DEPARTMENT_OVERHEAD:
        const deptBill = bill as any;
        return (
          <>
            <TableRow>
              <TableCell className="font-medium">Department</TableCell>
              <TableCell>{deptBill.department}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Vendor Name</TableCell>
              <TableCell>{deptBill.vendorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Description</TableCell>
              <TableCell>{deptBill.description}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Due Date</TableCell>
              <TableCell>{deptBill.dueDate.toLocaleDateString()}</TableCell>
            </TableRow>
          </>
        );
      
      case BillType.CONSTRUCTION_CONTRACT:
        const constrBill = bill as any;
        return (
          <>
            <TableRow>
              <TableCell className="font-medium">Project Name</TableCell>
              <TableCell>{constrBill.projectName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Contractor</TableCell>
              <TableCell>{constrBill.contractorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Work Order</TableCell>
              <TableCell>{constrBill.workOrderNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Site Location</TableCell>
              <TableCell>{constrBill.siteLocation}</TableCell>
            </TableRow>
          </>
        );
      
      case BillType.PURCHASE:
        const purchaseBill = bill as any;
        return (
          <>
            <TableRow>
              <TableCell className="font-medium">Vendor Name</TableCell>
              <TableCell>{purchaseBill.vendorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Invoice #</TableCell>
              <TableCell>{purchaseBill.invoiceNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Item Description</TableCell>
              <TableCell>{purchaseBill.itemDescription}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Quantity</TableCell>
              <TableCell>{purchaseBill.quantity} x ${purchaseBill.unitPrice}</TableCell>
            </TableRow>
          </>
        );
        
      case BillType.ADVANCE_REQUEST:
        const advanceBill = bill as any;
        return (
          <>
            <TableRow>
              <TableCell className="font-medium">Vendor Name</TableCell>
              <TableCell>{advanceBill.vendorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Purpose</TableCell>
              <TableCell>{advanceBill.purpose}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Payment Method</TableCell>
              <TableCell>{advanceBill.paymentMethod}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Justification</TableCell>
              <TableCell>{advanceBill.justification}</TableCell>
            </TableRow>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span>{getBillReference()}</span>
              </div>
            </CardTitle>
            <div className="text-sm text-gray-500">
              {new Date(bill.createdAt).toLocaleDateString()}
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Bill Type</TableCell>
                  <TableCell>{getBillTypeDisplay()}</TableCell>
                </TableRow>
                
                {getBillSpecificDetails()}
                
                <TableRow>
                  <TableCell className="font-medium">Created At</TableCell>
                  <TableCell>{bill.createdAt.toLocaleDateString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Last Updated</TableCell>
                  <TableCell>{bill.updatedAt.toLocaleDateString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            {bill.remarks && (
              <div className="mt-6 p-4 bg-gray-50 rounded-md border">
                <h4 className="font-medium mb-2">Remarks</h4>
                <p className="text-sm">{bill.remarks}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <PaymentDetails bill={bill} />
        
        {bill.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bill.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-md">
                    <FileText className="h-5 w-5 mr-2 text-blue-500" />
                    <a 
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {attachment.name}
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="space-y-6">
        <ApprovalDetail
          billId={bill.id}
          currentStage={bill.currentStage}
          status={bill.status}
          approvals={bill.approvals}
        />
      </div>
    </div>
  );
};

export default BillDetailView;
