import { redirect } from "next/navigation";

export default function DeliveryRootRedirect() {
  redirect("/delivery/dashboard");
}
