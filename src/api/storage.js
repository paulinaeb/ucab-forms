import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebaseConfig";

export const uploadFiles = async (files) => {
  const snapshots = await Promise.all(
    files.map((file) => {
      const fileRef = ref(storage, `${Date.now() + file.name}`);
      return uploadBytes(fileRef, file);
    })
  );

  const downloadUrls = await Promise.all(
    snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
  );

  return snapshots.map((snapshot, i) => ({
    url: downloadUrls[i],
    type: snapshot.metadata.contentType,
    name: files[i].name,
  }));
};
