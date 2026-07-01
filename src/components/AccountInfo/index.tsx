import React, { useState } from 'react';

interface Account {
    name: string;
    bank: string;
    number: string;
}

interface AccountGroup {
    side: string;
    accounts: Account[];
}

const groups: AccountGroup[] = [
    {
        side: '신랑측',
        accounts: [
            { name: '이상욱', bank: '은행명', number: '계좌번호' }, // TODO: 아버지 계좌 입력
            { name: '이승원', bank: '신한', number: '110-093-365937' },
        ],
    },
    {
        side: '신부측',
        accounts: [
            { name: '고찬주', bank: '은행명', number: '계좌번호' }, // TODO: 아버지 계좌 입력
            { name: '고정민', bank: '하나', number: '253-890629-80607' },
        ],
    },
];

const AccountInfo: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (number: string, name: string) => {
        navigator.clipboard.writeText(number).then(() => {
            setCopied(name);
            setTimeout(() => setCopied(null), 1800);
        });
    };

    return (
        <div className="account-info fade-children">
            <h2>마음 전하실 곳</h2>
            <p className="account-desc">참석이 어려우신 분들을 위해 계좌번호를 안내드립니다</p>

            <div className="account-cols">
                {groups.map((group) => (
                    <div key={group.side} className="account-group">
                        <div className="account-group-title">{group.side}</div>
                        {group.accounts.map((acc) => (
                            <button
                                key={acc.name}
                                className={`account-item ${copied === acc.name ? 'copied' : ''}`}
                                onClick={() => handleCopy(acc.number, acc.name)}
                                aria-label={`${acc.name} 계좌번호 복사`}
                            >
                                <span className="account-name">{acc.name}</span>
                                <span className="account-bank-num">{acc.bank} {acc.number}</span>
                                <span className="account-copy-label">
                                    {copied === acc.name ? '복사됨 ✓' : '클릭하여 복사'}
                                </span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            <p className="account-closing">축하해 주시는 마음만으로도 감사합니다 💝</p>
        </div>
    );
};

export default AccountInfo;