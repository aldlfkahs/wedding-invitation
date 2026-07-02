import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        naver: any;
    }
}

type LocationMode = 'map' | 'directions' | 'both';

interface LocationProps {
    mode?: LocationMode;
}

const Location: React.FC<LocationProps> = ({ mode = 'both' }) => {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mode === 'directions') return; // don't init map when only rendering directions
        if (!mapRef.current) {
            return;
        }

        // 네이버 지도 스크립트 로딩 대기
        const initMap = () => {
            if (!window.naver || !window.naver.maps) {
                console.error('Naver Maps API not loaded');
                return;
            }

            try {
                // 더컨벤션 송파문정 좌표 (서울 송파구 문정동 651-8)
                const location = new window.naver.maps.LatLng(37.484123, 127.122752);

                const mapOptions = {
                    center: location,
                    zoom: 16,
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
            } catch (error) {
                console.error('Error initializing map:', error);
            }
        };

        // 네이버 지도 API가 로드될 때까지 대기
        if (window.naver && window.naver.maps) {
            initMap();
        } else {
            const checkInterval = setInterval(() => {
                if (window.naver && window.naver.maps) {
                    clearInterval(checkInterval);
                    initMap();
                }
            }, 100);

            // 10초 후에도 로드 안되면 타임아웃
            setTimeout(() => {
                clearInterval(checkInterval);
                console.error('Naver Maps API loading timeout');
            }, 10000);
        }
    }, [mode]);

    const openKakaoMap = () => {
        window.open('https://map.kakao.com/link/map/더컨벤션 송파문정,37.484123,127.122752', '_blank');
    };

    const openNaverMap = () => {
        window.open('https://map.naver.com/p/search/%EB%8D%94%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%86%A1%ED%8C%8C%EB%AC%B8%EC%A0%95/place/1958047921?c=15.00,0,0,0,dh&placePath=/home?entry=bmp&from=map&fromPanelNum=2&timestamp=202601011454&locale=ko&svcName=map_pcv5&searchText=%EB%8D%94%EC%BB%A8%EB%B2%A4%EC%85%98%20%EC%86%A1%ED%8C%8C%EB%AC%B8%EC%A0%95', '_blank');
    };

    const openTmap = () => {
        // 앱 딥링크로 더컨벤션 송파문정 길찾기 바로 열기
        window.location.href = `tmap://route?goalname=${encodeURIComponent('더컨벤션 송파문정')}&goalx=127.122752&goaly=37.484123&goalrad=500`;
    };

    return (
        <div className="location fade-children">
            {(mode === 'map' || mode === 'both') && (
                <>
                    <h2>오시는 길</h2>
                    <div className="location-info">
                        <p style={{ textAlign: 'center' }}><strong>더컨벤션 송파문정 (13F 아모르홀)</strong></p>
                        <p style={{ textAlign: 'center' }}><strong>주소:</strong> 서울 송파구 문정동 651-8 (NH송파농협 13층)</p>

                        <div className="map">
                            <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '12px' }}></div>
                        </div>

                        <div className="map-buttons-row">
                            <button onClick={openKakaoMap} className="map-button kakao-button">카카오맵</button>
                            <button onClick={openNaverMap} className="map-button naver-button">네이버지도</button>
                            <button onClick={openTmap} className="map-button tmap-button">티맵</button>
                        </div>
                    </div>
                </>
            )}

            {(mode === 'directions' || mode === 'both') && (
                <div className="transport-section" style={{ marginTop: (mode === 'both' ? '14px' : '0') }}>
                    {/* <h3 className="transport-title">교통 안내</h3> */}

                    {/* 자가용 */}
                    <div className="transport-row">
                        <span className="transport-icon">🚗</span>
                        <div className="transport-body">
                            <span className="transport-mode">자가용</span>
                            <span className="transport-detail">네비: <strong>더컨벤션 송파문정</strong> 검색</span>
                            <span className="transport-detail">주차: 건물 내 + 앞 건물 (2시간 무료, 확인필요)</span>
                        </div>
                    </div>
                    {/* 지하철 */}
                    <div className="transport-row">
                        <span className="transport-icon">🚇</span>
                        <div className="transport-body">
                            <span className="transport-mode">지하철</span>
                            <span className="transport-detail">8호선 문정역 3번 출구 도보 3분</span>
                        </div>
                    </div>

                    {/* 버스 */}
                    <div className="transport-row">
                        <span className="transport-icon">🚌</span>
                        <div className="transport-body">
                            <span className="transport-mode">버스</span>
                            <div className="bus-grid">
                                <span className="bus-badge">일반</span>
                                <span className="bus-nums">30, 31, 100, 331</span>
                                <span className="bus-badge">간선</span>
                                <span className="bus-nums">302, 303, 320, 333, 343, 345, 350, 360, 422, N13, N37</span>
                                <span className="bus-badge">지선</span>
                                <span className="bus-nums">3322, 3420</span>
                                <span className="bus-badge">직행</span>
                                <span className="bus-nums">1009, 1112, 1117, 1650, 500-1, 500-1A, 3302, 4305, G2100, G6009</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Location;
