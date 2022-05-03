import { YouTube } from "social-downloader-sdk";

export default async function handler(req, res) {
  const { type, url } = req.body;
  if (req.method === "POST") {
    if (type == "youtube-vid") {
      const response = await YouTube.getVideo(url);
      res.json({ data: response.data, success: true, error: null });
    } else {
      const response = await YouTube.getAudio(url);
      res.json({ data: response.data, success: true, error: null });
    }
  } else {
    res.status(400).json({
      error: "Make sure the right request is going to the server!",
      success: false,
      data: null,
    });
  }
}
