import { youtube_v3 } from "googleapis";
import toast from "react-hot-toast";


export async function getPlaylists(
  setPlaylists: (value: React.SetStateAction<youtube_v3.Schema$Playlist[]>) => void
): Promise<void> {
  const response = await window.api.google.youtube.getPlaylists();

  if (response.success) {
    const { playlists } = response.data;
    setPlaylists(playlists);
  } else {
    const { code, message, details } = response.error;
    toast(`Erro: ${code} | ${message} | ${details}`);
  }
}