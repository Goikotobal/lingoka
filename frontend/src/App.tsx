import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ChatPage, LessonsPage, ProgressPage, SettingsPage } from './pages';
import { UserProvider } from './contexts/UserContext';
import { ChatProvider } from './contexts/ChatContext';

export default function App() {
  return (
    <UserProvider>
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/chat" replace />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/lessons" element={<LessonsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </UserProvider>
  );
}
