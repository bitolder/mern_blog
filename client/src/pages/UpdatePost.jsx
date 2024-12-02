import { TextInput, Select, Button, FileInput, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
export default function UpdatePost() {
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    postImage: "",
    content: "",
  });
  const [files, setFiles] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const params = useParams();
  const idpostFromUrl = params.postId;
  console.log(formData);

  useEffect(() => {
    const fetchUpdatePost = async () => {
      try {
        const res = await fetch(`/api/post/get/${idpostFromUrl}`);
        const data = await res.json();
        console.log(data);

        setFormData((prevFormData) => ({
          ...prevFormData,
          title: data.title,
          category: data.category,
          postImage: data.postImage,
          content: data.content,
        }));

        // setEditorContent(data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUpdatePost();
  }, [idpostFromUrl]);

  // useEffect(() => {
  //   const fetchUpdatePost = async () => {
  //     try {
  //       const res = await fetch(`/api/post/getposts?postId=${idpostFromUrl}`);
  //       const data = await res.json();
  //       console.log(data.posts);

  //       setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         title: data.posts[0].title,
  //         category: data.posts[0].category,
  //         postImage: data.posts[0].postImage,
  //         content: data.posts[0].content,
  //       }));

  //       // setEditorContent(data.content);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchUpdatePost();
  // }, [idpostFromUrl]);

  // const handleChange = (e) => {
  //   const { id, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [id]: value,
  //   }));
  // };
  const handleChange = (e) => {
    // setFormData({ ...formData, [e.target.id]: e.target.value });
    setFormData((preveform) => ({
      ...preveform,
      [e.target.id]: e.target.value,
    }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setFormData((prevFormData) => ({ ...prevFormData, content: data }));
  };
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/update/${idpostFromUrl}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        console.log("Failed to update");
      }
      const data = await res.json();
      navigate(`/post/${data.slug}`);
      setPublishError(null);
    } catch (error) {
      setPublishError("Failed to update post");
      console.log(error);
    }
  };
  const handleUploadImageforUpdate = async () => {
    if (!files) {
      setFileUploadError("Please select an image");
      return;
    }
    setFileUploadError(null);

    try {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + files.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, files);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError("Failed to upload image");
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadError(null);
            setFormData({ ...formData, postImage: downloadURL });
            setFileUploadProgress(null);
          });
        }
      );
    } catch (error) {
      setFileUploadError("Failed to upload image");
      console.log(error);
    }
  };

  return (
    <div className="p-3 mx-auto min-h-screen  max-w-3xl ">
      <h1 className="text-3xl font-bold text-center mx-auto my-16">
        Update a post
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmitUpdate}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="Title"
            required
            id="title"
            defaultValue={formData.title}
            onChange={handleChange}
          />
          <Select
            value={formData.category}
            onChange={handleChange}
            id="category"
          >
            <option value="uncategorized">Select a category</option>
            <option value="nodejs">Node.js </option>
            <option value="reactjs">React.js </option>
            <option value="nextjs">Next.js </option>
          </Select>
        </div>
        <div className="flex border-4 border-dotted border-teal-500 items-center justify-between p-3 ">
          <FileInput
            accept="image/*"
            type="file"
            id="fileImageInput"
            onChange={(e) => {
              setFiles(e.target.files[0]);
            }}
          />
          <Button
            outline
            gradientDuoTone="purpleToPink"
            disabled={fileUploadProgress}
            onClick={handleUploadImageforUpdate}
          >
            {fileUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={fileUploadProgress}
                  text={`${fileUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {fileUploadError && <Alert color="failure">{fileUploadError}</Alert>}
        {formData.postImage && (
          <img
            src={formData.postImage}
            alt="uploadImage"
            className="w-full h-72 object-cover"
          />
        )}
        <CKEditor
          editor={ClassicEditor}
          data={formData.content}
          onChange={handleEditorChange}
          config={{
            placeholder: "Write something...",
            toolbar: [
              "undo",
              "redo",
              "bold",
              "italic",
              "link",

              "blockQuote",
              "numberedList",
              "bulletedList",
              "heading",
              "blockQuote",
            ],
          }}
        />

        <style>
          {`
          .ck-editor__editable_inline {
            min-height: 500px; /* Ajustez cette valeur pour la hauteur */
           
            
          }
            // .dark .ck-content {
            // background-color: #4B5563 !important; /* Couleur de  */
          
            //   }
        `}
        </style>
        <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">
          Update
        </Button>
      </form>
    </div>
  );
}
