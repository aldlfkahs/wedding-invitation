import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InvitationMessage from './components/InvitationMessage';
import PhotoGallery from './components/PhotoGallery';
import Location from './components/Location';
import AccountInfo from './components/AccountInfo';
import ShareButtons from './components/ShareButtons';
import PhotoModal from './components/PhotoGallery/PhotoModal';
import './styles/global.css';

const App: React.FC = () => {
  // Photo gallery modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [nextPhotoIndex, setNextPhotoIndex] = useState<number | null>(null);

  // Load photos on mount - images 폴더의 실제 이미지만 불러오기
  useEffect(() => {
    const loadPhotos = () => {
      // Vite의 import.meta.glob으로 public/images 폴더의 모든 이미지 파일 가져오기
      const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,gif,webp}', { eager: true, as: 'url' });
      
      // 파일 경로를 URL로 변환하고 정렬
      const photoList = Object.keys(imageModules)
        .map(path => {
          // '/public/images/1.jpg' -> '/images/1.jpg'
          return path.replace('/public', import.meta.env.BASE_URL.replace(/\/$/, ''));
        })
        .sort((a, b) => {
          // 파일명에서 숫자 추출하여 정렬
          const numA = parseInt(a.match(/(\d+)\.\w+$/)?.[1] || '0');
          const numB = parseInt(b.match(/(\d+)\.\w+$/)?.[1] || '0');
          return numA - numB;
        });
      
      setPhotos(photoList);
    };
    
    loadPhotos();
  }, []);

  const openModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setNextPhotoIndex(null);
  };
  const goToPreviousPhoto = () => {
    const prevIndex = currentPhotoIndex === 0 ? photos.length - 1 : currentPhotoIndex - 1;
    setNextPhotoIndex(prevIndex);
    setTimeout(() => {
      setCurrentPhotoIndex(prevIndex);
      setNextPhotoIndex(null);
    }, 400);
  };
  const goToNextPhoto = () => {
    const nextIndex = currentPhotoIndex === photos.length - 1 ? 0 : currentPhotoIndex + 1;
    setNextPhotoIndex(nextIndex);
    setTimeout(() => {
      setCurrentPhotoIndex(nextIndex);
      setNextPhotoIndex(null);
    }, 400);
  };

  return (
    <div>
      <Header />
      <InvitationMessage />
      <PhotoGallery
        photos={photos}
        openModal={openModal}
      />
      <Location />
      <AccountInfo />
      <ShareButtons />
      {isModalOpen && photos.length > 0 && (
        <PhotoModal
          photo={photos[currentPhotoIndex]}
          nextPhoto={nextPhotoIndex !== null ? photos[nextPhotoIndex] : null}
          onClose={closeModal}
          onPrevious={goToPreviousPhoto}
          onNext={goToNextPhoto}
        />
      )}
    </div>
  );
};

export default App;