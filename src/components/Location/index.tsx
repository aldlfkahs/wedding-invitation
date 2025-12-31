import React from 'react';

const Location: React.FC = () => {
    const openKakaoMap = () => {
        window.open('https://map.kakao.com/link/map/%EB%AF%B8%EA%B8%88%EC%97%AD,37.3357,127.1087', '_blank');
    };

    const openNaverMap = () => {
        window.open('https://map.naver.com/v5/search/%EB%AF%B8%EA%B8%88%EC%97%AD', '_blank');
    };

    return (
        <div className="location">
            <h2>오시는 길</h2>
            <div className="location-info">
                <h3>예식장 정보</h3>
                <p><strong>주소:</strong> 경기도 성남시 분당구 금곡동 (미금역 인근)</p>
                <p><strong>전화:</strong> 000-0000-0000</p>
                
                <div className="map">
                    {/* 네이버 지도 iframe */}
                    <iframe
                        src="https://map.naver.com/p/entry/place/1415311624?c=15.00,0,0,0,dh"
                        width="100%"
                        height="400"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen
                        loading="lazy"
                        title="미금역 위치"
                    ></iframe>
                </div>

                <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={openKakaoMap} className="map-button kakao-button">카카오맵</button>
                    <button onClick={openNaverMap} className="map-button naver-button">네이버지도</button>
                </div>

                <div className="directions">
                    <h3>대중교통 이용</h3>
                    <p><strong>지하철:</strong> 수인분당선 미금역 1번 출구 도보 5분</p>
                    <p><strong>버스:</strong></p>
                    <ul style={{ textAlign: 'left', marginLeft: '20px', lineHeight: '1.8' }}>
                        <li>간선: 350, 360번</li>
                        <li>지선: 3330, 3333번</li>
                        <li>광역: 1113, 9407번</li>
                    </ul>
                    
                    <h3>자가용 이용</h3>
                    <p>네비게이션에 <strong>미금역</strong> 검색</p>
                    <p>예식장 건물 지하 주차장 이용 가능 (2시간 무료)</p>
                    <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '10px' }}>* 주차 공간이 협소하오니 가급적 대중교통을 이용해주시기 바랍니다.</p>
                </div>
            </div>
        </div>
    );
};

export default Location;
