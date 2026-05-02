import React, { useEffect, useMemo, useRef, useState } from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
}

const buildSrcSet = (src: string): string | undefined => {
    const m = src.match(/^(.*)\.(webp|jpg|jpeg|png)$/i);
    if (!m) return undefined;
    return `${m[1]}-sm.${m[2]} 800w, ${m[1]}-md.${m[2]} 1200w, ${src} 1600w`;
};

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const N = photos.length;

    const [realIndex, setRealIndex] = useState(0);
    const [shiftPct, setShiftPct] = useState(0); // -100 (next 진행) | 0 | 100 (prev 진행)
    const [dragPct, setDragPct] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [withTransition, setWithTransition] = useState(true);
    const [showControls, setShowControls] = useState(true);

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const isHorizontal = useRef<boolean | null>(null);
    const animatingRef = useRef(false);
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

    // 인접 사진 미리 디코딩
    useEffect(() => {
        if (N === 0) return;
        const prev = (realIndex - 1 + N) % N;
        const next = (realIndex + 1) % N;
        [prev, next].forEach((i) => {
            const img = new Image();
            img.decoding = 'async';
            const ss = srcSets[i];
            if (ss) {
                img.sizes = '(max-width: 768px) 100vw, 800px';
                img.srcset = ss;
            }
            img.src = photos[i];
        });
    }, [realIndex, photos, srcSets, N]);

    // 스냅(transition: none) 후 다음 paint에 다시 transition 활성화
    useEffect(() => {
        if (!withTransition) {
            const id1 = requestAnimationFrame(() => {
                const id2 = requestAnimationFrame(() => setWithTransition(true));
                (id1 as unknown as { _next?: number })._next = id2;
            });
            return () => cancelAnimationFrame(id1);
        }
    }, [withTransition]);

    const goNext = () => {
        if (N <= 1 || animatingRef.current) return;
        animatingRef.current = true;
        setIsDragging(false);
        setDragPct(0);
        setWithTransition(true);
        setShiftPct(-100);
        resetHideTimer();
    };

    const goPrev = () => {
        if (N <= 1 || animatingRef.current) return;
        animatingRef.current = true;
        setIsDragging(false);
        setDragPct(0);
        setWithTransition(true);
        setShiftPct(100);
        resetHideTimer();
    };

    // 페이지 dot은 곧장 점프 (인접하지 않을 수도 있어 애니메이션 생략)
    const jumpTo = (i: number) => {
        if (i === realIndex || animatingRef.current) return;
        setWithTransition(false);
        setShiftPct(0);
        setDragPct(0);
        setRealIndex(i);
        resetHideTimer();
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== 'transform') return;

        if (shiftPct === -100) {
            setWithTransition(false);
            setRealIndex((r) => (r + 1) % N);
            setShiftPct(0);
        } else if (shiftPct === 100) {
            setWithTransition(false);
            setRealIndex((r) => (r - 1 + N) % N);
            setShiftPct(0);
        }
        animatingRef.current = false;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        resetHideTimer();
        if (animatingRef.current) return;
        if (e.touches.length > 1) return;
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isHorizontal.current = null;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = e.touches[0].clientY - touchStartY.current;
        if (isHorizontal.current === null) {
            if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
                isHorizontal.current = Math.abs(dx) > Math.abs(dy);
            }
        }
        if (isHorizontal.current === true) {
            const w = viewerRef.current?.clientWidth || window.innerWidth;
            setDragPct((dx / w) * 100);
        }
    };

    const handleTouchEnd = () => {
        const dragged = dragPct;
        const wasHorizontal = isHorizontal.current === true;
        touchStartX.current = null;
        touchStartY.current = null;
        isHorizontal.current = null;
        setIsDragging(false);

        if (!wasHorizontal) {
            setDragPct(0);
            return;
        }

        const w = viewerRef.current?.clientWidth || window.innerWidth;
        const distancePx = (dragged / 100) * w;

        setDragPct(0);
        setWithTransition(true);

        if (N > 1 && distancePx < -minSwipeDistance) {
            animatingRef.current = true;
            setShiftPct(-100);
        } else if (N > 1 && distancePx > minSwipeDistance) {
            animatingRef.current = true;
            setShiftPct(100);
        }
        // 임계 미달이면 shiftPct=0 유지 → drag offset이 0으로 부드럽게 복귀
        resetHideTimer();
    };

    if (N === 0) {
        return (
            <div className="photo-gallery">
                <h2>우리의 아름다운 순간</h2>
                <p className="photo-loading">이미지 로딩 중...</p>
            </div>
        );
    }

    const prevIdx = (realIndex - 1 + N) % N;
    const nextIdx = (realIndex + 1) % N;
    const slides: { idx: number; pos: number; key: string }[] = [
        { idx: prevIdx, pos: -100, key: `prev-${prevIdx}` },
        { idx: realIndex, pos: 0, key: `cur-${realIndex}` },
        { idx: nextIdx, pos: 100, key: `next-${nextIdx}` },
    ];

    const trackTransform = `translate3d(calc(${shiftPct}% + ${dragPct}%), 0, 0)`;
    const trackClass = `photo-track ${(!withTransition || isDragging) ? 'no-transition' : ''}`;

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
                    className={trackClass}
                    style={{ transform: trackTransform }}
                    onTransitionEnd={handleTransitionEnd}
                >
                    {slides.map(({ idx, pos, key }) => (
                        <div
                            className={`photo-slide ${pos === 0 ? 'is-current' : 'is-side'}`}
                            key={key}
                            style={pos === 0 ? undefined : { transform: `translate3d(${pos}%, 0, 0)` }}
                        >
                            <img
                                className="photo-large"
                                src={photos[idx]}
                                srcSet={srcSets[idx]}
                                sizes="(max-width: 768px) 100vw, 800px"
                                alt={`웨딩 사진 ${idx + 1}`}
                                decoding="async"
                                loading="eager"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>

                {N > 1 && (
                    <>
                        <button
                            className={`gallery-nav-btn gallery-nav-prev ${showControls ? 'visible' : 'hidden'}`}
                            onClick={goPrev}
                            aria-label="이전 사진"
                        >
                            ❮
                        </button>
                        <button
                            className={`gallery-nav-btn gallery-nav-next ${showControls ? 'visible' : 'hidden'}`}
                            onClick={goNext}
                            aria-label="다음 사진"
                        >
                            ❯
                        </button>
                    </>
                )}
            </div>
            <div className="photo-index" aria-live="polite">
                {realIndex + 1} / {N}
            </div>
            {N > 1 && (
                <div className="page-indicators">
                    {photos.map((_, i) => (
                        <button
                            key={i}
                            className={`page-dot ${i === realIndex ? 'active' : ''}`}
                            onClick={() => jumpTo(i)}
                            aria-label={`${i + 1}번 사진`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;
