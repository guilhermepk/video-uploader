import { routes } from "@renderer/common/routes";
import Button from "@renderer/components/Button";
import Page from "@renderer/components/Page";
import Select from "@renderer/components/Select";
import Table from "@renderer/components/Table";
import { ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";
import { youtube_v3 } from "googleapis";
import { ChevronsDown, CopyPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlaylists } from "./utils/get-playlists.util";
import { createLoadingToast } from "./utils/create-loading-toast.util";
import { validateFields } from "./utils/validate-fields.util";
import { copyPlaylistItemsCallback } from "./utils/copy-playlist-items-callback.util";


export default function CopyPlaylistItemsPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Array<youtube_v3.Schema$Playlist>>([]);
  const [originPlaylist, setOriginPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [destinationPlaylist, setDestinationPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [finished, setFinished] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [failedVideos, setFailedVideos] = useState<Array<ResultItemInCopyPlaylistItemsResponse>>([]);


  async function copyPlaylistItems(): Promise<void> {
    const validateFieldsResponse = validateFields(originPlaylist, destinationPlaylist);

    if (!validateFieldsResponse) return;

    const { originPlaylistId, destinationPlaylistId } = validateFieldsResponse;

    createLoadingToast({
      setLoading,
      setFinished,
      callback: (setToastSuccessMessage) => copyPlaylistItemsCallback({
        originPlaylistId,
        destinationPlaylistId,
        setFailedVideos,
        setOriginPlaylist,
        setDestinationPlaylist,
        setToastSuccessMessage
      })
    });
  }


  useEffect(() => {
    getPlaylists(setPlaylists);
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
          {failedVideos.length == 0 && (
            <p> Sucesso! </p>
          )}

          {failedVideos.length != 0 && (
            <div>
              <p className="text-center"> {failedVideos.length} vídeos falharam ao serem copiados... </p>

              <Table
                headers={['URL', 'Erro']}
                rows={failedVideos.map(item => {
                  return [
                    { value: <p>{`https://www.youtube.com/watch?v=${item.videoId}`}</p> },
                    { value: <p>{item.error ?? 'Indefinido'}</p> }
                  ]
                })}
              />
            </div>
          )}

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