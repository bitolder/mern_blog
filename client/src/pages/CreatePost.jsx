import { TextInput, Select, Button, FileInput } from "flowbite-react";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
export default function CreatePost() {
  return (
    <div className="p-3 mx-auto min-h-screen  max-w-3xl ">
      <h1 className="text-3xl font-bold text-center mx-auto my-16">
        Create a post
      </h1>
      <form>
        <div className="flex flex-col sm:flex-row">
          <TextInput
            className="flex-1"
            type="text"
            placeholder="Title"
            required
            id="title"
          />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="nodejs">Node.js </option>
            <option value="reactjs">React.js </option>
            <option value="nextjs">Next.js </option>
          </Select>
        </div>
        <div className="flex border-4 border-dotted border-teal-500 items-center justify-between p-3 ">
          <FileInput accept="image/*" type="file" id="fileImageInput" />
          <Button outline g gradientDuoTone="purpleToPink">
            Upload image
          </Button>
        </div>
        <ReactQuill
          className="h-72 mb-12"
          theme="snow"
          placeholder="Write something..."
          required
        />
        <Button type="submit" gradientDuoTone="purpleToPink" className="w-full">
          Publish
        </Button>
      </form>
    </div>
  );
}
