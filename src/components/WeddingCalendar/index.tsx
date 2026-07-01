import React, { useMemo } from 'react';
import './WeddingCalendar.css';

// ── 결혼식 날짜·시간을 여기서 수정하세요 ──
const WEDDING_YEAR  = 2026;
const WEDDING_MONTH = 10;          // 1~12
const WEDDING_DAY   = 17;
const WEDDING_TIME  = '오후 12시 30분';
// ──────────────────────────────────────────

const WEEKDAYS   = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_LABEL = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

const WeddingCalendar: React.FC = () => {
    const weddingDate = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, WEDDING_DAY);
    const dayOfWeek   = WEEKDAYS[weddingDate.getDay()];

    const diffDays = Math.ceil(
        (weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const cells = useMemo(() => {
        const firstDow   = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, 1).getDay();
        const daysInMonth = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();
        const arr: (number | null)[] = Array(firstDow).fill(null);
        for (let d = 1; d <= daysInMonth; d++) arr.push(d);
        while (arr.length % 7 !== 0) arr.push(null);
        return arr;
    }, []);

    return (
        <div className="wedding-calendar fade-children">

            {/* 월 헤더 */}
            <div className="cal-header">
                <span className="cal-year-label">{WEDDING_YEAR}</span>
                <span className="cal-month-label">{MONTH_LABEL[WEDDING_MONTH - 1]}</span>
            </div>

            {/* 달력 그리드 */}
            <div className="cal-grid">
                {WEEKDAYS.map((d) => (
                    <div
                        key={d}
                        className={`cal-weekday${d === '일' ? ' sun' : d === '토' ? ' sat' : ''}`}
                    >
                        {d}
                    </div>
                ))}
                {cells.map((day, i) => {
                    const col       = i % 7;
                    const isWedding = day === WEDDING_DAY;
                    return (
                        <div
                            key={i}
                            className={`cal-cell${isWedding ? ' wedding' : ''}${col === 0 ? ' sun' : col === 6 ? ' sat' : ''}`}
                        >
                            {day !== null && (
                                <span className="cal-num">{day}</span>
                            )}
                            {isWedding && <span className="cal-marker" aria-hidden>♥</span>}
                        </div>
                    );
                })}
            </div>

            {/* 날짜·시간·D-day */}
            <div className="cal-info">
                <p className="cal-full-date">
                    {WEDDING_YEAR}년 {WEDDING_MONTH}월 {WEDDING_DAY}일 {dayOfWeek}요일
                </p>
                <p className="cal-time">{WEDDING_TIME}</p>
                {diffDays > 0  && <p className="cal-dday">D - {diffDays}</p>}
                {diffDays === 0 && <p className="cal-dday">D - Day 🎉</p>}
                {diffDays < 0  && <p className="cal-dday">결혼했습니다 💍</p>}
            </div>
        </div>
    );
};

export default WeddingCalendar;
