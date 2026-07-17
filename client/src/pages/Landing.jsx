import { Link } from 'react-router-dom';
import { MdReceiptLong, MdBarChart, MdSavings, MdArrowForward } from 'react-icons/md';

const features = [
  { icon: MdReceiptLong, title: 'Track Expenses & Income', desc: 'Log every transaction in seconds and keep a clear record of where your money goes.' },
  { icon: MdSavings, title: 'Set Monthly Budgets', desc: 'Define spending limits per category and get visual warnings before you overspend.' },
  { icon: MdBarChart, title: 'Insightful Reports', desc: 'Understand your habits with interactive charts and month-over-month trends.' },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-lg font-bold text-white">
            P
          </div>
          <span className="text-lg font-bold text-gray-900">PennyPath</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-secondary">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Take control of your money with <span className="text-primary-600">PennyPath</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500">
          A simple, powerful expense tracker to help you manage spending, plan budgets, and build
          better financial habits — one penny at a time.
        </p>
        <Link to="/register" className="btn-primary mx-auto mt-8 w-fit px-6 py-3 text-base">
          Start Tracking Free <MdArrowForward size={20} />
        </Link>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-20 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-left">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <Icon size={22} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1.5 text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        PennyPath &copy; {new Date().getFullYear()} — Built with the MERN stack.
      </footer>
    </div>
  );
};

export default Landing;
