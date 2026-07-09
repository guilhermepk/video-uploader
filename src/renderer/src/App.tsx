import { HashRouter, Routes, Route } from 'react-router-dom';
import { routes } from './common/routes';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import { UpdateVideosFlowProvider } from './contexts/UpdateVideosFlowContext';
import NotFoundPage from './pages/NotFoundPage';

export default function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AuthProvider />}>
          <Route path={routes.loginPage.path} element={<routes.loginPage.element />} />

          <Route element={<MainLayout />}>
            <Route path='*' element={<NotFoundPage />} />

            <Route path={routes.homePage.path} element={<routes.homePage.element />} />
            <Route path={routes.fullFlowPage.path} element={<routes.fullFlowPage.element />} />

            <Route element={<UpdateVideosFlowProvider />}>
              <Route path={routes.updateVideosFlowPage.path} element={<routes.updateVideosFlowPage.element />} />
            </Route>

            <Route path={routes.copyPlaylistItemsPage.path} element={<routes.copyPlaylistItemsPage.element />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  )
}