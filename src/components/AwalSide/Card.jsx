const Card = ({ children, className = "" }) => {
  return (
    <div className={'bg-white shadow rounded-lg p-4 ${className}'}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={'mt-2 text-sm ${className}'}>{children}</div>;
};

export { Card, CardContent };