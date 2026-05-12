"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/eco/ProductCard";
import { ProductForm } from "@/components/eco/ProductForm";
import { ApprovalTable } from "@/components/eco/ApprovalTable";
import { mockProducts, mockPendingApprovals } from "@/lib/mock/data";
import toast from "react-hot-toast";

const myListings = [
  { id: "m1", name: "Glass coasters", category: "Home", price: 399, image: "🥃", seller: "You", score: 90 },
];

export default function MemberMarketplacePage() {
  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="all">All products</TabsTrigger>
        <TabsTrigger value="mine">My listings</TabsTrigger>
        <TabsTrigger value="sell">Sell product</TabsTrigger>
        <TabsTrigger value="pending">Pending approvals</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.map((p) => (
          <ProductCard
            key={p.id}
            {...p}
            onBuy={() => toast.success(`Purchased ${p.name} (demo)`)}
          />
        ))}
      </TabsContent>
      <TabsContent value="mine" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myListings.map((p) => (
          <ProductCard key={p.id} {...p} onBuy={() => toast.success("Request sent")} />
        ))}
      </TabsContent>
      <TabsContent value="sell">
        <ProductForm />
      </TabsContent>
      <TabsContent value="pending">
        <ApprovalTable rows={mockPendingApprovals} />
      </TabsContent>
    </Tabs>
  );
}
