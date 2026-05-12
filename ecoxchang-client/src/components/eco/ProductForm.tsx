"use client";

import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const schema = z.object({
  productName: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(10),
  materials: z.string().min(2),
  quantity: z.coerce.number().min(1),
  manufacturingDate: z.string(),
  expiryDate: z.string(),
  lifespan: z.string(),
  sustainabilityScore: z.coerce.number().min(0).max(100),
  price: z.coerce.number().min(1),
});

export type ProductFormValues = z.infer<typeof schema>;

export function ProductForm({ onSubmitted }: { onSubmitted?: (v: ProductFormValues) => void }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as Resolver<ProductFormValues>,
    defaultValues: {
      productName: "",
      category: "",
      description: "",
      materials: "",
      quantity: 1,
      manufacturingDate: "",
      expiryDate: "",
      lifespan: "",
      sustainabilityScore: 80,
      price: 199,
    },
  });

  const submit = form.handleSubmit((v) => {
    onSubmitted?.(v);
    toast.success("Listing submitted for supervisor approval (demo)");
    form.reset();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sell a recycled product</CardTitle>
        <CardDescription>Submit for approval. You will be notified once reviewed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={submit}>
          <Field label="Product name" error={form.formState.errors.productName?.message}>
            <Input {...form.register("productName")} />
          </Field>
          <Field label="Category" error={form.formState.errors.category?.message}>
            <Input {...form.register("category")} />
          </Field>
          <Field label="Description" className="md:col-span-2" error={form.formState.errors.description?.message}>
            <Textarea rows={3} {...form.register("description")} />
          </Field>
          <Field label="Materials used" error={form.formState.errors.materials?.message}>
            <Input {...form.register("materials")} />
          </Field>
          <Field label="Quantity" error={form.formState.errors.quantity?.message}>
            <Input type="number" {...form.register("quantity")} />
          </Field>
          <Field label="Manufacturing date" error={form.formState.errors.manufacturingDate?.message}>
            <Input type="date" {...form.register("manufacturingDate")} />
          </Field>
          <Field label="Expiry date" error={form.formState.errors.expiryDate?.message}>
            <Input type="date" {...form.register("expiryDate")} />
          </Field>
          <Field label="Lifespan" error={form.formState.errors.lifespan?.message}>
            <Input placeholder="e.g. 24 months" {...form.register("lifespan")} />
          </Field>
          <Field label="Sustainability score (0–100)" error={form.formState.errors.sustainabilityScore?.message}>
            <Input type="number" {...form.register("sustainabilityScore")} />
          </Field>
          <Field label="Price (₹)" error={form.formState.errors.price?.message}>
            <Input type="number" {...form.register("price")} />
          </Field>
          <div className="md:col-span-2">
            <Label className="mb-2 block">Images</Label>
            <Input type="file" accept="image/*" multiple />
          </div>
          <Button type="submit" className="md:col-span-2 w-full sm:w-auto">
            Submit for approval
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
  error,
  className,
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
