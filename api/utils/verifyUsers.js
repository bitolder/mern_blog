import jwt from "jsonwebtoken";
import { handleError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // on recup le token "cookie"

  if (!token) return next(handleError(401, "Unauthorized")); // on vérifie le token si il existe ou pas

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // on vérifie si c'est le bon token en fonction du compte de l'utilisateur
    if (err) return next(handleError(403, "Forbidden"));

    req.user = user; // on envoie l'user a update " dans user.controller" grace au next qui es un middleware
    next();
  });
};
