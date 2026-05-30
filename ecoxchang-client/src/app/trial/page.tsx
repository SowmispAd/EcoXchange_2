import { redirect } from "next/navigation";

export default function TrialRootRedirect() {
  redirect("/dashboard/trial/dashboard");
}
