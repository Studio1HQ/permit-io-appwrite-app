// import { Models } from 'appwrite';
import { Client, Users } from 'node-appwrite';
import { Permit } from 'permitio';


const permit = new Permit({
  token: process.env.VITE_PERMIT_API_KEY_PROD,
  pdp: "http://localhost:7766",
});

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  
  const users = new Users(client);

  const data = req.bodyJson;

  try {
    // await permit.api.users.create({email: data.email, key: data.email});
    await permit.api.createUser({email: data.email, key: data.email});
    log("User synced successfully!!!");
    return res.json({message: "User synced successfully!!!"});
  } catch (error) {
    log(error);
    return res.json({message: "Failed to sync user with Permit"});
  }
};
