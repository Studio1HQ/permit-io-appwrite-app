import { Download, FileText, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import ShareModal from "./ShareModal";
import { storage } from "../configurations/appwrite";

interface FileListProps {
  fileName: string;
  isOwner: boolean;
  fileId: string;
}

function FileList({ fileName, isOwner, fileId }: FileListProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [fileID, setFileID] = useState(fileId);

  const handleShareFile = () => {
    setFileID(fileId);
    dialogRef.current?.showModal();
    document.body.style.overflow = "hidden";
    console.log(fileID);
  };

  const handleDownloadFile = () => {
    const result = storage.getFileDownload(
      import.meta.env.VITE_FILES_BUCKET_ID,
      fileID
    );
    window.location.href = result;
  };

  const closeDialog = (): void => {
    dialogRef.current?.close();
    document.body.style.overflow = "visible";
  };

  return (
    <div className="px-2 flex flex-col gap-3 justify-center shadow-sm w-1/3">
      <FileText size={100} />
      <h3 className="font-semibold text-base text-wrap">{fileName}</h3>
      <div className="flex gap-3">
        {isOwner && (
          <button
            className="inline-flex gap-2 items-center border border-slate-400 px-2 py-1 rounded hover:text-slate-400 transition duration-75"
            onClick={handleShareFile}
          >
            Share
            <Share2 className="inline-block" size={20} />
          </button>
        )}
        <button onClick={handleDownloadFile} className="inline-flex gap-2 items-center px-2 py-1 rounded bg-green-500 text-white hover:bg-green-300 transition duration-75">
          Download
          <Download className="inline-block" size={20} />
        </button>
      </div>

      <ShareModal
        fileId={fileID}
        dialogRef={dialogRef}
        closeDialog={closeDialog}
      />
    </div>
  );
}

export default FileList;
