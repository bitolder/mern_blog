import { TextInput, Select, Button, FileInput, Alert } from "flowbite-react";
import { useState } from "react";
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
export default function CreatePost() {
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const navigate = useNavigate();
  console.log(formData);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    console.log(data);
    // setEditorContent(data); // Mettez à jour le contenu de l'éditeur
    setFormData({ ...formData, content: data });
  };

  const handleUploadImage = async () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <div className="p-3 mx-auto min-h-screen  max-w-3xl ">
      <h1 className="text-3xl font-bold text-center mx-auto my-16">
        Create a post
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="Title"
            required
            id="title"
            onChange={handleChange}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
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
            onClick={handleUploadImage}
            disabled={fileUploadProgress}
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

        {/* <ReactQuill
          className="h-72 mb-12"
          theme="snow"
          placeholder="Write something..."
          required
        /> */}
        {/* <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Write something..."
        /> */}
        <CKEditor
          editor={ClassicEditor}
          config={{
            placeholder: "Write something...", // Placeholder personnalisé?
          }}
          onChange={handleEditorChange}
        />
        <style>
          {`
          .ck-editor__editable_inline {
            min-height: 500px; /* Ajustez cette valeur pour la hauteur */
          }
        `}
        </style>
        <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">
          Publish
        </Button>
      </form>
    </div>
  );
}
