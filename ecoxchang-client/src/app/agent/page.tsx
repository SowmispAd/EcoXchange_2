import { redirect } from "next/navigation";

export default function AgentLegacyRedirect() {
  redirect("/delivery/dashboard");
}
