import Page from "@renderer/components/Page";
import Select from "@renderer/components/Select";
import { youtube_v3 } from "googleapis";
import { ChevronsDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CopyPlaylistPage(): React.JSX.Element {
  const [playlists, setPlaylists] = useState<Array<youtube_v3.Schema$Playlist>>([]);
  const [originPlaylist, setOriginPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [destinationPlaylist, setDestinationPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);

  async function getPlaylists(): Promise<void> {
    const response = await window.api.google.youtube.getPlaylists();

    if (response.success) {
      const { playlists } = response.data;
      setPlaylists(playlists);
    } else {
      const { code, message, details } = response.error;
      toast(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  useEffect(() => {
    getPlaylists();
  }, []);

  return (
    <Page>
      <p> Selecione a playlist de origem e a de destino </p>

      <div className="flex flex-col items-center justify-center gap-4">
        <Select
          label="Playlist de origem"
          defaultText="Escolha uma playlist"
          value={originPlaylist ? { label: originPlaylist?.snippet?.title ?? 'Nome indefinido', value: originPlaylist.id ?? '' } : undefined}
          options={playlists.map(item => ({ label: item.snippet?.title ?? 'Nome indefinido', value: item.id ?? '' }))}
          onChange={(newValue) => {
            const playlist = playlists.find(item => item.id === newValue.value);
            setOriginPlaylist(playlist);
          }}
        />

        <ChevronsDown size={50} />

        <Select
          label="Playlist de destino"
          defaultText="Escolha uma playlist"
          value={destinationPlaylist ? { label: destinationPlaylist?.snippet?.title ?? 'Nome indefinido', value: destinationPlaylist.id ?? '' } : undefined}
          options={playlists.map(item => ({ label: item.snippet?.title ?? 'Nome indefinido', value: item.id ?? '' }))}
          onChange={(newValue) => {
            const playlist = playlists.find(item => item.id === newValue.value);
            setDestinationPlaylist(playlist);
          }}
        />
      </div>
    </Page>
  );
}