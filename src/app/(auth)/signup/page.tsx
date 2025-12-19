import { SignupForm } from "@/components/signup-form";

export const metadata = {
  title: "Sign up to your account | Brainchat",
  description: "Sign up to your account | Brainchat",
};

export default function SignupPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
}
