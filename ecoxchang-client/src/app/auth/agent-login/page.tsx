import { redirect } from "next/navigation";

export default function AgentLoginRedirect() {
  redirect("/auth/delivery-login");
}
