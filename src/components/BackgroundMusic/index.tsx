import React, { useEffect, useRef, useState } from 'react';
import './BackgroundMusic.css';

/**
 * 배경음악 컴포넌트
 *
 * 🎵 음악 파일 추가 방법:
 *   1. 음악 파일(예: bgm.mp3)을 `/public/` 폴더에 넣어주세요.
 *   2. 아래 MUSIC_SRC 상수를 파일 이름에 맞게 변경해주세요.
 *      예) const MUSIC_SRC = `${import.meta.env.BASE_URL}bgm.mp3`;
 */
const MUSIC_SRC = `${import.meta.env.BASE_URL}bgm.mp3`;

const BackgroundMusic: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const wasPlayingBeforeHiddenRef = useRef(false);
    const [muted, setMuted] = useState(false);
    const [playing, setPlaying] = useState(false);

    // 페이지 로드 후 자동 재생 시도
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.5;
        audio.loop = true;

        const tryPlay = () => {
            audio.play()
                .then(() => setPlaying(true))
                .catch(() => {
                    // 자동재생 정책으로 막힌 경우 – 첫 사용자 인터랙션 때 재생
                    const playOnInteract = () => {
                        audio.play()
                            .then(() => setPlaying(true))
                            .catch(() => {});
                        document.removeEventListener('click', playOnInteract);
                        document.removeEventListener('touchstart', playOnInteract);
                    };
                    document.addEventListener('click', playOnInteract);
                    document.addEventListener('touchstart', playOnInteract);
                });
        };

        tryPlay();
    }, []);

    // 브라우저가 백그라운드로 가면 일시정지, 복귀하면 이전 상태 복원
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                wasPlayingBeforeHiddenRef.current = !audio.paused && !audio.muted;
                audio.pause();
                setPlaying(false);
                return;
            }

            if (wasPlayingBeforeHiddenRef.current && !audio.muted) {
                audio.play()
                    .then(() => setPlaying(true))
                    .catch(() => {});
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (!playing) {
            // 아직 재생 안 된 경우 – 재생 시작
            audio.play()
                .then(() => {
                    setPlaying(true);
                    setMuted(false);
                    audio.muted = false;
                })
                .catch(() => {});
            return;
        }

        const nextMuted = !muted;
        audio.muted = nextMuted;
        setMuted(nextMuted);
    };

    return (
        <>
            <audio ref={audioRef} src={MUSIC_SRC} preload="auto" />
            <button
                className={`bgm-button ${muted ? 'bgm-muted' : 'bgm-playing'}`}
                onClick={toggleMute}
                title={muted ? '음악 켜기' : '음악 끄기'}
                aria-label={muted ? '음악 켜기' : '음악 끄기'}
            >
                {muted ? '🔇' : '🎵'}
            </button>
        </>
    );
};

export default BackgroundMusic;
