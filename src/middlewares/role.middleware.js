export const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      const err = new Error("Access Forbidden");
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};
