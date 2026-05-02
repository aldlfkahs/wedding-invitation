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

    return (
        <div className="location">
            {(mode === 'map' || mode === 'both') && (
                <>
                    <h2>오시는 길</h2>
                    <div className="location-info">
                        <h3>예식장 정보</h3>
                        <p><strong>더컨벤션 송파문정</strong></p>
                        <p><strong>주소:</strong> 서울 송파구 문정동 651-8 (NH송파농협 13층)</p>
                        <p><strong>전화:</strong> 02-6418-5000</p>

                        <div className="map">
                            <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '12px' }}></div>
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '8px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                            <button onClick={openKakaoMap} className="map-button kakao-button">카카오맵</button>
                            <button onClick={openNaverMap} className="map-button naver-button">네이버지도</button>
                        </div>
                    </div>
                </>
            )}

            {(mode === 'directions' || mode === 'both') && (
                <div className="location-info directions-only" style={{ marginTop: (mode === 'both' ? '18px' : '0') }}>
                    <h3>대중교통 이용</h3>
                    <p><strong>🚇 지하철:</strong> 8호선 문정역 1번 출구 도보 5분</p>
                    <p><strong>🚌 버스:</strong></p>
                    <ul className="bus-list">
                        <li>간선: 341, 360번</li>
                        <li>지선: 3217, 3414번</li>
                        <li>광역: 1117, 9403번</li>
                    </ul>

                    <h3>🚗 자가용 이용</h3>
                    <p>네비게이션에 <strong>더컨벤션 송파문정</strong> 검색</p>
                    <p>예식장 건물 지하 주차장 이용 가능 (2시간 무료)</p>
                    <p className="parking-note">* 주차 공간이 협소하오니 가급적 대중교통을 이용해주시기 바랍니다.</p>
                </div>
            )}
        </div>
    );
};

export default Location;
