import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
}

const buildSrcSet = (src: string): string | undefined => {
    const match = src.match(/^(.*)\.(webp|jpg|jpeg|png)$/i);
    if (!match) return undefined;
    const stem = match[1];
    const ext = match[2];
    return `${stem}-sm.${ext} 800w, ${stem}-md.${ext} 1200w, ${src} 1600w`;
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [dragOffsetPct, setDragOffsetPct] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const touchStartXRef = useRef<number | null>(null);
    const touchStartYRef = useRef<number | null>(null);
    const isHorizontalRef = useRef<boolean | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const minSwipeDistance = 50;

    const srcSets = useMemo(() => photos.map(buildSrcSet), [photos]);

    const resetHideTimer = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = setTimeout(() => setShowControls(false), 1000);
    };

    useEffect(() => {
        resetHideTimer();
        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (photos.length === 0) return;
        const prev = currentIndex === 0 ? photos.length - 1 : currentIndex - 1;
        const next = currentIndex === photos.length - 1 ? 0 : currentIndex + 1;
        [prev, next].forEach((i) => {
            const img = new Image();
            img.decoding = 'async';
            const ss = srcSets[i];
            if (ss) img.srcset = ss;
            img.src = photos[i];
        });
    }, [currentIndex, photos, srcSets]);

    const goToPrevious = () => {
        if (photos.length <= 1) return;
        setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
        resetHideTimer();
    };

    const goToNext = () => {
        if (photos.length <= 1) return;
        setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
        resetHideTimer();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        resetHideTimer();
        if (e.touches.length > 1) {
            touchStartXRef.current = null;
            touchStartYRef.current = null;
            isHorizontalRef.current = false;
            return;
        }
        touchStartXRef.current = e.touches[0].clientX;
        touchStartYRef.current = e.touches[0].clientY;
        isHorizontalRef.current = null;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartXRef.current === null || touchStartYRef.current === null) return;
        const dx = e.touches[0].clientX - touchStartXRef.current;
        const dy = e.touches[0].clientY - touchStartYRef.current;

        if (isHorizontalRef.current === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
            }
        }

        if (isHorizontalRef.current === true) {
            const width = viewerRef.current?.clientWidth || window.innerWidth;
            setDragOffsetPct((dx / width) * 100);
        }
    };

    const handleTouchEnd = () => {
        const dragged = dragOffsetPct;
        const wasHorizontal = isHorizontalRef.current === true;
        setDragOffsetPct(0);
        setIsDragging(false);
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        isHorizontalRef.current = null;

        if (!wasHorizontal) return;

        const width = viewerRef.current?.clientWidth || window.innerWidth;
        const distancePx = (dragged / 100) * width;
        if (distancePx < -minSwipeDistance) goToNext();
        else if (distancePx > minSwipeDistance) goToPrevious();
    };

    if (photos.length === 0) {
        return (
            <div className="photo-gallery">
                <h2>우리의 아름다운 순간</h2>
                <p className="photo-loading">이미지 로딩 중...</p>
            </div>
        );
    }

    const trackTransform = `translate3d(calc(${-currentIndex * 100}% + ${dragOffsetPct}%), 0, 0)`;

    return (
        <div className="photo-gallery">
            <h2>우리의 아름다운 순간</h2>
            <div
                ref={viewerRef}
                className="photo-viewer"
                onMouseMove={resetHideTimer}
                onClick={resetHideTimer}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={`photo-track ${isDragging ? 'dragging' : ''}`}
                    style={{ transform: trackTransform }}
                >
                    {photos.map((src, i) => {
                        const distance = Math.min(
                            Math.abs(i - currentIndex),
                            photos.length - Math.abs(i - currentIndex)
                        );
                        return (
                            <div className="photo-slide" key={src}>
                                <img
                                    className="photo-large"
                                    src={src}
                                    srcSet={srcSets[i]}
                                    sizes="(max-width: 768px) 100vw, 800px"
                                    alt={`웨딩 사진 ${i + 1}`}
                                    decoding="async"
                                    loading={distance <= 1 ? 'eager' : 'lazy'}
                                    draggable={false}
                                />
                            </div>
                        );
                    })}
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
