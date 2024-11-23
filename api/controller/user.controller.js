import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { handleError } from "../utils/error.js";
export const test = (req, res, next) => {
  res.json("heloooooooooooooo");
};
// export const updateUser = async (req, res, next) => {
//   if (req.user.id !== req.param)
//     return next(handleError(401, "You can only update your own account!"));
//   try {
//     if (req.body.password) {
//       req.body.password = bcryptjs.hashSync(req.body.password, 10);
//     }
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       {
//         $set: {
//           username: req.body.username,
//           email: req.body.email,
//           password: req.body.password,
//           profilePic: req.body.profilePic,
//         },
//       },
//       { new: true }
//     );
//     const { pass: password, ...infoUser } = updatedUser._doc;
//     res.status(200).json(infoUser);
//   } catch (error) {
//     next(error);
//   }
// };
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(handleError(401, "You can only update your own account!"));
  // if (
  //   !req.body.username ||
  //   !req.body.email ||
  //   req.body.username === "" ||
  //   req.body.email === ""
  // )
  //   return next(handleError(404, "empty field"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(handleError(401, "You can only delete your own account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token", { httpOnly: true });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const signoutUser = async (req, res, next) => {
  res.clearCookie("access_token", { httpOnly: true });
  res.status(200).json({ message: "User signed out successfully" });
};
