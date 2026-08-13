import Button from "@renderer/components/Button";
import Select from "@renderer/components/Select";
import { youtube_v3 } from "googleapis";
import { ChevronsDown, CopyPlus } from "lucide-react";

interface SelectPlaylistsSectionProps {
  originPlaylist: youtube_v3.Schema$Playlist | undefined,
  destinationPlaylist: youtube_v3.Schema$Playlist | undefined,
  playlists: Array<youtube_v3.Schema$Playlist>,
  setOriginPlaylist: (value: React.SetStateAction<youtube_v3.Schema$Playlist | undefined>) => void,
  setDestinationPlaylist: (value: React.SetStateAction<youtube_v3.Schema$Playlist | undefined>) => void,
  copyPlaylistItems(): Promise<void>,
}


export default function SelectPlaylistsSection({
  originPlaylist,
  playlists,
  destinationPlaylist,
  setOriginPlaylist,
  setDestinationPlaylist,
  copyPlaylistItems,
}: SelectPlaylistsSectionProps) {
  return (
    <>
      <p> Selecione a playlist de origem e a de destino </p>

      <div className="flex flex-col items-center justify-center gap-4">
        <Select
          label="Playlist de origem"
          defaultText="Escolha uma playlist"
          value={originPlaylist ? { label: originPlaylist?.snippet?.title ?? 'Nome indefinido', value: originPlaylist.id ?? '' } : undefined}
          options={playlists.filter(item => item.id != destinationPlaylist?.id).map(item => ({ label: item.snippet?.title ?? 'Nome indefinido', value: item.id ?? '' }))}
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
          options={playlists.filter(item => item.id != originPlaylist?.id).map(item => ({ label: item.snippet?.title ?? 'Nome indefinido', value: item.id ?? '' }))}
          onChange={(newValue) => {
            const playlist = playlists.find(item => item.id === newValue.value);
            setDestinationPlaylist(playlist);
          }}
        />
      </div>

      <Button
        onClick={() => copyPlaylistItems()}
      >
        <CopyPlus />
        Copiar itens da playlist
      </Button>
    </>
  );
}