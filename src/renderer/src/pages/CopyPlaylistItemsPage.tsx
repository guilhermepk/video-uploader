import { routes } from "@renderer/common/routes";
import Button from "@renderer/components/Button";
import Page from "@renderer/components/Page";
import Select from "@renderer/components/Select";
import { youtube_v3 } from "googleapis";
import { ChevronsDown, CopyPlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CopyPlaylistItemsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Array<youtube_v3.Schema$Playlist>>([]);
  const [originPlaylist, setOriginPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [destinationPlaylist, setDestinationPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function copyPlaylistItems(): Promise<void> {
    if (!originPlaylist || !destinationPlaylist) {
      const emptyFields: string[] = [];
      if (!originPlaylist) emptyFields.push('A playlist de origem');
      if (!destinationPlaylist) emptyFields.push('A playlist de destino');
      toast(`Selecione: ${emptyFields.map(item => `"${item}"`).join('; ')}`);
      return
    }

    if (!originPlaylist.id || !destinationPlaylist.id) {
      const missingIds: string[] = [];
      if (!originPlaylist.id) missingIds.push('Playlist de origem');
      if (!destinationPlaylist.id) missingIds.push('Playlist de destino');
      toast(`Não foi possível obter o ID de: ${missingIds.map(item => `"${item}"`).join('; ')}\n(É necessário correção no código fonte)`);
      return
    }

    let errorToastMessage: string = '';
    let successToastMessage: string = '';

    toast.promise(async () => {
      try {
        setLoading(true);

        const response = await window.api.uploadFlowsManager.copyPlaylistItems({
          originPlaylistId: originPlaylist.id ?? '',
          destinationPlaylistId: destinationPlaylist.id ?? '',
        });

        if (response.success) {
          const totalVideos: number = response.data.length;
          const totalSuccessfullVideos: number = response.data.reduce((previous, current) => previous += current.success ? 1 : 0, 0)
          const totalErrorVideos: number = response.data.reduce((previous, current) => previous += current.success ? 0 : 1, 0)
          let message: string = `Resultado de ${totalVideos} vídeo(s)`;
          if (totalSuccessfullVideos > 0) message += `\nBem-sucedidos: (${totalSuccessfullVideos}/${totalVideos})`
          if (totalErrorVideos > 0) message += `\nDeram errado: (${totalErrorVideos}/${totalVideos})`;
          successToastMessage = message;

          setOriginPlaylist(undefined);
          setDestinationPlaylist(undefined);
        } else {
          const { code, message, details } = response.error;
          throw new Error(`${code} | ${message}${details ? ` | ${details.join('; ')}` : ''}`);
        }
      } catch (error: any) {
        errorToastMessage = error.message ?? String(error);
        throw error;
      }
    }, {
      loading: (<p> Copiando itens... Pera aí! </p>),
      success: () => {
        setLoading(false);
        setFinished(true);

        return (
          <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
            <p> Sucesso! </p>
            <p> {successToastMessage} </p>
          </div>
        );
      },
      error: () => {
        setLoading(false);

        return (
          <div className="flex flex-col items-centes justify-center gap-2 text-center select-text">
            <p> Erro! </p>
            <p> {errorToastMessage} </p>
          </div>
        );
      }
    });
  }

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
      {!finished && (
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
            disabled={loading || finished}
          >
            <CopyPlus />
            Copiar itens da playlist
          </Button>
        </>
      )}

      {finished && (
        <>
          <p> Sucesso! </p>

          <Button
            onClick={() => navigate(routes.homePage.path)}
          >
            Voltar à página inicial
          </Button>
        </>
      )}
    </Page>
  );
}