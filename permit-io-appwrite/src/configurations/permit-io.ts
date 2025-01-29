// import { toast } from "react-toastify";

export interface User {
  email: string;
  key: string;
}

export interface ResourceInstance {
  key: string;
  resource: string;
}

export interface ResourceInstanceRole {
  user: string;
  role: string;
  resource_instance: string;
}

export type PermissionType =
  | "view"
  | "create"
  | "download"
  | "update"
  | "share";

export interface ResourcePermission {
  user: string;
  resource_instance: string;
  permissions: PermissionType[];
}

const baseUrl = import.meta.env.VITE_BASE_URL;

// function to sync users with Permit
export async function syncUsersWithPermit(email: string, name: string) {
  try {
    const response = await fetch(`${baseUrl}/sync-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userEmail: email,
        userKey: email,
        userName: name,
      }),
    });

    if (!response.ok) throw new Error("Failed to sync user with Permit");

    const data = await response.json();
    console.log(data);
    return `User synced with Permit successfully`;
  } catch (error) {
    console.error(error);
    return `Failed to sync user with Permit`;
  }
}

export async function createResource(
  resource: string,
  key: string,
  userKey: string
) {
  try {
    const response = await fetch(`${baseUrl}/create-resource`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resource,
        key,
        userKey,
      }),
    });

    if (!response.ok) return `Failed to create resource`;

    const data = await response.json();
    console.log(data);
    return data.message;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return error.message;
    return `An error occurred: ${error}`;
  }
}

export async function getUserRole(userKey: string, fileId: string) {
  try {
    const response = await fetch(`${baseUrl}/get-user-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userKey, fileId }),
    });

    if (!response.ok)
      throw new Error("An error occurred while getting user role");

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return error.message;
    return `An error occurred: ${error}`;
  }
}

export async function updateSharedUserRole(
  userKey: string,
  role: string,
  fileId: string,
  requesterEmail: string
) {
  try {
    const res = await fetch(`${baseUrl}/update-user-role`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userKey,
        role,
        fileId,
        requesterEmail,
      }),
    });

    if (!res.ok) throw new Error(`An error occurred while updating user role: ${res.statusText}`);

    const data = await res.json();
    console.log(res, data);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return error.message;
    };
    return `An error occurred when updating the shared user's role`;
  }
}

export async function checkUserPermission(
  userKey: string,
  fileId: string,
  action: string
) {
  try {
    const response = await fetch(`${baseUrl}/check-user-permission`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userKey, fileId, action }),
    });

    if (!response.ok)
      throw new Error("An error occurred while checking user's permission");

    const data = await response.json();
    console.log(data);
    return data; // {permitted: true}
  } catch (error) {
    if (error instanceof Error) return error.message;
    return `An error occurred: ${error}`;
  }
}
