import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";
export async function uploadFiles(files: File[]) {
    try {
        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            const fileRef = ref(storage, file.name);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            uploadedUrls.push(url);
        }

        return uploadedUrls;
    } catch (error) {
        throw new Error("Error al subir las imagenes", { cause: error });
    }
}
