import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground max-w-md">This path is not part of EcoXchange navigation.</p>
      <Link href="/" className={cn(buttonVariants(), "no-underline")}>
        Back home
      </Link>
    </div>
  );
}
