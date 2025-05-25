import AuthLayout from '@/components/auth/auth-layout';
import SignInForm from '@/components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access your ShopTrack dashboard"
      altLink={{
        text: "Don't have an account?",
        href: "/auth/sign-up",
        linkText: "Create an account"
      }}
    >
      <SignInForm />
    </AuthLayout>
  );
}