import React, { useState, useEffect } from 'react';
import './header.css';

const Header: React.FC = () => {
    const weddingDate = "2026-10-17";
    const weddingTime = "12:30";
    const weddingLocation = "서울특별시 강남구";

    const [dday, setDday] = useState<number | null>(null);

    useEffect(() => {
        const targetDate = new Date(weddingDate).getTime();
        const now = new Date().getTime();
        const diff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        setDday(diff);
    }, []);

    const bgUrl = `${import.meta.env.BASE_URL}images/1.jpg`;

    return (
        <header className="header" style={{ backgroundImage: `url(${bgUrl})` }}>
            <div className="hero-overlay" />
            <div className="hero-content">
                <p className="hero-subtitle">Wedding Invitation</p>
                <h1>결혼식 초대장</h1>
                <div className="hero-divider">✦</div>
                <div className="wedding-details">
                    <p>{weddingDate}</p>
                    <p>{weddingTime}</p>
                    <p>{weddingLocation}</p>
                </div>
                {dday !== null && (
                    <div className="dday-counter">
                        {dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day' : `D+${Math.abs(dday)}`}
                    </div>
                )}
            </div>
            <div className="scroll-indicator">
                <span>↓</span>
            </div>
        </header>
    );
};

export default Header;