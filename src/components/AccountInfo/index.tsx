import React from 'react';

const AccountInfo: React.FC = () => {
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert(`${label} 복사되었습니다!`);
        });
    };

    return (
        <div className="account-info">
            <h2>마음 전하실 곳</h2>
            <p>참석이 어려우신 분들을 위해 계좌번호를 안내드립니다</p>
            
            <div style={{ marginTop: '30px' }}>
                <h3>신랑측 계좌</h3>
                <ul>
                    <li onClick={() => copyToClipboard('110-093-365937', '계좌번호가')} style={{ cursor: 'pointer' }}>
                        <strong>예금주:</strong> 이승원<br/>
                        <strong>계좌번호:</strong> 신한 110-093-365937
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>클릭하여 복사</div>
                    </li>
                </ul>

                <h3 style={{ marginTop: '30px' }}>신부측 계좌</h3>
                <ul>
                    <li onClick={() => copyToClipboard('253-890629-80607', '계좌번호가')} style={{ cursor: 'pointer' }}>
                        <strong>예금주:</strong> 고정민<br/>
                        <strong>계좌번호:</strong> 하나 253-890629-80607
                        <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>클릭하여 복사</div>
                    </li>
                </ul>
            </div>
            
            <p style={{ marginTop: '30px', color: '#666' }}>축하해 주시는 마음만으로도 감사합니다 💝</p>
        </div>
    );
};

export default AccountInfo;