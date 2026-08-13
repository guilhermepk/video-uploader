import Page from "@renderer/components/Page";
import { ResultItemInCopyPlaylistItemsResponse } from "@shared/models/responses/upload-flows-manager/copy-playlist-items-response";
import { youtube_v3 } from "googleapis";
import { useEffect, useState } from "react";
import { getPlaylists } from "./utils/get-playlists.util";
import { createLoadingToast } from "./utils/create-loading-toast.util";
import { validateFields } from "./utils/validate-fields.util";
import { copyPlaylistItemsCallback } from "./utils/copy-playlist-items-callback.util";
import SelectPlaylistsSection from "./components/SelectPlaylistsSection";
import TableSection from "./components/TableSection";
import { SubscriptionResponse } from "@shared/models/responses/subscription.response";


export default function CopyPlaylistItemsPage(): React.JSX.Element {
  const [playlists, setPlaylists] = useState<Array<youtube_v3.Schema$Playlist>>([]);
  const [originPlaylist, setOriginPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [destinationPlaylist, setDestinationPlaylist] = useState<youtube_v3.Schema$Playlist | undefined>(undefined);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [results, setResults] = useState<Array<ResultItemInCopyPlaylistItemsResponse>>([]);


  async function copyPlaylistItems(): Promise<void> {
    const validateFieldsResponse = validateFields(originPlaylist, destinationPlaylist);

    if (!validateFieldsResponse) return;

    const { originPlaylistId, destinationPlaylistId } = validateFieldsResponse;

    createLoadingToast({
      setStarted: () => setStarted(true),
      setFinished: () => setFinished(true),
      callback: (setToastSuccessMessage) => copyPlaylistItemsCallback({
        originPlaylistId,
        destinationPlaylistId,
        setResults,
        setOriginPlaylist,
        setDestinationPlaylist,
        setToastSuccessMessage
      })
    });
  }


  function registerCallbackForProgress(): SubscriptionResponse {
    return window.api.uploadFlowsManager.copyPlaylistItems.onResult(
      (payload: ResultItemInCopyPlaylistItemsResponse) => {
        if (!finished) {
          setResults(prev => [...prev, payload]);
        }
      }
    );
  }


  useEffect(() => {
    getPlaylists(setPlaylists);
  }, []);


  useEffect(() => {
    const subscription: SubscriptionResponse = registerCallbackForProgress();
    return () => subscription.removeListener();
  }, []);


  return (
    <Page>
      {!started && (
        <SelectPlaylistsSection
          copyPlaylistItems={copyPlaylistItems}
          destinationPlaylist={destinationPlaylist}
          originPlaylist={originPlaylist}
          playlists={playlists}
          setDestinationPlaylist={setDestinationPlaylist}
          setOriginPlaylist={setOriginPlaylist}
        />
      )}

      {started && (
        // <TableSection results={new Array(75).fill('a')} />
        <TableSection results={results} />
      )}
    </Page>
  );
}