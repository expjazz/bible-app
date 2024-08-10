import axios from "axios";
import { env } from "~/env";

export const bibleAxiosClient = axios.create({
  baseURL: "https://www.abibliadigital.com.br/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${env.NEXT_PUBLIC_BIBLE_TOKEN}`,
  },
});
