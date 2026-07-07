import UpdateVideosFlowPage from "@renderer/pages/update-videos-flow/UpdateVideosFlowPage";
import FullFlowPage from "@renderer/pages/FullFlowPage";
import HomePage from "@renderer/pages/home/HomePage";
import LoginPage from "@renderer/pages/LoginPage";
import CopyPlaylistPage from "@renderer/pages/CopyPlaylistPage";

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
  copyPlaylistPage: {
    name: 'Copiar playlist',
    path: '/copy-playlist',
    element: CopyPlaylistPage
  }
}