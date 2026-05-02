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

      // 갤러리는 즉시 렌더하고, 화면 폭에 맞는 변종을 우선 디코딩
      setPhotos(photoList);

      const buildSrcSet = (src: string) => {
        const m = src.match(/^(.*)\.(webp|jpg|jpeg|png)$/i);
        return m ? `${m[1]}-sm.${m[2]} 800w, ${m[1]}-md.${m[2]} 1200w, ${src} 1600w` : '';
      };
      const sizes = '(max-width: 768px) 100vw, 800px';

      const warm = (src: string) => {
        const img = new Image();
        img.decoding = 'async';
        const ss = buildSrcSet(src);
        // srcset/sizes를 함께 지정하면 브라우저가 화면에 맞는 변종(예: 모바일=‐sm)만 받아간다
        if (ss) {
          img.sizes = sizes;
          img.srcset = ss;
        }
        img.src = src;
      };

      photoList.slice(0, 2).forEach(warm);

      // 나머지는 idle 시간에 백그라운드 프리페치
      const idle: (cb: () => void) => void =
        (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
          .requestIdleCallback || ((cb: () => void) => window.setTimeout(cb, 1500));
      idle(() => {
        photoList.slice(2).forEach(warm);
      });
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