import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <SignUp
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-slate-900 border border-slate-800',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700',
            formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500',
            formFieldInput: 'bg-slate-800 border-slate-700 text-white',
            formFieldLabel: 'text-slate-300',
            footerActionLink: 'text-indigo-400 hover:text-indigo-300',
          },
        }}
      />
    </div>
  );
}

