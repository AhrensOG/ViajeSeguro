import { BACKEND_URL } from "@/lib/constants";
import { fetcher } from "@/lib/functions";
import { ContactFormData } from "./contact.types";


export const sendContactFormFromHomePage = async (data: ContactFormData): Promise<void> => {
  return fetcher<void>(`${BACKEND_URL}/contact/from-home-page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const sendContactFormFromContactPage = async (data: ContactFormData): Promise<void> => {
  return fetcher<void>(`${BACKEND_URL}/contact/from-contact-page`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};