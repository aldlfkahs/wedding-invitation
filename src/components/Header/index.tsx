import React, { useState, useEffect } from 'react';
import './header.css';

interface HeaderProps {
    onAnimationDone?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAnimationDone }) => {
    const weddingDate = "2026-10-17";
    const weddingTime = "12시 30분";
    const weddingLocation = "더컨벤션 송파문정 13F 아모르홀";

    const [dday, setDday] = useState<number | null>(null);
    const [bgVisible, setBgVisible] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        const targetDate = new Date("2026-10-17").getTime();
        const now = new Date().getTime();
        const diff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
        setDday(diff);
    }, []);

    // 애니메이션 시퀀스
    useEffect(() => {
        // Phase 1: 배경 사진 페이드인 (500ms 후 시작)
        const bgTimer = setTimeout(() => setBgVisible(true), 500);
        // Phase 2: 텍스트 콘텐츠 페이드인 (2000ms 후)
        const contentTimer = setTimeout(() => setContentVisible(true), 2000);
        // Phase 3: 애니메이션 완료 콜백 (2500ms)
        const doneTimer = setTimeout(() => {
            onAnimationDone?.();
        }, 2500);

        return () => {
            clearTimeout(bgTimer);
            clearTimeout(contentTimer);
            clearTimeout(doneTimer);
        };
    }, [onAnimationDone]);

    const bgUrl = `${import.meta.env.BASE_URL}images/main.webp`;

    return (
        <header className="header">
            {/* 배경 이미지 레이어 - 별도로 분리해 opacity 컨트롤 */}
            <div
                className="hero-bg"
                style={{
                    backgroundImage: `url(${bgUrl})`,
                    opacity: bgVisible ? 1 : 0,
                }}
            />
            <div className="hero-overlay" />
            <div
                className="hero-content"
                style={{ opacity: contentVisible ? 1 : 0 }}
            >
                <p className="hero-subtitle">이승원 ❤️ 고정민</p>
                <h1>결혼식에 초대합니다.</h1>
                {/* <div className="hero-divider">✦</div> */}
                <div className="wedding-details">
                    <p>{weddingDate} {weddingTime}</p>
                    <p>{weddingLocation}</p>
                </div>
                {/* {dday !== null && (
                    <div className="dday-counter">
                        {dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day' : `D+${Math.abs(dday)}`}
                    </div>
                )} */}
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
            </div>
            <div
                className="scroll-indicator"
                style={{ opacity: contentVisible ? 1 : 0 }}
            >
                <span>↓</span>
            </div>
        </header>
    );
};

export default Header;



// TODO: 배경 이미지와 텍스트를 별도의 레이어로 분리하여, 배경 이미지는 페이드인만 하고 텍스트는 나중에 페이드인하도록 수정. (배경 이미지가 먼저 나타나고, 텍스트가 나중에 나타나도록)