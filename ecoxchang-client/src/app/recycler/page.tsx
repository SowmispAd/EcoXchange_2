import { redirect } from "next/navigation";

export default function RecyclerRootRedirect() {
  redirect("/dashboard/recycler/dashboard");
}
