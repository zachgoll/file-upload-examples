import axios from "axios";
import useSWR from "swr";

type Props = {
  // The S3 folder to fetch files from
  queryKey: string;
};

export default function S3List({ queryKey }: Props) {
  console.log(queryKey);
  const uploadsQuery = useSWR<{ url: string }[]>(queryKey, async () => {
    const response = await axios.get("/api/uploads", {
      params: { queryKey },
    });
    return response.data.uploads;
  });

  return (
    <div className="w-full max-w-screen-sm mt-4">
      <h2 className="text-xl font-semibold">Files uploaded to S3</h2>
      <p>Files uploaded to S3 under the {queryKey}/ folder:</p>
      {uploadsQuery.isLoading ? (
        <p>Loading...</p>
      ) : !uploadsQuery.data?.length ? (
        <p className="bg-slate-50 p-2 mt-4">
          Nothing uploaded to S3 under the{" "}
          <span className="font-bold">{queryKey}/</span> folder yet!
        </p>
      ) : (
        <ul className="mt-4 bg-slate-50 p-2">
          {uploadsQuery.data?.map((upload) => (
            <li key={upload.url} className="list-disc ml-4">
              <a href={upload.url} download className="underline text-sky-500">
                {upload.url}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
