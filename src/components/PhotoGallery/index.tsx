import React, { useEffect, useRef, useState } from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [nextIndex, setNextIndex] = useState<number | null>(null);
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [showControls, setShowControls] = useState(true);

    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const minSwipeDistance = 50;

    const resetHideTimer = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 1000);
    };

    useEffect(() => {
        resetHideTimer();
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, []);

    const goToPrevious = () => {
        if (photos.length <= 1) return;
        const target = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        setDirection('right');
        setNextIndex(target);
        setTimeout(() => {
            setCurrentIndex(target);
            setNextIndex(null);
            setDirection(null);
        }, 400);
        resetHideTimer();
    };

    const goToNext = () => {
        if (photos.length <= 1) return;
        const target = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
        setDirection('left');
        setNextIndex(target);
        setTimeout(() => {
            setCurrentIndex(target);
            setNextIndex(null);
            setDirection(null);
        }, 400);
        resetHideTimer();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        resetHideTimer();
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > minSwipeDistance) goToNext();
        if (distance < -minSwipeDistance) goToPrevious();
    };

    if (photos.length === 0) {
        return (
            <div className="photo-gallery">
                <h2>우리의 아름다운 순간</h2>
                <p className="photo-loading">이미지 로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="photo-gallery">
            <h2>우리의 아름다운 순간</h2>
            <div
                className="photo-viewer"
                onMouseMove={resetHideTimer}
                onClick={resetHideTimer}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="photo-stage">
                    <img
                        className={`photo-large current ${direction ? `slide-${direction}` : ''}`}
                        src={photos[currentIndex]}
                        alt={`웨딩 사진 ${currentIndex + 1}`}
                    />
                    {nextIndex !== null && direction && (
                        <img
                            className={`photo-large next from-${direction === 'left' ? 'right' : 'left'}`}
                            src={photos[nextIndex]}
                            alt={`웨딩 사진 ${nextIndex + 1}`}
                        />
                    )}
                </div>

                {photos.length > 1 && (
                    <>
                        <button
                            className={`gallery-nav-btn gallery-nav-prev ${showControls ? 'visible' : 'hidden'}`}
                            onClick={goToPrevious}
                            aria-label="이전 사진"
                        >
                            ❮
                        </button>
                        <button
                            className={`gallery-nav-btn gallery-nav-next ${showControls ? 'visible' : 'hidden'}`}
                            onClick={goToNext}
                            aria-label="다음 사진"
                        >
                            ❯
                        </button>
                    </>
                )}
            </div>
            <div className="photo-index" aria-live="polite">
                {currentIndex + 1} / {photos.length}
            </div>
            {photos.length > 1 && (
                <div className="page-indicators">
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            className={`page-dot ${i === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(i)}
                            aria-label={`${i + 1}번 사진`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;