import { useEffect, useState, useRef, useMemo } from 'react';
import './App.css'
import { WEDDING_CONFIG } from './config';

// Kakao Maps API 타입 선언
interface KakaoLatLng {
  getLatitude(): number;
  getLongitude(): number;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  setLevel(level: number): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getPosition(): KakaoLatLng;
}

interface KakaoInfoWindow {
  open(map: KakaoMap, marker: KakaoMarker): void;
  close(): void;
}

declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
        Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
        InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
      };
    };
  }
}

// Mobile background image
import mobileBg from './assets/best/mobile_bg.jpg';

// Dynamically import all images from optimized folder using Vite's import.meta.glob
const imageModules = import.meta.glob('./assets/optimized/*.{png,jpg,jpeg,JPG,svg}', { eager: true });

// Convert to simple array of image URLs
const galleryImageUrls = Object.values(imageModules).map((module) => (module as { default: string }).default);

function App() {
  // Countdown Timer Logic
  const weddingDate = useMemo(() => 
    new Date(`${WEDDING_CONFIG.wedding.date}T${WEDDING_CONFIG.wedding.time}${WEDDING_CONFIG.wedding.timezone}`),
    []
  );
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = weddingDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(WEDDING_CONFIG.audio.autoPlay);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Guestbook state
  const [guestbookEntries, setGuestbookEntries] = useState<{ name: string; message: string; timestamp: string }[]>([]);
  // const [guestName, setGuestName] = useState('');
  // const [guestMessage, setGuestMessage] = useState('');

  // Load guestbook entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('wedding-guestbook');
    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries);
        setGuestbookEntries(parsedEntries);
      } catch (error) {
        console.error('Failed to parse guestbook entries:', error);
      }
    }
  }, []);

  // Save guestbook entries to localStorage whenever entries change
  useEffect(() => {
    if (guestbookEntries.length > 0) {
      localStorage.setItem('wedding-guestbook', JSON.stringify(guestbookEntries));
    }
  }, [guestbookEntries]);

  // Audio control functions
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Audio setup based on config
  useEffect(() => {
    if (audioRef.current) {
      // Set volume from config
      audioRef.current.volume = WEDDING_CONFIG.audio.volume;
      
      // Auto-play only if enabled in config
      if (WEDDING_CONFIG.audio.autoPlay && WEDDING_CONFIG.audio.enabled) {
        const playAudio = () => {
          if (audioRef.current) {
            audioRef.current.play().catch(console.error);
          }
        };

        // Try to play immediately
        playAudio();

        // If autoplay fails, play on first user interaction
        const handleFirstInteraction = () => {
          playAudio();
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };

        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('touchstart', handleFirstInteraction);

        return () => {
          document.removeEventListener('click', handleFirstInteraction);
          document.removeEventListener('touchstart', handleFirstInteraction);
        };
      }
    }
  }, []);

  // Anti-crawling protection
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+U, etc.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S')
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('keydown', handleKeyDown);

    // Disable drag and drop
    document.addEventListener('dragstart', (e) => e.preventDefault());

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', (e) => e.preventDefault());
    };
  }, []);

  // const handleGuestbookSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (guestName.trim() && guestMessage.trim()) {
  //     const newEntry = {
  //       name: guestName.trim(),
  //       message: guestMessage.trim(),
  //       timestamp: new Date().toISOString()
  //     };
  //     setGuestbookEntries([newEntry, ...guestbookEntries]);
  //     setGuestName('');
  //     setGuestMessage('');
  //   }
  // };



  // Gallery modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  
  // Contact modal state
  const [contactModalOpen, setContactModalOpen] = useState(false);
  
  // Use the dynamically loaded images
  const galleryImages = galleryImageUrls;

  // Kakao Map ref
  const mapRef = useRef<HTMLDivElement>(null);

  // Initialize Kakao Map
  useEffect(() => {
    if (mapRef.current && window.kakao && window.kakao.maps) {
      const mapContainer = mapRef.current;
      const mapOption = {
        center: new window.kakao.maps.LatLng(WEDDING_CONFIG.venue.coordinates.lat, WEDDING_CONFIG.venue.coordinates.lng),
        level: 3 // 지도의 확대 레벨
      };

      // 지도를 생성합니다
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 마커를 생성합니다
      const markerPosition = new window.kakao.maps.LatLng(WEDDING_CONFIG.venue.coordinates.lat, WEDDING_CONFIG.venue.coordinates.lng);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition
      });

      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map);

      // 인포윈도우로 장소에 대한 설명을 표시합니다
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0;">${WEDDING_CONFIG.venue.name}</div>`
      });
      infowindow.open(map, marker);
    }
  }, []);

  return (
    <div className="invitation-container min-h-screen text-gray-800 font-sans">
      {/* Mobile-First Hero Section */}
      <section 
        id="main-invitation" 
        className="relative min-h-screen flex flex-col items-center justify-center px-4 md:min-h-[80vh]"
        style={{
          backgroundImage: `url(${mobileBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Top Wave Background */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 150 100" preserveAspectRatio="none" shapeRendering="auto" style={{transform: 'rotate(180deg)', height: '200px'}}>
            <defs>
              <linearGradient id="topWaveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#AABBCC" stopOpacity="1"/>
                <stop offset="30%" stopColor="#AABBCC" stopOpacity="0.8"/>
                <stop offset="60%" stopColor="#AABBCC" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#AABBCC" stopOpacity="0"/>
              </linearGradient>
              <path id="gentle-wave-top" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v56h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave-top" x="48" y="0" fill="url(#topWaveGradient)" />
              <use xlinkHref="#gentle-wave-top" x="48" y="3" fill="url(#topWaveGradient)" opacity="0.7" />
              <use xlinkHref="#gentle-wave-top" x="48" y="5" fill="url(#topWaveGradient)" opacity="0.4" />
              <use xlinkHref="#gentle-wave-top" x="48" y="7" fill="url(#topWaveGradient)" opacity="0.2" />
            </g>
          </svg>
        </div>

        {/* Bottom Wave Background */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg className="waves-bottom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 150 100" preserveAspectRatio="none" shapeRendering="auto" style={{height: '200px'}}>
            <defs>
              <linearGradient id="bottomWaveGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#AABBCC" stopOpacity="1"/>
                <stop offset="30%" stopColor="#AABBCC" stopOpacity="0.8"/>
                <stop offset="60%" stopColor="#AABBCC" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#AABBCC" stopOpacity="0"/>
              </linearGradient>
              <path id="gentle-wave-bottom" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v56h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave-bottom" x="48" y="-10" fill="url(#bottomWaveGradient)" />
              <use xlinkHref="#gentle-wave-bottom" x="48" y="-7" fill="url(#bottomWaveGradient)" opacity="0.7" />
              <use xlinkHref="#gentle-wave-bottom" x="48" y="-3" fill="url(#bottomWaveGradient)" opacity="0.4" />
              <use xlinkHref="#gentle-wave-bottom" x="48" y="0" fill="url(#bottomWaveGradient)" opacity="0.2" />
            </g>
          </svg>
        </div>

        
        {/* Content in Wave Areas */}
        {/* Top Wave Text */}
        <div className="absolute top-8 left-0 right-0 z-20 text-center">
          <div className="text-lg text-white mb-2 tracking-wider font-bold">{WEDDING_CONFIG.wedding.shortDate}</div>
          <div className="text-sm text-white tracking-widest">{WEDDING_CONFIG.wedding.dayOfWeek.toUpperCase()}</div>
          </div>
          
        {/* Bottom Wave Text */}
        <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
          <h1 className="text-xl text-shadow-sm font-bold mb-4 text-white leading-relaxed">
            {WEDDING_CONFIG.groom.name} · {WEDDING_CONFIG.bride.name}
          </h1>
          
          <div className="text-sm text-white mb-2">{WEDDING_CONFIG.wedding.displayDate}</div>
          <div className="text-sm text-white">{WEDDING_CONFIG.venue.fullName}</div>
        </div>
        
        {/* Sound toggle button */}
        {WEDDING_CONFIG.audio.enabled && (
          <button 
            onClick={toggleAudio}
            className="fixed top-4 right-4 z-50 bg-white bg-opacity-90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-opacity-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
          {isPlaying ? (
            <svg 
              className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg 
              className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors duration-300" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
          </button>
        )}

        {/* Audio element */}
        {WEDDING_CONFIG.audio.enabled && (
          <audio
            ref={audioRef}
            loop
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={WEDDING_CONFIG.audio.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </section>

      {/* Invitation Wave + Content Container - Full Screen Height */}
      <div className="h-screen flex flex-col" style={{backgroundColor: '#E8F4F8'}}>
        {/* Invitation Wave - Transition */}
        <div className="relative flex-shrink-0">
          <svg className="waves-invitation" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 150 100" preserveAspectRatio="none" shapeRendering="auto" style={{height: '200px'}}>
            <defs>
              <linearGradient id="invitationWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#AABBCC" stopOpacity="0.3"/>
                <stop offset="30%" stopColor="#9AC5D8" stopOpacity="0.6"/>
                <stop offset="60%" stopColor="#AABBCC" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#AABBCC" stopOpacity="1"/>
              </linearGradient>
              <path id="gentle-wave-invitation" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v56h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave-invitation" x="48" y="0" fill="url(#invitationWaveGradient)" />
              <use xlinkHref="#gentle-wave-invitation" x="48" y="3" fill="url(#invitationWaveGradient)" opacity="0.8" />
              <use xlinkHref="#gentle-wave-invitation" x="48" y="5" fill="url(#invitationWaveGradient)" opacity="0.6" />
              <use xlinkHref="#gentle-wave-invitation" x="48" y="7" fill="url(#invitationWaveGradient)" opacity="0.4" />
            </g>
          </svg>
        </div>

        {/* Invitation Section */}
        <section id="invitation" className="max-w-2xl mx-auto px-6 pb-32 text-center relative z-30 flex-1 flex flex-col justify-center" >
          <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">INVITATION</h2>
          <h3 className="text-2xl font-light mb-8 text-blue-400 leading-relaxed">소중한 분들을 초대합니다</h3>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-sm">우리가 사랑함은 <br/> 그가 먼저 우리를 사랑하셨음이라</p>
            
            
            <p className="text-sm">- 요한일서 4:19 -</p> 
            
            <div className="my-8">
              <div className="w-16 h-px bg-gray-300 mx-auto"></div>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm">하나님의 은혜로 두 사람이 만나</p>
              <p className="text-sm">이제 믿음과 사랑으로 </p>
              <p className="text-sm"> 한 가정을 이루게 되었습니다.</p>
              <p className="text-sm">이 기쁜 자리에 부디 함께 하셔서 </p>
              <p className="text-sm"> 축복해 주시기를 바랍니다.</p>
            </div>
            
            <div className="my-8">
              <div className="w-16 h-px bg-gray-300 mx-auto"></div>
            </div>
            
            <div className="mt-12 space-y-2 text-gray-700">
              <p>{WEDDING_CONFIG.groom.father.name} · {WEDDING_CONFIG.groom.mother.name}의 장남 {WEDDING_CONFIG.groom.name}</p>
              <p>{WEDDING_CONFIG.bride.father.name} · {WEDDING_CONFIG.bride.mother.name}의 장녀 {WEDDING_CONFIG.bride.name}</p>
            </div>
            
            <button 
              onClick={() => setContactModalOpen(true)}
              className="mt-8 mb-16 bg-white text-gray-600 px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"
            >
              연락하기
            </button>
          </div>
        </section>
      </div>

      {/* Content Sections Container */}
      <div style={{backgroundColor: '#E8F4F8', minHeight: '100vh'}}>

      {/* Interview/Story Section */}
        {/* <section id="interview" className="max-w-2xl mx-auto py-16 px-6 text-center">
          <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">INTERVIEW</h2>
          <h3 className="text-2xl font-light mb-8 text-gray-700">두 사람의 이야기</h3>
          
          <div className="text-gray-600 leading-relaxed">
            <p>결혼을 앞두고 저희 두 사람의<br/>인터뷰를 준비했습니다.</p>
            
            <div className="grid grid-cols-2 gap-4 my-12">
              <div className="bg-gray-200 aspect-square flex items-center justify-center text-gray-500">
                신랑 사진
              </div>
              <div className="bg-gray-200 aspect-square flex items-center justify-center text-gray-500">
                신부 사진
              </div>
            </div>
            
            <button className="bg-white text-gray-600 px-8 py-3 shadow-sm rounded-full  hover:shadow-md transition-shadow">
              📧 신랑 & 신부의 인터뷰 읽어보기
            </button>
          </div>
      </section> */}

      {/* Gallery Section */}
        <section id="gallery" className="max-w-2xl md:max-w-3xl mx-auto py-16 px-6 text-center">
          <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">GALLERY</h2>
          <h3 className="text-2xl font-light mb-12 text-blue-400">우리의 순간</h3>
          
          <div className="columns-2 gap-1 space-y-1">
          {(showAllImages ? galleryImages : galleryImages.slice(0, 6)).map((src, idx) => (
            <button
              key={idx}
              type="button"
              className="w-full block focus:outline-none"
              onClick={() => { setModalImg(src); setModalOpen(true); }}
            >
              <img
                src={src}
                alt={`Gallery ${idx + 1}`}
                className="w-full mb-1 shadow-md hover:scale-105 transition-transform duration-200"
                loading="lazy"
              />
            </button>
          ))}
        </div>
        
        {!showAllImages && galleryImages.length > 6 && (
          <div className="mt-8">
            <button
              onClick={() => setShowAllImages(true)}
              className="bg-white text-gray-600 px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"
            >
              더보기 ({galleryImages.length - 6}장 더)
            </button>
          </div>
        )}
        
        {showAllImages && (
          <div className="mt-8">
            <button
              onClick={() => setShowAllImages(false)}
              className="bg-white text-gray-600 px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"
            >
              접기
            </button>
          </div>
        )}
        {modalOpen && modalImg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative max-w-4xl w-full mx-4">
              {/* 닫기 버튼 */}
              <button
                className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center text-white hover:text-gray-300 transition-colors z-10"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* 이미지 */}
              <img
                src={modalImg}
                alt="Gallery large view"
                className="w-full max-h-[90vh] object-contain"
              />
              
              {/* 배경 클릭으로 닫기 */}
              <div 
                className="absolute inset-0 -z-10"
                onClick={() => setModalOpen(false)}
              ></div>
            </div>
            
            {/* 전체 배경 클릭으로 닫기 */}
            <div 
              className="absolute inset-0 -z-20"
              onClick={() => setModalOpen(false)}
            ></div>
          </div>
        )}

        {/* Contact Modal */}
        {contactModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl">
              {/* 닫기 버튼 */}
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setContactModalOpen(false)}
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {/* 제목 */}
              <h3 className="text-xl font-medium text-gray-800 mb-6 text-center">연락하기</h3>
              
              {/* 연락처 정보 */}
              <div className="space-y-3">
                {/* 신랑 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold text-gray-800 flex-shrink-0">신랑 {WEDDING_CONFIG.groom.name}</span>
                  <a 
                    href={`tel:${WEDDING_CONFIG.groom.phone}`}
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors min-w-[140px] text-center"
                  >
                    {WEDDING_CONFIG.groom.phone}
                  </a>
                </div>
                
                {/* 신부 */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="text-lg font-semibold text-gray-800 flex-shrink-0">신부 {WEDDING_CONFIG.bride.name}</span>
                  <a 
                    href={`tel:${WEDDING_CONFIG.bride.phone}`}
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors min-w-[140px] text-center"
                  >
                    {WEDDING_CONFIG.bride.phone}
                  </a>
                </div>
              </div>
              
              {/* 안내 메시지 */}
              <p className="text-center text-sm text-gray-500 mt-6">
                전화번호를 클릭하시면 바로 연결됩니다.
              </p>
            </div>
            
            {/* 배경 클릭으로 닫기 */}
            <div 
              className="absolute inset-0 -z-10"
              onClick={() => setContactModalOpen(false)}
            ></div>
          </div>
        )}
      </section>


      {/* Countdown Timer Section */}
        <section id="countdown" className="max-w-2xl mx-auto py-16 px-6 text-center">
          {/* Date Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-light mb-2 text-gray-700">{WEDDING_CONFIG.wedding.shortDate}</h2>
            <p className="text-lg text-blue-400">{WEDDING_CONFIG.wedding.displayDate.split(' ').slice(3).join(' ')}</p>
          </div>

          {/* Calendar */}
          <div className="bg-white p-6 shadow-sm mb-8 max-w-sm mx-auto">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              <div className="text-blue-400 text-sm font-medium">일</div>
              <div className="text-gray-600 text-sm font-medium">월</div>
              <div className="text-gray-600 text-sm font-medium">화</div>
              <div className="text-gray-600 text-sm font-medium">수</div>
              <div className="text-gray-600 text-sm font-medium">목</div>
              <div className="text-gray-600 text-sm font-medium">금</div>
              <div className="text-gray-600 text-sm font-medium">토</div>
            </div>
            
            {/* Calendar Body - November 2025 */}
            <div className="grid grid-cols-7 gap-2">
              {/* Week 1 */}
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div className="py-2 text-gray-700">1</div>
              
              {/* Week 2 */}
              <div className="py-2 text-blue-400">2</div>
              <div className="py-2 text-gray-700">3</div>
              <div className="py-2 text-gray-700">4</div>
              <div className="py-2 text-gray-700">5</div>
              <div className="py-2 text-gray-700">6</div>
              <div className="py-2 text-gray-700">7</div>
              <div className="py-2 text-gray-700">8</div>
              
              {/* Week 3 */}
              <div className="py-2 text-blue-400">9</div>
              <div className="py-2 text-gray-700">10</div>
              <div className="py-2 text-gray-700">11</div>
              <div className="py-2 text-gray-700">12</div>
              <div className="py-2 text-gray-700">13</div>
              <div className="py-2 text-gray-700">14</div>
              <div className="py-2 text-gray-700">15</div>
              
              {/* Week 4 */}
              <div className="py-2 text-blue-400">16</div>
              <div className="py-2 text-gray-700">17</div>
              <div className="py-2 text-gray-700">18</div>
              <div className="py-2 text-gray-700">19</div>
              <div className="py-2 text-gray-700">20</div>
              <div className="py-2 text-gray-700">21</div>
              <div className="py-2 text-gray-700">22</div>
              
              {/* Week 5 */}
              <div className="py-2 text-blue-400">23</div>
              <div className="py-2 text-gray-700">24</div>
              <div className="py-2 text-gray-700">25</div>
              <div className="py-2 text-gray-700">26</div>
              <div className="py-2 text-gray-700">27</div>
              <div className="py-2 text-gray-700">28</div>
              <div className="py-2 text-gray-700">29</div>
              
              {/* Week 6 */}
              <div className="py-2 bg-blue-400 text-white w-10 h-10 flex items-center justify-center mx-auto">30</div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-6">
            <div className="flex justify-center items-end gap-6 mb-2">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">DAYS</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">HOUR</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">MIN</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">SEC</div>
              </div>
            </div>
            
            <div className="text-4xl font-light text-gray-700 tracking-wider">
              {String(timeLeft.days).padStart(2, '0')} : {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
            </div>
        </div>

          {/* Message */}
          <p className="text-gray-600">
            {WEDDING_CONFIG.groom.name}, {WEDDING_CONFIG.bride.name}의 결혼식이 <span className="text-blue-400 font-medium">{timeLeft.days}</span>일 남았습니다.
          </p>
      </section>

      {/* Location/Map Section */}
        <section id="location" className="max-w-2xl mx-auto py-16 px-6 text-center">
          <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">LOCATION</h2>
          <h3 className="text-2xl font-light mb-8 text-blue-400">오시는 길</h3>
          
                      <div className="text-gray-600 mb-6 leading-relaxed">
              <p className="font-medium text-gray-700 mb-2">{WEDDING_CONFIG.venue.fullName}</p>
              <p className="text-sm">{WEDDING_CONFIG.venue.address}</p>
            </div>
          
          {/* 카카오맵 */}
        <div className="mb-4">
            <div 
              ref={mapRef}
              id="map"
              className="w-full h-64 border bg-gray-100"
            ></div>
        </div>
          
          <div className="flex gap-2 justify-center">
            <a
              href={WEDDING_CONFIG.venue.kakaoMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-200 text-yellow-800 text-sm px-4 py-2 font-semibold hover:bg-yellow-300 transition-colors rounded-lg"
            >
              카카오맵 열기
            </a>
        <a
          href={WEDDING_CONFIG.venue.naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
              className="inline-block bg-green-200 text-green-800 text-sm px-4 py-2 font-semibold hover:bg-green-300 transition-colors rounded-lg"
        >
          네이버지도 열기
        </a>
          </div>
      </section>

      {/* Guestbook Section */}
      {/* <section id="guestbook" className="max-w-2xl mx-auto py-16 px-6 text-center">
        <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">GUESTBOOK</h2>
        <h3 className="text-2xl font-light mb-12 text-blue-400">게스트북</h3>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
          <form onSubmit={handleGuestbookSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="이름을 입력해주세요"
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              required
            />
            <textarea
              placeholder="축하 메시지를 남겨주세요!"
              value={guestMessage}
              onChange={e => setGuestMessage(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none"
              rows={4}
              required
            />
            <button
              type="submit"
              className="bg-white text-gray-600 px-8 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300"
            >
              방명록 남기기
            </button>
          </form>
        </div>
        
        <div className="space-y-4">
          {guestbookEntries.length === 0 && (
            <div className="text-gray-500 text-center py-8">
              <p>첫 번째 축하 메시지를 남겨주세요! 💝</p>
            </div>
          )}
          {guestbookEntries.map((entry, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-left">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-medium">{entry.name.charAt(0)}</span>
                  </div>
                  <div className="font-medium text-gray-800">{entry.name}</div>
                </div>
                {entry.timestamp && (
                  <div className="text-xs text-gray-400">
                    {new Date(entry.timestamp).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line pl-11">{entry.message}</div>
            </div>
          ))}
        </div>
      </section> */}

      {/* Account Info Section */}
      <section id="account" className="max-w-2xl mx-auto pt-16 pb-1 px-6 text-center">
        <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">ACCOUNT</h2>
        <h3 className="text-2xl font-light mb-12 text-blue-400">마음 전하실 곳</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Groom Side */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-medium text-blue-600 mb-6">신랑측</h4>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center py-1 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.groom.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.groom.account.bank} <span className="font-mono">{WEDDING_CONFIG.groom.account.number}</span></span>
              </div>
              
              <div className="flex items-center py-1 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.groom.father.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.groom.father.account.bank} <span className="font-mono">{WEDDING_CONFIG.groom.father.account.number}</span></span>
              </div>
              
              <div className="flex items-center py-1">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.groom.mother.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.groom.mother.account.bank} <span className="font-mono">{WEDDING_CONFIG.groom.mother.account.number}</span></span>
              </div>
            </div>
          </div>
          
          {/* Bride Side */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h4 className="text-lg font-medium text-blue-600 mb-6">신부측</h4>
            
            <div className="space-y-3 text-left">
              <div className="flex items-center py-1 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.bride.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.bride.account.bank} <span className="font-mono">{WEDDING_CONFIG.bride.account.number}</span></span>
              </div>
              
              <div className="flex items-center py-1 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.bride.father.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.bride.father.account.bank} <span className="font-mono">{WEDDING_CONFIG.bride.father.account.number}</span></span>
              </div>
              
              <div className="flex items-center py-1">
                <span className="text-sm font-medium text-gray-700 w-20">{WEDDING_CONFIG.bride.mother.name}</span>
                <span className="text-xs text-gray-600 text-left">{WEDDING_CONFIG.bride.mother.account.bank} <span className="font-mono">{WEDDING_CONFIG.bride.mother.account.number}</span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            축하의 마음을 담아 보내주시는<br/>
            소중한 마음 감사히 받겠습니다.
          </p>
        </div>
              </section>
        
        </div>
        
      {/* Bottom Wave Section - Inverted */}
      <div className="relative" style={{backgroundColor: '#E8F4F8'}}>
        <svg className="waves-bottom" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 150 100" preserveAspectRatio="none" shapeRendering="auto" style={{height: '200px'}}>
          <defs>
            <linearGradient id="bottomWaveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E8F4F8" stopOpacity="1"/>
              <stop offset="30%" stopColor="#B8D4E3" stopOpacity="0.9"/>
              <stop offset="60%" stopColor="#9AC5D8" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#AABBCC" stopOpacity="1"/>
            </linearGradient>
            <path id="gentle-wave-bottom" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v56h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave-bottom" x="48" y="0" fill="url(#bottomWaveGradient)" />
            <use xlinkHref="#gentle-wave-bottom" x="48" y="3" fill="url(#bottomWaveGradient)" opacity="0.8" />
            <use xlinkHref="#gentle-wave-bottom" x="48" y="5" fill="url(#bottomWaveGradient)" opacity="0.6" />
            <use xlinkHref="#gentle-wave-bottom" x="48" y="7" fill="url(#bottomWaveGradient)" opacity="0.4" />
          </g>
        </svg>
      </div>
      
      </div>
    );
}

export default App;
