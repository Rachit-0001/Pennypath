/**
 * Simple reusable spinner. `fullScreen` centers it in the viewport,
 * otherwise it renders inline (useful inside buttons or cards).
 */
const Loader = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-4' };

  const spinner = (
    <div
      className={`animate-spin rounded-full border-primary-600 border-t-transparent ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default Loader;
