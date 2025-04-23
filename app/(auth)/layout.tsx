interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-full w-full flex justify-center items-center bg-[radial-gradient(circle,rgba(255,0,0,1)_0%,rgba(136,0,0,1)_100%)]">
      {children}
    </div>
  );
};

export default AuthLayout;
