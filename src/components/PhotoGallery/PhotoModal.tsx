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
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        }, 2000);
    };

    // 컴포넌트 마운트 시 타이머 시작
    useEffect(() => {
        resetHideTimer();
        return () => {
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
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
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

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