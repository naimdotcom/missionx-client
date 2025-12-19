import { SigninForm } from "@/components/signin-form";

export const metadata = {
  title: "Sign in to your account | Brainchat",
  description: "Sign in to your account | Brainchat",
};

export default function SigninPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-md">
        <SigninForm />
      </div>
    </div>
  );
}
