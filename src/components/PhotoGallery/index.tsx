import React, { useState, useRef } from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
    openModal: (index: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, openModal }) => {
    const photosPerPage = 9;
    const totalPages = Math.ceil(photos.length / photosPerPage);
    const [currentPage, setCurrentPage] = useState(0);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    const currentPhotos = photos.slice(
        currentPage * photosPerPage,
        (currentPage + 1) * photosPerPage
    );

    const goToPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
        touchEndX.current = null;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        if (distance > 50) goToPage(currentPage + 1);
        if (distance < -50) goToPage(currentPage - 1);
    };

    return (
        <div className="photo-gallery">
            <h2>우리의 아름다운 순간</h2>
            <div
                className="photo-grid-container"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {totalPages > 1 && currentPage > 0 && (
                    <button className="gallery-nav-btn gallery-nav-prev" onClick={() => goToPage(currentPage - 1)}>❮</button>
                )}
                <div className="photo-grid">
                    {photos.length === 0 ? (
                        <p style={{ color: '#8B4789', padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>
                            이미지 로딩 중...
                        </p>
                    ) : (
                        currentPhotos.map((photo, index) => {
                            const globalIndex = currentPage * photosPerPage + index;
                            return (
                                <div key={globalIndex} className="photo-grid-item" onClick={() => openModal(globalIndex)}>
                                    <img
                                        src={photo}
                                        alt={`웨딩 사진 ${globalIndex + 1}`}
                                        onError={(e) => {
                                            e.currentTarget.src = `https://via.placeholder.com/300x300/FFB6C1/FFFFFF?text=${globalIndex + 1}`;
                                        }}
                                    />
                                </div>
                            );
                        })
                    )}
                </div>
                {totalPages > 1 && currentPage < totalPages - 1 && (
                    <button className="gallery-nav-btn gallery-nav-next" onClick={() => goToPage(currentPage + 1)}>❯</button>
                )}
            </div>
            {totalPages > 1 && (
                <div className="page-indicators">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            className={`page-dot ${i === currentPage ? 'active' : ''}`}
                            onClick={() => goToPage(i)}
                            aria-label={`${i + 1}페이지`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoGallery;