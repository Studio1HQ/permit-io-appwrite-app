import { database, Document } from "../configurations/appwrite";
import { updateSharedUserRole } from "../configurations/permit-io";

export async function shareFile(
  fileId: string,
  userEmail: string,
  role: string
) {
  try {
    const currentDoc: Document = await database.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      fileId
    );

    const result = await database.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      fileId,
      {
        shared_with: [...currentDoc.shared_with, userEmail],
      }
    );
    const updateRoleResult = await updateSharedUserRole(
      userEmail,
      role,
      fileId
    );
    console.log(result, updateRoleResult);
    return updateRoleResult;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error.message;
    return "An error occurred";
  }
}
