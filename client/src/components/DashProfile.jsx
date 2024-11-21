import { Label, TextInput, Button, Alert } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
export default function DashProfile() {
  const [imageFiles, setImageFiles] = useState(null);
  const [imageFilesUrl, setImageFilesUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const filePickerRef = useRef();
  const { currentUser } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      setImageFiles(files);
      setImageFilesUrl(URL.createObjectURL(files));
    }
  };
  useEffect(() => {
    if (imageFiles) {
      uploadImageFiles();
    }
  }, [imageFiles]);
  const uploadImageFiles = async () => {
    setImageUploadError(null);
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
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFilesUrl(downloadURL);
        });
      }
    );
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full ">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
          />
        </div>
        <div>
          <Label value="Your email" />
          <TextInput type="text" defaultValue={currentUser.email} id="email" />
        </div>
        <div>
          <Label value="Your password" />
          <TextInput type="text" placeholder="password" id="password" />
        </div>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          {" "}
          Update
        </Button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="cursor-pointer text-red-500">Delete account</span>
        <span className="cursor-pointer text-red-500"> Sign Out</span>
      </div>
    </div>
  );
}
