import Head from "next/head";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import S3List from "../components/S3List";

type Fields = {
  uploads: FileList;
};

const queryKey = "basic-uploads";

export default function Basic() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<Fields>();

  const [example, setExample] = useState("multer");

  // Will either be /upload-with-multer or /upload-with-busboy
  const endpoint = `/api/upload-with-${example}`;

  return (
    <>
      <Head>
        <title>Basic file uploads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 flex flex-col items-center justify-center">
        <Nav />

        <div className="w-full max-w-screen-sm mb-4 flex flex-col sm:flex-row justify-between items-center gap-2 bg-slate-50 p-2 rounded">
          <div>
            <label htmlFor="endpoint-selector" className="font-medium">
              Select endpoint
            </label>
            <p className="text-xs">Same result, different backend</p>
          </div>
          <select
            className="border border-slate-200 rounded p-1 text-sm text-sky-600"
            onChange={(e) => setExample(e.target.value)}
          >
            <option value="multer">/upload-with-multer</option>
            <option value="busboy">/upload-with-busboy</option>
          </select>
        </div>

        <div className="w-full max-w-screen-sm bg-slate-50 rounded p-4">
          <div className="flex flex-col justify-between gap-2">
            <h2 className="text-xl font-semibold">File uploader form</h2>
            <p className="mb-4">Basic uploads strategy</p>
          </div>
          <hr />

          <form
            onSubmit={handleSubmit(async (data) => {
              const form = new FormData();

              // FileList is an object, but really... it's an array.  See this - https://stackoverflow.com/questions/25333488/why-isnt-the-filelist-object-an-array
              Array.from(data.uploads).forEach((file) => {
                // Very important that every file has the same form field name (multer will read this on the backend)
                form.append("uploads", file);
              });

              // You can use fetch here too - I'm using axios purely out of habit, familiarity, and preference
              await axios.post(endpoint, form);

              // Invalidate S3 query
              mutate(queryKey);
              reset(); // reset form
            })}
            className="flex flex-col gap-4 max-w-full mt-4"
          >
            <input type="file" {...register("uploads")} multiple />
            <button
              type="submit"
              className="px-2 py-1 bg-sky-500 hover:bg-sky-400 rounded text-white"
            >
              Upload
            </button>
          </form>
        </div>

        <S3List queryKey={queryKey} />
      </main>
    </>
  );
}
