import AuthLayout from '@/components/auth/auth-layout';
import SignUpForm from '@/components/auth/sign-up-form';

export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Register your shop with ShopTrack to get started"
      altLink={{
        text: "Already have an account?",
        href: "/auth/sign-in",
        linkText: "Sign in"
      }}
    >
      <SignUpForm />
    </AuthLayout>
  );
}