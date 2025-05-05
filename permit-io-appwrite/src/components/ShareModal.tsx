import React, { RefObject, useState } from "react";
import { shareFile } from "../actions/actions";
import { toast } from "react-toastify";

interface ShareModalProps {
  dialogRef: RefObject<HTMLDialogElement>;
  fileId: string;
  closeDialog: () => void;
  setError?: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess?: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

function ShareModal({
  fileId,
  closeDialog,
  dialogRef,
  // setError,
  // setSuccess,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  async function handleFileShare(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email === "") return;

    try {
      const res = await shareFile(fileId, email, role);
      if (!res.success) throw new Error(res.message);
      toast.success(`File shared successfully with ${email}`);
      // setSuccess(res.message);
      closeDialog();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
        // setError(error.message);
      };
      closeDialog();
    } finally {
      setEmail("");
      setRole("viewer");
    }
  }
  // console.log(role, email);

  return (
    <dialog ref={dialogRef} className="h-1/3 w-1/3 py-3 px-2">
      <div className="text-right">
        <button
          onClick={closeDialog}
          className="inline-block bg-gray-500 px-3 py-1 font-semibold rounded-sm transition-colors hover:text-white hover:bg-red-500"
        >
          X
        </button>
      </div>
      <form
        onSubmit={handleFileShare}
        className="px-8 py-4 flex flex-col gap-4 justify-center"
      >
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-400 rounded w-4/6 py-1 px-3 text-gray-700 leading-tight focus:outline focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="select-role">Role:</label>
          <select
            name="select"
            id="select-role"
            value={role}
            onChange={handleRoleChange}
            className="bg-gray-100 border border-blue-600 focus:outline-none rounded-md py-1 px-1"
          >
            <option value="owner">owner</option>
            <option value="viewer">viewer</option>
          </select>
        </div>
        <div className="flex gap-8">
          <button
            type="submit"
            className="bg-gray-200 hover:bg-gray-400 transition text-black font-bold py-2 px-4 rounded"
          >
            Share
          </button>
          <button
            onClick={closeDialog}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default ShareModal;
