const ProtectedRoute = ({ cond, ifComp, elseComp }) => {
  if (cond) {
    return ifComp;
  }
  return elseComp;
};

export default ProtectedRoute;
