import { redirect } from "next/navigation";

export default function DeliveryRootRedirect() {
  redirect("/dashboard/delivery/dashboard");
}
