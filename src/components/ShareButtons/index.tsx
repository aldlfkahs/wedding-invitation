import React from 'react';
import './styles.css';

const ShareButtons: React.FC = () => {
  const currentUrl = window.location.href;

  // 링크 복사하기
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      alert('링크가 복사되었습니다!');
    } catch (err) {
      console.error('링크 복사 실패:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  // 카카오톡 공유하기
  const handleKakaoShare = () => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // 카카오 JavaScript Key로 초기화 (실제 키로 교체 필요)
        window.Kakao.init('YOUR_KAKAO_JAVASCRIPT_KEY');
      }

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '결혼합니다 💍',
          description: '저희 결혼식에 초대합니다',
          imageUrl: 'YOUR_IMAGE_URL', // 대표 이미지 URL
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: currentUrl,
              webUrl: currentUrl,
            },
          },
        ],
      });
    } else {
      alert('카카오톡 공유 기능을 사용할 수 없습니다.');
    }
  };

  return (
    <section className="share-buttons">
      <div className="share-buttons-container">
        <h2>초대장 공유하기</h2>
        <div className="button-group">
          <button onClick={handleKakaoShare} className="share-button kakao">
            <span className="icon">💬</span>
            카카오톡 공유
          </button>
          <button onClick={handleCopyLink} className="share-button link">
            <span className="icon">🔗</span>
            링크 복사
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShareButtons;
