import React from 'react';

const InvitationMessage: React.FC = () => {
    return (
        <div className="invitation-message">
            <h2>결혼식에 초대합니다!</h2>
            <p>만난지 4년이 되기 딱 이틀 전, 대략 평생 만난다는 내용...</p>
            <p>문구를 뭐넣지?</p>
            <p>많이 와주세요 제발...!</p>
            <p>참석하여 자리를 빛내주세요. 반짝반짝</p>
            <p className="family-line">
                <strong>OOO, OOO</strong>의 아들 <strong>이승원</strong>
                <span className="family-separator"> · </span>
                <strong>OOO, OOO</strong>의 딸 <strong>고정민</strong>
            </p>
        </div>
    );
};

export default InvitationMessage;