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
            { name: '이상욱, 윤주희', bank: '국민', number: '517101-01-160080' },
            { name: '이승원', bank: '신한', number: '110-093-365937' },
        ],
    },
    {
        side: '신부측',
        accounts: [
            { name: '고찬주, 임인숙', bank: '신한', number: '110-171-196166' },
            { name: '고정민', bank: '하나', number: '253-890629-80607' },
        ],
    },
];

const AccountInfo: React.FC = () => {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (acc: Account) => {
        const text = `${acc.bank} ${acc.number}`;
        navigator.clipboard.writeText(text).then(() => {
            setCopied(acc.name);
            setTimeout(() => setCopied(null), 1800);
        });
    };

    return (
        <div className="account-info fade-children">
            <h2>마음 전하실 곳</h2>
            <p className="account-desc">축하해 주시는 마음만으로도 감사합니다 💝</p>

            <div className="account-cols">
                {groups.map((group) => (
                    <div key={group.side} className="account-group">
                        <div className="account-group-title">{group.side}</div>
                        {group.accounts.map((acc) => (
                            <button
                                key={acc.name}
                                className={`account-item ${copied === acc.name ? 'copied' : ''}`}
                                onClick={() => handleCopy(acc)}
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
        </div>
    );
};

export default AccountInfo;