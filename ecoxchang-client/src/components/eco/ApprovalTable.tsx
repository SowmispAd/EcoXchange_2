"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-hot-toast";

export type ApprovalRow = {
  id: string;
  productName: string;
  seller: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
};

export function ApprovalTable({ rows }: { rows: ApprovalRow[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.productName}</TableCell>
              <TableCell>{r.seller}</TableCell>
              <TableCell>{r.submittedAt}</TableCell>
              <TableCell>
                <Badge variant={r.status === "pending" ? "secondary" : "outline"}>{r.status}</Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  disabled={r.status !== "pending"}
                  onClick={() => toast.success(`Approved ${r.productName} (demo)`)}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={r.status !== "pending"}
                  onClick={() => toast.error(`Rejected ${r.productName} (demo)`)}
                >
                  Reject
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
