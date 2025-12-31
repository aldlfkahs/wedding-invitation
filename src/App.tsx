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

  // Load photos on mount
  useEffect(() => {
    const loadPhotos = async () => {
      const photoList: string[] = [];
      for (let i = 1; i <= 100; i++) {
        const path = `${import.meta.env.BASE_URL}images/${i}.jpg`;
        try {
          const response = await fetch(path, { method: 'HEAD' });
          if (response.ok) {
            photoList.push(path);
          }
        } catch {
          if (photoList.length > 0 && i > photoList.length + 5) break;
        }
      }
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