import React, { useEffect, useRef, useState } from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
}

// manifest.json의 "1.webp" → 갤러리 썸네일 "1-sm.webp"
const toThumb = (src: string) => src.replace(/(\.\w+)$/, '-sm$1');

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
    const N = photos.length;
    const minZoom = 1;
    const maxZoom = 4;

    // 그리드 펼침 상태
    const [expanded, setExpanded] = useState(false);

    // 라이트박스: null이면 닫힘, 숫자면 해당 인덱스 열림
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // 라이트박스 슬라이드 상태
    const [shiftPct, setShiftPct] = useState(0);
    const [dragPct, setDragPct] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [withTransition, setWithTransition] = useState(true);

    const viewerRef = useRef<HTMLDivElement | null>(null);
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const isHorizontalRef = useRef<boolean | null>(null);
    const animatingRef = useRef(false);
    const panStartRef = useRef<{ x: number; y: number } | null>(null);
    const pinchStartDistanceRef = useRef<number | null>(null);
    const pinchStartScaleRef = useRef(1);
    const pinchStartCenterRef = useRef<{ x: number; y: number } | null>(null);
    const pinchStartOffsetRef = useRef({ x: 0, y: 0 });
    const zoomScaleRef = useRef(1);
    const zoomXRef = useRef(0);
    const zoomYRef = useRef(0);
    const [zoomScale, setZoomScale] = useState(1);
    const [zoomX, setZoomX] = useState(0);
    const [zoomY, setZoomY] = useState(0);

    // 스와이프 임계값 (px): 이 값 이상 밀어야 슬라이드 전환
    const minSwipeDistance = 80;
    const isZoomed = zoomScale > 1.01;

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const getTouchDistance = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const getTouchCenter = (a: Touch, b: Touch) => ({
        x: (a.clientX + b.clientX) / 2,
        y: (a.clientY + b.clientY) / 2,
    });

    const clampOffset = (x: number, y: number, scale: number) => {
        const width = viewerRef.current?.clientWidth || window.innerWidth;
        const height = viewerRef.current?.clientHeight || window.innerHeight;
        const maxX = ((scale - 1) * width) / 2;
        const maxY = ((scale - 1) * height) / 2;
        return {
            x: clamp(x, -maxX, maxX),
            y: clamp(y, -maxY, maxY),
        };
    };

    const applyZoom = (scale: number, x: number, y: number) => {
        zoomScaleRef.current = scale;
        zoomXRef.current = x;
        zoomYRef.current = y;
        setZoomScale(scale);
        setZoomX(x);
        setZoomY(y);
    };

    const resetZoom = () => {
        pinchStartDistanceRef.current = null;
        pinchStartCenterRef.current = null;
        panStartRef.current = null;
        applyZoom(1, 0, 0);
    };

    // 라이트박스가 열린 순간부터 인접 full 화질 사진 프리로드
    useEffect(() => {
        if (lightboxIndex === null || N === 0) return;
        const prev = (lightboxIndex - 1 + N) % N;
        const next = (lightboxIndex + 1) % N;
        [lightboxIndex, prev, next].forEach((i) => {
            const img = new Image();
            img.decoding = 'async';
            img.src = photos[i]; // full 화질
        });
    }, [lightboxIndex, photos, N]);

    // 스냅 후 다음 paint에서 transition 재활성화
    useEffect(() => {
        if (!withTransition) {
            let id2: number;
            const id1 = requestAnimationFrame(() => {
                id2 = requestAnimationFrame(() => setWithTransition(true));
            });
            return () => {
                cancelAnimationFrame(id1);
                cancelAnimationFrame(id2);
            };
        }
    }, [withTransition]);

    // passive: false로 touchmove 등록 → preventDefault 가능
    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;
        const handleTouchMoveDOM = (e: TouchEvent) => {
            if (e.touches.length > 1 || zoomScaleRef.current > 1.01) {
                e.preventDefault();
                return;
            }
            if (touchStartX.current === null || touchStartY.current === null) return;
            const dx = e.touches[0].clientX - touchStartX.current;
            const dy = e.touches[0].clientY - touchStartY.current;
            if (isHorizontalRef.current === null) {
                if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
                    isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
                }
            }
            if (isHorizontalRef.current === true) e.preventDefault();
        };
        viewer.addEventListener('touchmove', handleTouchMoveDOM, { passive: false });
        return () => viewer.removeEventListener('touchmove', handleTouchMoveDOM);
    }, [lightboxIndex]); // 라이트박스 열릴 때마다 재등록

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setShiftPct(0);
        setDragPct(0);
        setWithTransition(false);
        animatingRef.current = false;
        resetZoom();
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
        setShiftPct(0);
        setDragPct(0);
        animatingRef.current = false;
        resetZoom();
    };

    const goNext = () => {
        if (lightboxIndex === null || N <= 1 || animatingRef.current) return;
        animatingRef.current = true;
        setIsDragging(false);
        setDragPct(0);
        setWithTransition(true);
        setShiftPct(-100);
    };

    const goPrev = () => {
        if (lightboxIndex === null || N <= 1 || animatingRef.current) return;
        animatingRef.current = true;
        setIsDragging(false);
        setDragPct(0);
        setWithTransition(true);
        setShiftPct(100);
    };

    const handleTransitionEnd = (e: React.TransitionEvent) => {
        if (e.target !== e.currentTarget) return;
        if (e.propertyName !== 'transform') return;
        if (lightboxIndex === null) return;
        if (shiftPct === -100) {
            setWithTransition(false);
            setLightboxIndex((r) => ((r ?? 0) + 1) % N);
            setShiftPct(0);
            resetZoom();
        } else if (shiftPct === 100) {
            setWithTransition(false);
            setLightboxIndex((r) => ((r ?? 0) - 1 + N) % N);
            setShiftPct(0);
            resetZoom();
        }
        animatingRef.current = false;
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (animatingRef.current) return;
        if (e.touches.length === 2) {
            const [a, b] = [e.touches[0], e.touches[1]];
            pinchStartDistanceRef.current = getTouchDistance(a, b);
            pinchStartScaleRef.current = zoomScaleRef.current;
            pinchStartCenterRef.current = getTouchCenter(a, b);
            pinchStartOffsetRef.current = { x: zoomXRef.current, y: zoomYRef.current };
            setIsDragging(false);
            setDragPct(0);
            touchStartX.current = null;
            touchStartY.current = null;
            isHorizontalRef.current = null;
            panStartRef.current = null;
            return;
        }
        if (e.touches.length > 1) return;
        if (isZoomed) {
            panStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            return;
        }
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        isHorizontalRef.current = null;
        setIsDragging(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2 && pinchStartDistanceRef.current !== null) {
            const [a, b] = [e.touches[0], e.touches[1]];
            const distance = getTouchDistance(a, b);
            const center = getTouchCenter(a, b);
            if (pinchStartDistanceRef.current <= 0) return;
            e.preventDefault();
            const ratio = distance / pinchStartDistanceRef.current;
            const nextScale = clamp(pinchStartScaleRef.current * ratio, minZoom, maxZoom);
            const startCenter = pinchStartCenterRef.current ?? center;
            const dx = center.x - startCenter.x;
            const dy = center.y - startCenter.y;
            const clampedOffset = clampOffset(
                pinchStartOffsetRef.current.x + dx,
                pinchStartOffsetRef.current.y + dy,
                nextScale
            );
            applyZoom(nextScale, clampedOffset.x, clampedOffset.y);
            return;
        }
        if (isZoomed) {
            if (e.touches.length !== 1 || !panStartRef.current) return;
            e.preventDefault();
            const dx = e.touches[0].clientX - panStartRef.current.x;
            const dy = e.touches[0].clientY - panStartRef.current.y;
            panStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            const clampedOffset = clampOffset(
                zoomXRef.current + dx,
                zoomYRef.current + dy,
                zoomScaleRef.current
            );
            applyZoom(zoomScaleRef.current, clampedOffset.x, clampedOffset.y);
            return;
        }
        if (touchStartX.current === null || touchStartY.current === null) return;
        const dx = e.touches[0].clientX - touchStartX.current;
        const dy = e.touches[0].clientY - touchStartY.current;
        if (isHorizontalRef.current === null) {
            if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
                isHorizontalRef.current = Math.abs(dx) > Math.abs(dy);
            }
        }
        if (isHorizontalRef.current === true) {
            const w = viewerRef.current?.clientWidth || window.innerWidth;
            setDragPct((dx / w) * 100);
        }
    };

    const handleTouchEnd = () => {
        if (pinchStartDistanceRef.current !== null) {
            if (zoomScaleRef.current <= 1.01) {
                resetZoom();
            }
            pinchStartDistanceRef.current = null;
            pinchStartCenterRef.current = null;
            return;
        }
        panStartRef.current = null;
        if (isZoomed) return;
        const dragged = dragPct;
        const wasHorizontal = isHorizontalRef.current === true;
        touchStartX.current = null;
        touchStartY.current = null;
        isHorizontalRef.current = null;
        setIsDragging(false);
        if (!wasHorizontal) { setDragPct(0); return; }
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
    };

    if (N === 0) {
        return (
            <div className="photo-gallery fade-children">
                <h2>Gallery</h2>
                <p className="photo-loading">이미지 로딩 중...</p>
            </div>
        );
    }

    // 라이트박스 슬라이드 3장 (이전 / 현재 / 다음)
    const cur = lightboxIndex ?? 0;
    const prevIdx = (cur - 1 + N) % N;
    const nextIdx = (cur + 1) % N;
    const slides = [
        { idx: prevIdx, pos: -100, key: `prev-${prevIdx}` },
        { idx: cur,     pos:    0, key: `cur-${cur}` },
        { idx: nextIdx, pos:  100, key: `next-${nextIdx}` },
    ];
    const trackTransform = `translate3d(calc(${shiftPct}% + ${dragPct}%), 0, 0)`;
    const trackClass = `lb-track ${(!withTransition || isDragging) ? 'no-transition' : ''}`;

    return (
        <div className="photo-gallery fade-children">
            <h2>갤러리</h2>

            {/* ─── 그리드 섹션 ─── */}
            <div className="photo-grid-section">
                <div className={`photo-grid-wrapper ${expanded ? 'expanded' : 'collapsed'}`}>
                    <div className="photo-grid">
                        {photos.map((src, i) => (
                            <div
                                key={i}
                                className="photo-grid-item"
                                onClick={() => openLightbox(i)}
                            >
                                <img
                                    src={toThumb(src)}
                                    alt={`웨딩 사진 ${i + 1}`}
                                    decoding="async"
                                    loading={i < 8 ? 'eager' : 'lazy'}
                                    draggable={false}
                                />
                            </div>
                        ))}
                    </div>
                    {!expanded && <div className="photo-grid-fade" />}
                </div>

                {!expanded ? (
                    <button className="photo-grid-more" onClick={() => setExpanded(true)}>
                        <span>더보기</span>
                        <span className="photo-grid-arrow">▼</span>
                    </button>
                ) : (
                    <button className="photo-grid-more" onClick={() => setExpanded(false)}>
                        <span>접기</span>
                        <span className="photo-grid-arrow collapse">▲</span>
                    </button>
                )}
            </div>

            {/* ─── 라이트박스 ─── */}
            {lightboxIndex !== null && (
                <div className="photo-lightbox">
                    <button className="lb-close" onClick={closeLightbox} aria-label="닫기">✕</button>

                    <div
                        ref={viewerRef}
                        className="lb-viewer"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                    >
                        <div
                            className={trackClass}
                            style={{ transform: trackTransform }}
                            onTransitionEnd={handleTransitionEnd}
                        >
                            {slides.map(({ idx, pos, key }) => (
                                <div
                                    className={`lb-slide ${pos === 0 ? 'is-current' : 'is-side'}`}
                                    key={key}
                                    style={pos === 0 ? undefined : { transform: `translate3d(${pos}%, 0, 0)` }}
                                >
                                    <img
                                        src={photos[idx]}
                                        alt={`웨딩 사진 ${idx + 1}`}
                                        decoding="async"
                                        loading="eager"
                                        draggable={false}
                                        style={pos === 0 ? { transform: `translate3d(${zoomX}px, ${zoomY}px, 0) scale(${zoomScale})` } : undefined}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {N > 1 && !isZoomed && (
                        <>
                            <button className="lb-nav lb-prev" onClick={goPrev} aria-label="이전">❮</button>
                            <button className="lb-nav lb-next" onClick={goNext} aria-label="다음">❯</button>
                        </>
                    )}

                    <div className="lb-index">{lightboxIndex + 1} / {N}</div>
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;