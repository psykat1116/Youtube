interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="h-full w-full flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthLayout;
