"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/eco/ProductCard";
import { ProductForm } from "@/components/eco/ProductForm";
import { ApprovalTable } from "@/components/eco/ApprovalTable";
import Image from "next/image";
import type { MarketplaceProduct } from "@/types/api";
const mockPendingApprovals: any[] = [];
import toast from "react-hot-toast";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function MemberMarketplacePage() {
  const { data: productsDataRaw } = useQuery({
    queryKey: ['marketplace-products'],
    queryFn: async () => {
      const res = await api.get('/marketplace/products');
      return res.data.data;
    },
  });

  const products = productsDataRaw || [];

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="flex flex-wrap h-auto gap-1">
        <TabsTrigger value="all">All products</TabsTrigger>
        <TabsTrigger value="mine">My listings</TabsTrigger>
        <TabsTrigger value="sell">Sell product</TabsTrigger>
        <TabsTrigger value="pending">Pending approvals</TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p: MarketplaceProduct) => (
          <ProductCard
            key={p._id}
            name={p.name}
            category={p.category || 'General'}
            price={p.price}
            image={p.images?.[0] ? <div className="relative w-full h-32"><Image src={p.images[0]} alt={p.name} fill className="object-cover rounded-lg" unoptimized /></div> : '📦'}
            seller={p.recycler?.name || 'Recycler'}
            score={p.sustainabilityScore || 80}
            onBuy={() => toast.success(`Purchased ${p.name}`)}
          />
        ))}
      </TabsContent>
      <TabsContent value="mine" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-full p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
          You don&apos;t have any listings yet.
        </div>
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
