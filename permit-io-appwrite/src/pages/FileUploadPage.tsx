import { ReactNode, useEffect, useState } from "react";
import FileList from "../components/FileList";
import { useAuth } from "../context/context";
import {
  database,
  fetchFilesWithUserPermission,
  storage,
} from "../configurations/appwrite";
import { ID } from "appwrite";
import { createResource } from "../configurations/permit-io";
import { toast } from "react-toastify";

function FileUploadPage() {
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [userFiles, setUserFiles] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const FilesWithRoles = await fetchFilesWithUserPermission(
          user.$id,
          user.email
        );
        setUserFiles(FilesWithRoles);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  }

  async function handleUpload() {
    if (file) {
      // console.log("Uploading file...");
      setStatus("uploading");
      setIsLoading(true);
      const fileData = new FormData();
      fileData.append("file", file);

      try {
        const fileId = ID.unique();

        // store file in Appwrite Storage
        const createdFile = await storage.createFile(
          import.meta.env.VITE_FILES_BUCKET_ID,
          fileId,
          file
        );

        // store metadata in database
        const fileMetadata = await database.createDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
          fileId,
          {
            fileName: file.name,
            fileId: createdFile.$id,
            ownerId: user.$id,
            shared_with: [],
          }
        );

        // create resource instance in Permt
        const createdResource = await createResource(
          "file",
          fileId,
          user.email
        );

        console.log(fileMetadata, createdResource);
        toast.success(createdResource);
        setStatus("success");
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) toast.error(error.message);
        setStatus("fail");
      } finally {
        setIsLoading(false);
        setStatus("initial");
        setFile(null);
      }
    }
  }

  console.log(user.$id);

  return (
    <div className="py-8 px-8 flex flex-col gap-1 items-center">
      <h1 className="text-2xl font-bold my-4">Welcome, {user.name}</h1>
      <p className="text-base font-semibold my-3">
        Upload, view, and share files with your friends
      </p>
      <form>
        <input
          type="file"
          name="file"
          id="file"
          onChange={handleFileChange}
          className="text-center cursor-pointer"
        />
      </form>

      <hr className="border w-full border-black my-8" />

      {file && (
        <section className="border-b w-1/3 text-wrap shadow-sm px-4 border-black my-4">
          <ul className="flex flex-col gap-2 my-3">
            <li className="font-semibold">{file.name}</li>
            <li className="text-gray-400">{(file.size / 1000).toFixed(2)}KB</li>
          </ul>
        </section>
      )}

      {file && (
        <button
          onClick={handleUpload}
          className="bg-blue-500 px-3 py-2 font-semibold cursor-pointer text-white rounded-md hover:bg-blue-300 transition-all"
          disabled={isLoading}
        >
          Upload file
        </button>
      )}

      <Result status={status} />

      <hr className="border w-full border-black my-8" />

      {loading ? (
        <p>Loading...</p>
      ) : userFiles.length === 0 ? (
        <p>No files found</p>
      ) : (
        userFiles.map((file, index) => {
          console.log(file.ownerId, user.$id);
          return (
            <div className="my-8 flex gap-4 flex-wrap" key={index}>
              <FileList
                fileName={file?.fileName}
                fileId={file.fileId}
              />
            </div>
          );
        })
      )}
    </div>
  );
}

function Result({ status }: { status: string }): ReactNode {
  if (status === "success") {
    return <p>✅ File uploaded successfully</p>;
  } else if (status === "fail") {
    return <p>❌ File upload failed</p>;
  } else if (status === "uploading") {
    return <p>⌛ Uploading selected file..</p>;
  } else {
    return null;
  }
}

export default FileUploadPage;
