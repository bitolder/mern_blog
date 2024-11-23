import { Label, TextInput, Button, Alert, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector, useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  updateFailure,
  updateSuccess,
  updateStart,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const [imageFiles, setImageFiles] = useState(null);
  const [imageFilesUrl, setImageFilesUrl] = useState(null);
  const { currentUser, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [formDatacopied, setFormDatacopied] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [uploadImagesProgress, setUploadImagesProgress] = useState(null);
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      setImageFiles(files);
      setImageFilesUrl(URL.createObjectURL(files));
    }
  };
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  useEffect(() => {
    if (imageFiles) {
      uploadImageFiles();
    }
  }, [imageFiles]);

  useEffect(() => {
    // Initialise formData avec les données de currentUser
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
      });
      const initialData = {
        username: currentUser.username,
        email: currentUser.email,
      };
      setFormDatacopied({ ...initialData });
    }
  }, [currentUser]);

  const uploadImageFiles = async () => {
    setImageUploadError(null);
    setUploadImagesProgress(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFiles.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFiles);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(
          "could not upload image ( File must be less than 2MB)"
        );
        setImageUploadProgress(null);
        setImageFiles(null);
        setImageFilesUrl(null);
        setUploadImagesProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFilesUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });

          setUploadImagesProgress(null);
        });
      }
    );
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserSuccess(false);
    setUpdateUserError(null);
    if (
      Object.values(formData).every(
        (value, index) => value === Object.values(formDatacopied)[index]
      )
    ) {
      setUpdateUserError("no changes were made");
      dispatch(updateFailure("Please fill out all fields."));
      return;
    }

    if (!formData.username || !formData.username.match(/^[a-zA-Z0-9]+$/)) {
      dispatch(
        updateFailure(" username can only contain letters and numbers.")
      );
      setUpdateUserError(" username can only contain letters and numbers.");
      return;
    }

    if (formData.username.length < 6 || formData.username.length > 20) {
      dispatch(
        updateFailure(
          "Username must be at least 6 characters and less than 20 characters."
        )
      );
      setUpdateUserError(
        "Username must be at least 6 characters and less than 20 characters."
      );
      return;
    }

    if (!formData.email || !formData.email.match(/^[a-zA-Z0-9._@]+$/)) {
      dispatch(
        updateFailure("Email can only contain letters, numbers, @, ., and _.")
      );
      setUpdateUserError(
        "Email can only contain letters, numbers, @, ., and _."
      );
      return;
    }

    if (formData.email.length < 6 || formData.email.length > 20) {
      dispatch(
        updateFailure(
          "Email must be at least 6 characters and less than 20 characters."
        )
      );
      setUpdateUserError(
        "Email must be at least 6 characters and less than 20 characters."
      );
      return;
    }
    if (formData.password) {
      if (formData.password.length < 6) {
        dispatch(updateFailure("Password must be at least 6 characters"));
        setUpdateUserError("Password must be at least 6 characters");
        return;
      }
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setUpdateUserSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserSuccess(true);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(signOutUserFailure(data.message));
      } else {
        dispatch(signOutUserSuccess(data));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className=" relative cursor-pointer rounded-full shadow-md overflow-hidden w-32 h-32 self-center "
          onClick={() => filePickerRef.current.click()}
        >
          {imageUploadProgress && (
            <CircularProgressbar
              className="w-24 h-24 mx-auto"
              value={imageUploadProgress || 0}
              text={`${imageUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199, ${imageUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFilesUrl || currentUser.profilePicture}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageUploadProgress && imageUploadProgress < 100 && "opacity-60"
            }`}
            alt="userProfile"
          />
        </div>
        {imageUploadError && <Alert color="failure"> {imageUploadError}</Alert>}
        <div>
          <Label value="Your Username" />
          <TextInput
            type="text"
            defaultValue={currentUser.username}
            id="username"
            onChange={handleFormChange}
          />
        </div>
        <div>
          <Label value="Your email" />
          <TextInput
            type="text"
            defaultValue={currentUser.email}
            id="email"
            onChange={handleFormChange}
          />
        </div>
        <div>
          <Label value="Your password" />
          <TextInput
            type="text"
            placeholder="password"
            id="password"
            onChange={handleFormChange}
          />
        </div>
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={uploadImagesProgress || loading}
        >
          {uploadImagesProgress ? "loading..." : "Update"}
        </Button>
        {currentUser && currentUser.isAdmin && (
          <Link to="/create-post">
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
        {updateUserSuccess && (
          <Alert color="success">Profile updated successfully.</Alert>
        )}
        {updateUserError && <Alert color="failure"> {updateUserError}</Alert>}
      </form>
      <div className="flex justify-between mt-4">
        <span
          onClick={() => setShowModal(true)}
          className="cursor-pointer text-red-500"
        >
          Delete account
        </span>
        <span className="cursor-pointer text-red-500" onClick={handleSignout}>
          {" "}
          Sign Out
        </span>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          popup
          onClose={() => setShowModal(false)}
          size="md"
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-3 text-lg  text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </h3>
              <div className="flex justify-between">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color="success" onClick={() => setShowModal(false)}>
                  No, Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}
