import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";

export default function Home() {
  const [link, setLink] = useState("");
  const [format, setFormat] = useState("youtube-vid");
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState();
  const [quality, setQuality] = useState("360");

  const options = {
    method: "POST",
    url: "/api/download",
    data: {
      type: format,
      url: link,
    },
  };

  const startDownloading = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.request(options);
      setResponse(res.data.data);
      setDownloadLink(res.data.data.body.url);
      console.log(res);
      setLoading(false);
      toast.success("Download is ready!");
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error("An internal server error occured in the server!");
    }
  };

  return (
    <>
      <Head>
        <title>Youtube Video Downloader</title>
      </Head>
      <main className="bg-[#b8d4e1] flex items-center justify-center itmes-center h-screen w-screen">
        <div className="bg-white shadow-md rounded-md sm:w-[600px] sm:min-h-[235px] p-3 m-1 transition">
          <h1 className="prose prose-2xl font-bold text-center">
            Youtube Video Downloader
          </h1>

          <form onSubmit={(e) => startDownloading(e)}>
            {!response?.body && (
              <div className="flex flex-col mx-3 mt-3">
                <label className="text-base text-gray-500 mb-1 ml-1">
                  Video Link
                </label>

                <input
                  type="url"
                  required
                  className="rounded-lg border-gray-300 border-2 transition focus:ring-0 focus:border-blue-400"
                  onChange={(e) => setLink(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="flex flex-col mx-3 mt-3">
              <label className="text-base text-gray-500 mb-1 ml-1">
                {response?.body && "Select Video Quality"}
              </label>
              {response?.body && (
                <select
                  className="rounded-lg border-gray-300 border-2 transition focus:ring-0 focus:border-blue-400"
                  onChange={(e) => setQuality(e.target.value)}
                  disabled={loading}
                >
                  {downloadLink.map((element) => {
                    return (
                      <>
                        {(element.quality >= "144") &
                          (element.no_audio == false) &
                          (element.ext == "mp4") && (
                          <option value={element.quality} key={element.url}>
                            {element.quality}p
                          </option>
                        )}
                      </>
                    );
                  })}
                </select>
              )}
            </div>
            <div className="flex flex-col mx-3 mt-3">
              {response?.body?.thumb && (
                <>
                  <Image
                    src={response?.body?.thumb}
                    alt={response?.body?.meta?.title}
                    width={640}
                    height={360}
                    className="rounded-lg"
                  />
                  <p className="text-lg text-center pt-2">
                    {response?.body?.meta?.title}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col mx-3 mt-3">
              {!response?.body ? (
                <button
                  type="submit"
                  className="bg-blue-600 font-semibold text-xl h-10 text-white rounded"
                >
                  Start
                </button>
              ) : (
                <a
                  download
                  href={
                    downloadLink.find(
                      (element) =>
                        (element.quality == quality) &
                        !element.no_audio &
                        (element.ext == "mp4")
                    ).url
                  }
                  onClick={() => toast.success("Starting the download!")}
                  className="bg-blue-600 font-semibold text-xl pb-1 flex items-center justify-center h-10 text-white rounded"
                >
                  Download ({quality}p)
                </a>
              )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
