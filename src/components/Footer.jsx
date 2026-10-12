const YEAR = new Date().getFullYear();

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6 lg:px-8">
      <p>&copy; {YEAR} Code Together</p>
      <p>
        Built by <span className="font-medium text-slate-700">Krunal Bhandekar</span>
      </p>
    </div>
  </footer>
);

export default Footer;
