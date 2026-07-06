import React from 'react';

const InvitationMessage: React.FC = () => {
    return (
        <div className="invitation-message fade-children">
            {/* <h2>결혼식에 초대합니다!</h2>1 */}
                <h2 className="cal-deco">— ♡ —</h2>
            <p>10월의 맑은 하늘 아래, </p>
            {/* <p>저희 두 사람은 영원한 동반자로서의</p>
            <p>첫걸음을 내딛으려 합니다.</p> */}
            <p>서로에게 처음이었던 마음을 소중히 여기며,</p>
            <p>평생을 함께하겠다는 약속을 하고자 합니다.</p>
            <p>소중한 분들과</p>
            <p>저희의 새로운 시작을 함께하고 싶습니다.</p>
             {/* AI 청첩장 문구 사이트 주소:  https://holinen.com/wedding-message/ai-message-generator.php */}

            {/* <div className="message-divider"></div> */}
            <br />
            <div className="family-line">
                <div className="family-item">
                    <div className="family-parent"><strong>이상욱</strong> <span className="dot">•</span> <strong>윤주희</strong></div>
                    <div className="family-relation">아들 <strong>이승원</strong></div>
                </div>
                <div className="family-divider"></div>
                <div className="family-item">
                    <div className="family-parent"><strong>고찬주</strong> <span className="dot">•</span> <strong>임인숙</strong></div>
                    <div className="family-relation">딸 <strong>고정민</strong></div>
                </div>
            </div>
        </div>
    );
};

export default InvitationMessage
