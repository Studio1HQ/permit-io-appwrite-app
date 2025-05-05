import { Client, Account, Databases, Storage, Query, Models, Functions } from "appwrite";
// import { checkUserPermission, getUserRole } from "./permit-io";

// import { Navigate } from "react-router-dom";

export interface FunctionPromiseReturnType extends Models.Execution {
  ok?: boolean;
  message?: string;
  role?: string | string[];
  permitted?: boolean;
}

export interface Document extends Models.Document {
  ownerId: string;
  fileId: string;
  fileName: string;
  shared_with: string[];
}

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID as string);

export const account = new Account(client);

export const database = new Databases(client);

export const storage = new Storage(client);

export const functions = new Functions(client);

// fetch file metadata for both owned and shared files

export const fetchMetadata = async (userId: string, userEmail: string) => {
  try {
    // query database for files owned by the user
    const ownedFilesMetadata = await database.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      [Query.equal("ownerId", userId)]
    );

    // query database for files shared with the user
    const sharedFilesMetadata = await database.listDocuments(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_FILE_METADATA_COLLECTION_ID,
      [Query.contains("shared_with", [userEmail])]
    );

    return {
      ownedFilesMetadata: ownedFilesMetadata.documents,
      sharedFilesMetadata: sharedFilesMetadata.documents,
    };
  } catch (error) {
    console.log(error);
    return {
      ownFilesMetadata: [],
      sharedFilesMetadata: [],
    };
  }
};

// fetch data from the Appwrite Storage

export const fetchFileFromStorage = async (fileId: string) => {
  try {
    const url = storage.getFileView(import.meta.env.VITE_DATABASE_ID, fileId);
    return url;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchFilesWithUrl = async (files: Document[]) => {
  return Promise.all(
    files.map(async (file) => {
      try {
        const fileUrl = await fetchFileFromStorage(file?.fileId);
        return {
          ...file,
          fileUrl,
        };
      } catch (error) {
        console.log(error);
        return file;
      }
    })
  );
};

// fetch files with user roles
export async function fetchFilesWithUserPermission(
  userId: string,
  userEmail: string
) {
  const { ownedFilesMetadata, sharedFilesMetadata } = await fetchMetadata(
    userId,
    userEmail
  );

  // fetch file URLs
  const ownedFilesWithUrl = await fetchFilesWithUrl(ownedFilesMetadata);
  const sharedFilesWithUrl = await fetchFilesWithUrl(sharedFilesMetadata);

  const processFiles = async (files: Document[]) => {
    return Promise.all(
      files.map(async (file) => {
        // const role = await getUserRole(userEmail, file.fileId);
        // const permission = await checkUserPermission(userEmail, file.fileId, "share");

        const body = {
          endpoint: "check-user-permission",
          userKey: userEmail,
          fileId: file.fileId,
          action: "share"
        }

        const execution = await functions.createExecution(import.meta.env.VITE_FUNCTION_ID, JSON.stringify(body));
        const parsedExecution = JSON.parse(execution.responseBody);
        
        // console.log(`Permission for ${file.fileName}: ${permission.permitted}`);
        console.log(`Permission for ${file.fileName}: ${parsedExecution?.permitted}`, parsedExecution);
        return {
          ...file,
          canShare: parsedExecution?.permitted,
        };
      })
    );
  };

  const ownedFilesWithRole = await processFiles(ownedFilesWithUrl);
  const sharedFilesWithRole = await processFiles(sharedFilesWithUrl);

  return [...ownedFilesWithRole, ...sharedFilesWithRole];
}
