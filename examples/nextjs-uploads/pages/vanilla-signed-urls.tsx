import Head from "next/head";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import S3List from "../components/S3List";

type Fields = {
  uploads: FileList;
};

const queryKey = "vanilla-signed-urls";

export default function Basic() {
  const { mutate } = useSWRConfig();
  const { register, handleSubmit, reset } = useForm<Fields>();

  return (
    <>
      <Head>
        <title>Basic file uploads</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-4 flex flex-col items-center justify-center">
        <Nav />

        <div className="w-full max-w-screen-sm bg-slate-50 rounded p-4">
          <div className="flex flex-col justify-between gap-2">
            <h2 className="text-xl font-semibold">File uploader form</h2>
            <p className="mb-4">Vanilla signed urls</p>
          </div>
          <hr />

          <form
            onSubmit={handleSubmit(async (data) => {
              // Limiting this to 1 file to simplify the signed url process
              if (!data.uploads.length) {
                throw new Error("Must upload 1 file");
              }

              const file = data.uploads[0];

              const signedUrl = await axios.post("/api/sign-url", {
                mimetype: file.type,
                folder: queryKey,
              });

              // Use the pre-signed S3 url to now upload the file
              await axios.put(signedUrl.data.url, file);

              // Invalidate S3 query
              mutate(queryKey);
              reset(); // reset form
            })}
            className="flex flex-col gap-4 max-w-full mt-4"
          >
            <input type="file" {...register("uploads")} />
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
