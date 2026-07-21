import { LoginButton } from "@/components/auth/LoginButton";
import { Wallet } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="card accent-glow w-full max-w-md p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
          <Wallet className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-white">Personal Finance</h1>
        <p className="mb-8 text-sm text-muted">
          Track your monthly salary, category budgets, and spending in PKR.
        </p>
        <LoginButton />
        <p className="mt-6 text-xs text-muted">
          Sign in with Google to sync your data across devices.
        </p>
      </div>
    </div>
  );
}
