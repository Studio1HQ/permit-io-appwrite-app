import { account, database, Document } from "../configurations/appwrite";
import { updateSharedUserRole } from "../configurations/permit-io";

export async function shareFile(
  fileId: string,
  userEmail: string,
  role: string
) {
  const user = await account.get();
  
  try {
    const currentDoc: Document = await database.getDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      fileId
    );
    console.log(user.$id, userEmail, currentDoc.ownerId);
    
    if(!user) throw new Error("Unauthorized: User not found");

    if(currentDoc.shared_with.includes(userEmail)) throw new Error("Error: User already has access to this file");

    if(currentDoc.ownerId === user.$id && userEmail === user.email) throw new Error("Error: You can't share a file with yourself");

    const updateRoleResult = await updateSharedUserRole(
      userEmail,
      role,
      fileId,
      user.email
    );

    if (updateRoleResult?.status === 403 && updateRoleResult?.message === "You don't have permission to update user role") {
      throw new Error("Unauthorized: You don't have permission to update user role");
    }

    if (updateRoleResult?.status === 403) throw new Error("An unknown error occurred");

    const result = await database.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      fileId,
      {
        shared_with: [...currentDoc.shared_with, userEmail],
      }
    );
    console.log(result, updateRoleResult);
    return {
      success: true,
      message: updateRoleResult?.message,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return {
        success: false,
        message: error.message,
      }
    };
    return {
      success: false,
      message: "An error unknown occurred while sharing the file",
    };
  }
}
