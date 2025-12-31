import React from 'react';
import './PhotoGallery.css';

interface PhotoGalleryProps {
    photos: string[];
    openModal: (index: number) => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, openModal }) => {
    return (
        <div className="photo-gallery">
            <h2>우리의 아름다운 순간</h2>
            <div className="horizontal-scroll-container">
                <div className="horizontal-scroll">
                    {photos.length === 0 ? (
                        <p style={{ color: '#8B4789', padding: '20px' }}>이미지 로딩 중...</p>
                    ) : (
                        photos.map((photo, index) => (
                            <div key={index} className="photo-horizontal" onClick={() => openModal(index)}>
                                <img src={photo} alt={`웨딩 사진 ${index + 1}`} onError={(e) => {
                                    console.log('이미지 로드 실패:', photo);
                                    e.currentTarget.src = 'https://via.placeholder.com/300x400/FFB6C1/FFFFFF?text=Photo+' + (index + 1);
                                }} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhotoGallery;