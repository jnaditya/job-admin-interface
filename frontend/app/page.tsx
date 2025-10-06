import { redirect } from "next/navigation";

export default function Home() {
  // This is a server component, so redirect is allowed
  redirect("/jobs");

  return null; // Fallback (won’t render because of redirect)
}
