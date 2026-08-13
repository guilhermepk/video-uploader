import UpdateVideosFlowPage from "@renderer/pages/update-videos-flow/UpdateVideosFlowPage";
import FullFlowPage from "@renderer/pages/FullFlowPage";
import HomePage from "@renderer/pages/home/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import CopyPlaylistItemsPage from "@renderer/pages/copy-playlist-items/CopyPlaylistItemsPage";


export const routes = {
  loginPage: {
    path: '/login',
    element: LoginPage
  },
  homePage: {
    path: '/',
    element: HomePage
  },
  fullFlowPage: {
    path: '/full-flow',
    element: FullFlowPage
  },
  updateVideosFlowPage: {
    name: 'Fluxo de atualização de vídeos',
    path: '/update-videos-flow',
    element: UpdateVideosFlowPage
  },
  copyPlaylistItemsPage: {
    name: 'Copiar itens da playlist',
    path: '/copy-playlist-items',
    element: CopyPlaylistItemsPage
  }
}