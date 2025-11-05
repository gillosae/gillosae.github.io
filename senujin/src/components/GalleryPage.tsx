import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../AudioContext';

interface GalleryPageProps {
  folderName: string;
  title: string;
}

const GalleryPage = ({ folderName, title }: GalleryPageProps) => {
  const navigate = useNavigate();
  const { isPlaying, toggleAudio } = useAudio();
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Loading state
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  // Touch/swipe state for gallery modal
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Natural sort function for numeric filenames
  const naturalSort = (a: string, b: string) => {
    const extractNumber = (str: string) => {
      const match = str.match(/(\d+)-(\d+)/);
      if (match) {
        return [parseInt(match[1]), parseInt(match[2])];
      }
      return [0, 0];
    };
    
    const [aFirst, aSecond] = extractNumber(a);
    const [bFirst, bSecond] = extractNumber(b);
    
    if (aFirst !== bFirst) {
      return aFirst - bFirst;
    }
    return aSecond - bSecond;
  };

  // Load images dynamically based on folder
  useEffect(() => {
    const loadImages = async () => {
      const imageModules = import.meta.glob<{ default: string }>('../assets/**/*.{png,jpg,jpeg,JPG,svg,mp4}', { eager: true });
      
      // Folders that need natural sorting
      const needsNaturalSort = ['best', 'outing1', 'outing2', 'studio'];
      
      const images = Object.entries(imageModules)
        .filter(([path]) => path.includes(`/${folderName}/`))
        .filter(([path]) => !path.endsWith('.mp4')) // Exclude videos
        .map(([path, module]) => ({ path, url: module.default }))
        .sort((a, b) => {
          if (needsNaturalSort.includes(folderName)) {
            return naturalSort(a.path, b.path);
          }
          return a.path.localeCompare(b.path);
        })
        .map(item => item.url);
      
      setGalleryImages(images);
      
      // Preload all images
      if (images.length > 0) {
        const imagePromises = images.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = reject;
          });
        });
        
        try {
          await Promise.all(imagePromises);
          setImagesLoaded(true);
        } catch (error) {
          console.error('Failed to load some images:', error);
          // Still show content even if some images fail
          setImagesLoaded(true);
        }
      } else {
        setImagesLoaded(true);
      }
    };
    loadImages();
  }, [folderName]);
  
  // Minimum loading time timer
  useEffect(() => {
    const minLoadingDuration = 1500; // 1.5초 (하트 애니메이션 1루프)
    const timer = setTimeout(() => {
      setMinLoadingTimePassed(true);
    }, minLoadingDuration);
    return () => clearTimeout(timer);
  }, []);
  
  // Show content when both loading conditions are met
  useEffect(() => {
    if (imagesLoaded && minLoadingTimePassed) {
      setShowContent(true);
    }
  }, [imagesLoaded, minLoadingTimePassed]);

  // Handle touch start
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  // Handle touch move
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  // Handle touch end
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentImageIndex < galleryImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setModalImg(galleryImages[newIndex]);
    }
    
    if (isRightSwipe && currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setModalImg(galleryImages[newIndex]);
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        const newIndex = currentImageIndex - 1;
        setCurrentImageIndex(newIndex);
        setModalImg(galleryImages[newIndex]);
      }
      
      if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) {
        const newIndex = currentImageIndex + 1;
        setCurrentImageIndex(newIndex);
        setModalImg(galleryImages[newIndex]);
      }
      
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
    };
    
    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDownEvent);
      return () => document.removeEventListener('keydown', handleKeyDownEvent);
    }
  }, [modalOpen, currentImageIndex, galleryImages]);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#E8F4F8'}}>
      {/* Loading indicator */}
      {!showContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <img 
              src={`${import.meta.env.BASE_URL}heart.gif`}
              alt="Loading" 
              className="w-8 h-8 animate-heartbeat"
            />
          </div>
        </div>
      )}

      {/* Header with back button and audio control */}
      <div className="fixed top-0 left-0 right-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:shadow-lg text-gray-600 hover:text-blue-400 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Sound toggle button */}
          <button 
            onClick={toggleAudio}
            className="bg-white bg-opacity-90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-opacity-100 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
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
        </div>
      </div>

      {/* Gallery Content */}
      <section 
        className="max-w-2xl md:max-w-3xl mx-auto pt-24 pb-16 px-6 text-center"
        style={{
          opacity: showContent ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <h2 className="text-sm font-light mb-4 text-blue-400 tracking-widest">GALLERY</h2>
        <h3 className="text-2xl font-light mb-12 text-blue-400">{title}</h3>
        
        {galleryImages.length === 0 ? (
          <div className="text-gray-500">이미지를 불러오는 중...</div>
        ) : (
          <div>
            {/* Studio and outing2 folders: First image full width */}
            {(folderName === 'studio' || folderName === 'outing2') && galleryImages.length > 0 && (
              <button
                type="button"
                className="w-full block focus:outline-none mb-2"
                onClick={() => { 
                  setModalImg(galleryImages[0]); 
                  setCurrentImageIndex(0);
                  setModalOpen(true); 
                }}
              >
                <img
                  src={galleryImages[0]}
                  alt="Gallery 1"
                  className="w-full shadow-md hover:scale-105 transition-transform duration-200"
                  loading="lazy"
                />
              </button>
            )}
            
            {/* Rest of images - use masonry for fourcut, outing2, daily, and snapshot, grid for others */}
            <div className={folderName === 'fourcut' || folderName === 'outing2' || folderName === 'daily' || folderName === 'snapshot' ? 'columns-2 gap-2' : 'grid grid-cols-2 gap-2'}>
              {galleryImages.slice((folderName === 'studio' || folderName === 'outing2') ? 1 : 0).map((src, idx) => {
                const actualIdx = (folderName === 'studio' || folderName === 'outing2') ? idx + 1 : idx;
                return (
                  <button
                    key={actualIdx}
                    type="button"
                    className={`w-full block focus:outline-none ${folderName === 'fourcut' || folderName === 'outing2' || folderName === 'daily' || folderName === 'snapshot' ? 'mb-2 break-inside-avoid' : ''}`}
                    onClick={() => { 
                      setModalImg(src); 
                      setCurrentImageIndex(actualIdx);
                      setModalOpen(true); 
                    }}
                  >
                    <img
                      src={src}
                      alt={`Gallery ${actualIdx + 1}`}
                      className="w-full shadow-md hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal */}
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
              
              {/* 이전 버튼 */}
              {currentImageIndex > 0 && (
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentImageIndex - 1;
                    setCurrentImageIndex(newIndex);
                    setModalImg(galleryImages[newIndex]);
                  }}
                  aria-label="Previous image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              
              {/* 다음 버튼 */}
              {currentImageIndex < galleryImages.length - 1 && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIndex = currentImageIndex + 1;
                    setCurrentImageIndex(newIndex);
                    setModalImg(galleryImages[newIndex]);
                  }}
                  aria-label="Next image"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              
              {/* 이미지 */}
              <img
                src={modalImg}
                alt="Gallery large view"
                className="w-full max-h-[90vh] object-contain"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              />
              
              {/* 이미지 인덱스 표시 */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {galleryImages.length}
              </div>
              
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
      </section>
    </div>
  );
};

export default GalleryPage;

