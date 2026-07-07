import { useEffect, useState } from "react";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { youtube_v3 } from "googleapis";
import Select from "@renderer/components/Select";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import toast from 'react-hot-toast';

export default function SelectPlaylistStep(): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();
  const [playlists, setPlaylists] = useState<Array<youtube_v3.Schema$Playlist>>([]);

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
    <UpdateVideoFlowStepTemplate>
      <p className="text-white">
        Faça o upload dos vídeos em uma playlist e informe aqui a playlist escolhida
      </p>

      <Select
        defaultText="Escolha uma playlist"
        label="Playlist"
        value={flowData.playlist ? { label: flowData.playlist.snippet?.title ?? 'Nome indefinido', value: flowData.playlist.id ?? '' } : undefined}
        options={playlists.map(item => ({ label: item.snippet?.title ?? '', value: item.id ?? '' }))}
        onChange={(newValue) => {
          const playlist = playlists.find(item => item.id === newValue.value);

          updateFlowData({ playlist });
        }}
      />
    </UpdateVideoFlowStepTemplate>
  );
}