import {
  deleteUserUploads,
  deleteUserUploadsDir
} from "../../lib/handleUploads";
import { redisSMQ } from "../../config/redis";
import Queue from "../../lib/Queue.js";
import Post from "../../models/Post";
import Reply from "../../models/Reply";

export async function initDeleteProfileQueue() {
  const deleteProfileQueue = new Queue(redisSMQ, "profile_deleted");
  await deleteProfileQueue.createQueue();
  return deleteProfileQueue;
}

export async function onDeleteProfile(payload) {
  const { authorProfileId } = JSON.parse(payload.message);
  await Post.deleteMany({ authorProfileId }).exec();
  await Reply.deleteMany({ authorProfileId }).exec();
  await deleteUserUploads(authorProfileId);
  await deleteUserUploadsDir(authorProfileId);
}
