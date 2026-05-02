import React, { useState, useEffect, useRef } from 'react';
import './PhotoModal.css';

interface PhotoModalProps {
    photo: string;
    nextPhoto: string | null;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

const PhotoModal: React.FC<PhotoModalProps> = ({ photo, nextPhoto, onClose, onNext, onPrevious }) => {
    const [direction, setDirection] = useState<'left' | 'right' | null>(null);
    const [showControls, setShowControls] = useState(true);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const touchStartXRef = useRef<number | null>(null);
    const touchEndXRef = useRef<number | null>(null);
    const touchStartYRef = useRef<number | null>(null);
    const touchEndYRef = useRef<number | null>(null);
    const isPinchGestureRef = useRef(false);

    // 최소 스와이프 거리 (픽셀)
    const minSwipeDistance = 50;

    // 컨트롤 숨기기 타이머 설정
    const resetHideTimer = () => {
        setShowControls(true);
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 1000);
    };

    // 컴포넌트 마운트 시 타이머 시작
    useEffect(() => {
        resetHideTimer();

        // 모달 열려있는 동안 외부 스크롤 잠금
        const snapContainer = document.querySelector('.snap-container') as HTMLElement | null;
        const previousOverflowY = snapContainer?.style.overflowY;
        if (snapContainer) {
            snapContainer.style.overflowY = 'hidden';
        }

        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
            if (snapContainer) {
                snapContainer.style.overflowY = previousOverflowY || '';
            }
        };
    }, []);

    const handleNext = () => {
        setDirection('left');
        onNext();
        setTimeout(() => {
            setDirection(null);
        }, 400);
        resetHideTimer();
    };

    const handlePrevious = () => {
        setDirection('right');
        onPrevious();
        setTimeout(() => {
            setDirection(null);
        }, 400);
        resetHideTimer();
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        resetHideTimer();

        // 멀티터치(핀치 줌) 시작 시 스와이프 판정 비활성화
        if (e.touches.length > 1) {
            isPinchGestureRef.current = true;
            touchStartXRef.current = null;
            touchEndXRef.current = null;
            touchStartYRef.current = null;
            touchEndYRef.current = null;
            return;
        }

        isPinchGestureRef.current = false;
        touchEndXRef.current = null;
        touchEndYRef.current = null;
        touchStartXRef.current = e.targetTouches[0].clientX;
        touchStartYRef.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length > 1) {
            isPinchGestureRef.current = true;
            return;
        }

        if (isPinchGestureRef.current) return;

        touchEndXRef.current = e.targetTouches[0].clientX;
        touchEndYRef.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (isPinchGestureRef.current) {
            isPinchGestureRef.current = false;
            return;
        }

        if (
            touchStartXRef.current === null ||
            touchEndXRef.current === null ||
            touchStartYRef.current === null ||
            touchEndYRef.current === null
        ) {
            return;
        }

        const deltaX = touchStartXRef.current - touchEndXRef.current;
        const deltaY = Math.abs(touchStartYRef.current - touchEndYRef.current);

        // 세로 이동이 큰 경우 스와이프 전환 방지
        if (deltaY > 80) return;

        const isLeftSwipe = deltaX > minSwipeDistance;
        const isRightSwipe = deltaX < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrevious();
        }
    };

    const handleMouseMove = () => {
        resetHideTimer();
    };

    const handleClick = () => {
        resetHideTimer();
    };

    return (
        <div className="photo-modal" onClick={onClose}>
            <div 
                className="photo-modal-content" 
                onClick={(e) => e.stopPropagation()}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <span 
                    className={`close ${showControls ? 'visible' : 'hidden'}`} 
                    onClick={(e) => {
                        handleClick();
                        onClose();
                    }}
                >
                    &times;
                </span>
                <div className="modal-photo-container">
                    <img 
                        className={`modal-photo current ${direction ? `slide-${direction}` : ''}`}
                        src={photo} 
                        alt="Wedding" 
                    />
                    {nextPhoto && direction && (
                        <img 
                            className={`modal-photo next from-${direction === 'left' ? 'right' : 'left'}`}
                            src={nextPhoto} 
                            alt="Wedding" 
                        />
                    )}
                </div>
                <div className={`navigation ${showControls ? 'visible' : 'hidden'}`}>
                    <button className="prev" onClick={handlePrevious}>❮</button>
                    <button className="next" onClick={handleNext}>❯</button>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;