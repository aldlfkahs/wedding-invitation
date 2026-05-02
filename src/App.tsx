import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InvitationMessage from './components/InvitationMessage';
import PhotoGallery from './components/PhotoGallery';
import Location from './components/Location';
import AccountInfo from './components/AccountInfo';
import BackgroundMusic from './components/BackgroundMusic';
import './styles/global.css';

const App: React.FC = () => {
  const [photos, setPhotos] = useState<string[]>([]);
  // 인트로 애니메이션 중 스크롤 잠금
  const [scrollLocked, setScrollLocked] = useState(true);

  // Load photos on mount
  useEffect(() => {
    const loadPhotos = async () => {
      const base = import.meta.env.BASE_URL;
      const photoList = await fetch(`${base}images/manifest.json`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : []))
        .then((files: string[]) =>
          files
            .filter((file) => !/^main\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map((file) => `${base}images/${file}`)
        )
        .catch(() => [] as string[]);

      // 갤러리 체감 속도를 위해 전부 선로딩 후 렌더링
      await Promise.all(
        photoList.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.decoding = 'async';
              img.src = src;
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

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

  return (
    <div className="app-frame">
      <div className={`snap-container${scrollLocked ? ' scroll-locked' : ''}`}>
        <BackgroundMusic />
        <section className="snap-section snap-header">
          <Header onAnimationDone={() => setScrollLocked(false)} />
        </section>

        <section className="snap-section">
          <InvitationMessage />
        </section>

        <section className="snap-section">
          <PhotoGallery photos={photos} />
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
      </div>
    </div>
  );
};

export default App;