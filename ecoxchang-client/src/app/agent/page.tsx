import { redirect } from "next/navigation";

export default function AgentLegacyRedirect() {
  redirect("/dashboard/delivery/dashboard");
}
