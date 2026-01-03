export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errorMesages = result.error.format();

      const error = Object.values(errorMesages)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({
        success: false,
        status: "error",
        message: error.join(", "),
      });
    }
    next();
  };
};
