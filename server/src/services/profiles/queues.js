import { redisSMQ } from "../../config/redis";
import Profile from "../../models/Profile";
import Queue from "../../lib/Queue";

export async function initDeleteAccountQueue() {
  const deleteAccountQueue = new Queue(redisSMQ, "account_deleted");
  await deleteAccountQueue.createQueue();
  return deleteAccountQueue;
}

export async function initDeleteProfileQueue() {
  const deleteProfileQueue = new Queue(redisSMQ, "profile_deleted");
  await deleteProfileQueue.createQueue();
  return deleteProfileQueue;
}

export async function onDeleteAccount(payload, deleteProfileQueue) {
  const { accountId } = JSON.parse(payload.message);
  const { _id } = await Profile.findOneAndDelete({ accountId }).exec();
  await Profile.updateMany({ $pull: { following: _id } }).exec();

  if (_id) {
    deleteProfileQueue.sendMessage(JSON.stringify({ authorProfileId: _id }));
  }
}
