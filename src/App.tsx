import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InvitationMessage from './components/InvitationMessage';
import PhotoGallery from './components/PhotoGallery';
import Location from './components/Location';
import AccountInfo from './components/AccountInfo';
import PhotoModal from './components/PhotoGallery/PhotoModal';
import BackgroundMusic from './components/BackgroundMusic';
import './styles/global.css';

const App: React.FC = () => {
  // Photo gallery modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [nextPhotoIndex, setNextPhotoIndex] = useState<number | null>(null);

  // Load photos on mount
  useEffect(() => {
    const loadPhotos = () => {
      const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,gif,webp}', { eager: true, as: 'url' });
      
      const photoList = Object.keys(imageModules)
        .map(path => {
          return path.replace('/public', import.meta.env.BASE_URL.replace(/\/$/, ''));
        })
        .sort((a, b) => {
          const numA = parseInt(a.match(/(\d+)\.\w+$/)?.[1] || '0');
          const numB = parseInt(b.match(/(\d+)\.\w+$/)?.[1] || '0');
          return numA - numB;
        });
      
      setPhotos(photoList);
    };
    
    loadPhotos();
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const container = document.querySelector('.snap-container');
    if (!container) return;

    const sections = document.querySelectorAll('.snap-section');

    // First section always visible immediately
    if (sections[0]) sections[0].classList.add('visible');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { root: container, threshold: 0.1 }
    );
    sections.forEach((section) => observer.observe(section));

    // Fallback: make all sections visible after 3s if observer fails
    const fallback = setTimeout(() => {
      sections.forEach((section) => section.classList.add('visible'));
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
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
    <div className="snap-container">
      <BackgroundMusic />
      <section className="snap-section snap-header">
        <Header />
      </section>

      <section className="snap-section">
        <InvitationMessage />
      </section>

      <section className="snap-section">
        <PhotoGallery
          photos={photos}
          openModal={openModal}
        />
      </section>

      <section className="snap-section">
        <Location mode="map" />
      </section>

      <section className="snap-section">
        <Location mode="directions" />
      </section>

      <section className="snap-section">
        <AccountInfo />
      </section>

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