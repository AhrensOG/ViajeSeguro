import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./config";
export async function uploadFiles(files: File[]) {
    console.log(process.env.FIREBASE_STORAGE_BUCKET);

    try {
        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            const fileRef = ref(storage, file.name);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            uploadedUrls.push(url);
        }
        console.log(uploadedUrls);

        return uploadedUrls;
    } catch (error) {
        console.log(error);

        throw new Error("Error al subir las imagenes", { cause: error });
    }
}
