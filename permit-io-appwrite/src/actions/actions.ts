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
    
    // if(currentDoc.ownerId !== user.$id) throw new Error("Unauthorized: Only the owner can share the file");

    // if(currentDoc.shared_with.includes(userEmail)) throw new Error("User already has access to this file");

    if(currentDoc.ownerId === user.$id && userEmail === user.email) return

    if(currentDoc.shared_with.includes(userEmail)) return

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
      fileId,
      user.email
    );
    console.log(result, updateRoleResult);
    return updateRoleResult;
  } catch (error) {
    // console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
      return error.message
    };
    return "An error occurred";
  }
}
