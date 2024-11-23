import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { handleError } from "../utils/error.js";
export const test = (req, res, next) => {
  res.json("heloooooooooooooo");
};
export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(handleError(401, "You can only update your own account!"));

  try {
    if (req.body.password) {
      if (req.body.password) {
        if (req.body.password.length < 6) {
          return next(
            handleError(400, "Password must be at least 6 characters")
          );
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
    }
    if (req.body.username) {
      if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
          handleError(400, "Username must be between 7 and 20 characters")
        );
      }
    }
    if (req.body.username.includes(" ")) {
      return next(handleError(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(handleError(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        handleError(400, "Username can only contain letters and numbers")
      );
    }

    // if (
    //   req.body.username.length < 6 ||
    //   req.body.username.length > 20 ||
    //   req.body.password.length < 6 ||
    //   req.body.password.length > 20 ||
    //   req.body.email.length < 6 ||
    //   req.body.email.length > 20
    // ) {
    //   setUpdateUserError(
    //     "username, email, password must be at least 6 characters and less than 20 characters"
    //   );
    //   dispatch(
    //     updateFailure(
    //       "username must be at least 6 characters and less than 20 characters"
    //     )
    //   );
    //   return;
    // }
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

// export const updateUser = async (req, res, next) => {
//   if (req.user.id !== req.params.id) {
//     return next(handleError(403, "You are not allowed to update this user"));
//   }
//   if (req.body.password) {
//     if (req.body.password.length < 6) {
//       return next(handleError(400, "Password must be at least 6 characters"));
//     }
//     req.body.password = bcryptjs.hashSync(req.body.password, 10);
//   }
//   if (req.body.username) {
//     if (req.body.username.length < 7 || req.body.username.length > 20) {
//       return next(
//         handleError(400, "Username must be between 7 and 20 characters")
//       );
//     }
//     if (req.body.username.includes(" ")) {
//       return next(handleError(400, "Username cannot contain spaces"));
//     }
//     if (req.body.username !== req.body.username.toLowerCase()) {
//       return next(handleError(400, "Username must be lowercase"));
//     }
//     if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
//       return next(
//         handleError(400, "Username can only contain letters and numbers")
//       );
//     }
//   }
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: {
//           username: req.body.username,
//           email: req.body.email,
//           profilePicture: req.body.profilePicture,
//           password: req.body.password,
//         },
//       },
//       { new: true }
//     );
//     const { password, ...rest } = updatedUser._doc;
//     res.status(200).json(rest);
//   } catch (error) {
//     next(error);
//   }
// };
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
