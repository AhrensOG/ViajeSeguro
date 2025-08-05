import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";
export async function uploadFiles(files: File[], folder = "Documentos", name = false) {
  try {
    const uploadedUrls: string[] = [];

    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const uniqueName = `${timestamp}_${name || file.name}`;
      const storageRef = ref(storage, `${folder}/${uniqueName}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      uploadedUrls.push(url);
    }
    return uploadedUrls;
  } catch (error) {
    console.log(error)
    throw new Error("Error al subir las imagenes", { cause: error });
  }
}