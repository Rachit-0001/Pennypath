import useAuth from './useAuth';

/**
 * Returns a formatter function bound to the logged-in user's preferred
 * currency, falling back to INR when no user is available.
 */
const useCurrency = () => {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const format = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    } catch {
      return `${currency} ${Number(amount || 0).toFixed(2)}`;
    }
  };

  return { currency, format };
};

export default useCurrency;
