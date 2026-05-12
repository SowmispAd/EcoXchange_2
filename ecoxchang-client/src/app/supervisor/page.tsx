import { redirect } from "next/navigation";

export default function SupervisorRootRedirect() {
  redirect("/supervisor/dashboard");
}
