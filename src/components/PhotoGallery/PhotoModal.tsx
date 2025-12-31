import React, { useState, useEffect } from 'react';
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

    const handleNext = () => {
        setDirection('left');
        onNext();
        setTimeout(() => {
            setDirection(null);
        }, 400);
    };

    const handlePrevious = () => {
        setDirection('right');
        onPrevious();
        setTimeout(() => {
            setDirection(null);
        }, 400);
    };

    return (
        <div className="photo-modal" onClick={onClose}>
            <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>&times;</span>
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
                <div className="navigation">
                    <button className="prev" onClick={handlePrevious}>❮</button>
                    <button className="next" onClick={handleNext}>❯</button>
                </div>
            </div>
        </div>
    );
};

export default PhotoModal;