// Debounce with flush() to run a pending call immediately and cancel() to drop it.
const customDebounce = (func, delay) => {
  let timer = null;
  let pendingArgs = null;
  let pendingContext = null;

  const run = () => {
    const args = pendingArgs;
    const context = pendingContext;
    timer = null;
    pendingArgs = null;
    pendingContext = null;
    func.apply(context, args);
  };

  function debounced(...args) {
    pendingArgs = args;
    pendingContext = this;
    clearTimeout(timer);
    timer = setTimeout(run, delay);
  }

  debounced.flush = () => {
    if (timer !== null) {
      clearTimeout(timer);
      run();
    }
  };

  debounced.cancel = () => {
    clearTimeout(timer);
    timer = null;
    pendingArgs = null;
    pendingContext = null;
  };

  return debounced;
};

export default customDebounce;
