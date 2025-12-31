import React from 'react';
import './header.css'; // Assuming you will create a CSS file for styling

const Header: React.FC = () => {
    const weddingDate = "2023-10-15"; // Example date
    const weddingTime = "15:00"; // Example time
    const weddingLocation = "서울특별시 강남구"; // Example location

    return (
        <header className="header">
            <h1>결혼식 초대장</h1>
            <div className="wedding-details">
                <p>날짜: {weddingDate}</p>
                <p>시간: {weddingTime}</p>
                <p>장소: {weddingLocation}</p>
            </div>
        </header>
    );
};

export default Header;