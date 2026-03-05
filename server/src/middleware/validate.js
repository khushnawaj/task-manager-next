import { ValidationError } from "../utils/errors.js";

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (err) {
            if (err.name === "ZodError") {
                const errors = err.errors.map((e) => ({
                    path: e.path.join("."),
                    message: e.message,
                }));
                return next(new ValidationError("Validation failed", errors));
            }
            next(err);
        }
    };
};
