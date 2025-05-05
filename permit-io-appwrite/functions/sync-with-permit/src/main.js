const { Client, Users } = require('node-appwrite');
const { Permit } = require('permitio');

const permit = new Permit({
  token: process.env.PERMIT_API_KEY_PROD,
  pdp: 'https://d143-105-116-13-106.ngrok-free.app',
});

// This Appwrite function will be executed every time your function is triggered
module.exports = async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT || '')
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID || '')
    .setKey(req.headers['x-appwrite-key'] ?? process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  const data = req.bodyJson;

  if (!data) return res.json({ ok: 'failed', message: 'No data found' });

  const headers = req.headers;

  log(headers['x-appwrite-trigger']);

  const triggerType = headers['x-appwrite-trigger'];

  if (triggerType === 'http' && data.endpoint === 'get-user-role') {
    const { userKey, fileId } = data;
    const resourceInstance = `file:${fileId}`;
    try {
      const role = await permit.getUserPermissions(
        userKey,
        ['default'],
        [resourceInstance]
      );
      log(role);
      return res.json({ ok: true, role: role[`file:${fileId}`]?.roles });
    } catch (err) {
      error(err);
      return res.json({
        ok: false,
        message: `An error occurred while fetching user role: ${err instanceof Error ? err.message : 'An unexpected error occurred'}`,
      });
    }
  }

  if (triggerType === 'http' && data.endpoint === 'check-user-permission') {
    const { userKey, fileId, action } = data;
    const resourceInstance = `file:${fileId}`;
    try {
      const permitted = await permit.check(userKey, action, resourceInstance);
      log(permitted);
      return res.json({ ok: true, permitted });
    } catch (err) {
      error(err);
      return res.json({
        ok: false,
        message: `${err instanceof Error ? err.message : 'An unknown error occurred'}`,
      });
    }
  }

  if (triggerType === 'http' && data.endpoint === 'update-user-role') {
    const { sharedUserKey, role, fileId, requesterEmail } = data;
    const resourceInstance = `file:${fileId}`;
    try {
      const isPermitted = await permit.check(
        requesterEmail,
        'share',
        resourceInstance
      );
      if (!isPermitted)
        return res.json({
          ok: false,
          message: "You don't have permission to share this file",
        });
      const roleAssignment = await permit.api.roleAssignments.assign({
        user: sharedUserKey,
        role,
        resource_instance: resourceInstance,
      });
      log(roleAssignment);
      return res.empty();
    } catch (err) {
      error(err);
      return res.json({
        ok: false,
        message: `${err instanceof Error ? err.message : 'An unidentified error occurred'}`,
      });
    }
  }

  if (triggerType === 'event' && data.bucketId) {
    try {
      const user = await users.get(headers['x-appwrite-user-id']);
      const resourceInstance = await permit.api.resourceInstances.create({
        resource: 'file',
        key: data.$id,
        tenant: 'default',
      });
      const resource_instance = `file:${data.$id}`;
      const assignedRoleToUser = await permit.api.roleAssignments.assign({
        user: user?.email,
        role: 'owner',
        resource_instance,
      });
      log(assignedRoleToUser, resourceInstance);
      return res.json({
        ok: true,
        message: `Resource instance created and the owner is ${user?.name}`,
      });
    } catch (err) {
      error(err);
      return res.json({
        ok: false,
        message: `There was error adding file resource`,
      });
    }
  }

  if (triggerType === 'event' && data?.email) {
    try {
      const user = {
        key: data?.email,
        email: data?.email,
        first_name: data?.name,
        last_name: '',
        attributes: {
          tenant: 'default',
        },
      };
      const syncedUser = await permit.api.users.sync(user);
      if (!syncedUser) throw new Error('An Error occurred while syncing user');
      log(syncedUser);
      return res.json({
        ok: true,
        message: `${data?.name} synced successfully`,
      });
    } catch (error) {
      return res.json({
        ok: false,
        message: `${error instanceof Error ? error.message : 'An unknown error occurred'}`,
      });
    }
  }
};
