import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        naver: any;
    }
}

const Location: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapRef.current || !window.naver) return;

        // 더컨벤션 송파문정 좌표
        const location = new window.naver.maps.LatLng(37.4842, 127.1043);

        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: true,
            zoomControlOptions: {
                position: window.naver.maps.Position.TOP_RIGHT,
            },
        };

        const map = new window.naver.maps.Map(mapRef.current, mapOptions);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
            position: location,
            map: map,
            title: '더컨벤션 송파문정',
        });

        // 정보창 생성
        const infoWindow = new window.naver.maps.InfoWindow({
            content: `
                <div style="padding:15px;min-width:200px;line-height:1.5;">
                    <h4 style="margin:0 0 10px 0;color:#8B4789;">더컨벤션 송파문정</h4>
                    <p style="margin:0;font-size:13px;color:#666;">서울특별시 송파구 문정동</p>
                </div>
            `,
        });

        // 마커 클릭시 정보창 표시
        window.naver.maps.Event.addListener(marker, 'click', () => {
            if (infoWindow.getMap()) {
                infoWindow.close();
            } else {
                infoWindow.open(map, marker);
            }
        });
    }, []);

    const openKakaoMap = () => {
        window.open('https://map.kakao.com/link/map/더컨벤션 송파문정,37.4842,127.1043', '_blank');
    };

    const openNaverMap = () => {
        window.open('https://map.naver.com/v5/search/더컨벤션 송파문정', '_blank');
    };

    return (
        <div className="location">
            <h2>오시는 길</h2>
            <div className="location-info">
                <h3>예식장 정보</h3>
                <p><strong>더컨벤션 송파문정</strong></p>
                <p><strong>주소:</strong> 서울특별시 송파구 문정동</p>
                <p><strong>전화:</strong> 000-0000-0000</p>
                
                <div className="map">
                    <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '12px' }}></div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '15px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={openKakaoMap} className="map-button kakao-button">카카오맵</button>
                    <button onClick={openNaverMap} className="map-button naver-button">네이버지도</button>
                </div>

                <div className="directions">
                    <h3>대중교통 이용</h3>
                    <p><strong>지하철:</strong> 8호선 문정역 1번 출구 도보 5분</p>
                    <p><strong>버스:</strong></p>
                    <ul style={{ textAlign: 'left', marginLeft: '20px', lineHeight: '1.8' }}>
                        <li>간선: 341, 360번</li>
                        <li>지선: 3217, 3414번</li>
                        <li>광역: 1117, 9403번</li>
                    </ul>
                    
                    <h3>자가용 이용</h3>
                    <p>네비게이션에 <strong>더컨벤션 송파문정</strong> 검색</p>
                    <p>예식장 건물 지하 주차장 이용 가능 (2시간 무료)</p>
                    <p style={{ fontSize: '0.95rem', color: '#888', marginTop: '10px' }}>* 주차 공간이 협소하오니 가급적 대중교통을 이용해주시기 바랍니다.</p>
                </div>
            </div>
        </div>
    );
};

export default Location;
