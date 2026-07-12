import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import GalleryPage from './components/GalleryPage.tsx'
import { AudioProvider } from './AudioContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/gallery/studio" element={<GalleryPage folderName="studio" title="스튜디오 컷" />} />
          <Route path="/gallery/outing1" element={<GalleryPage folderName="outing1" title="어느 예쁜 날" />} />
          <Route path="/gallery/outing2" element={<GalleryPage folderName="outing2" title="푸릇푸릇 우리" />} />
          <Route path="/gallery/snapshot" element={<GalleryPage folderName="snapshot" title="다양한 스냅샷" />} />
          <Route path="/gallery/daily" element={<GalleryPage folderName="daily" title="우리의 일상" />} />
          <Route path="/gallery/fourcut" element={<GalleryPage folderName="fourcut" title="네컷 세누진" />} />
        </Routes>
      </BrowserRouter>
    </AudioProvider>
  </StrictMode>,
)
