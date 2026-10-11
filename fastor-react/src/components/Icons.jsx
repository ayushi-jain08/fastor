const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

export const ArrowLeft = ({ size = 24 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" {...base}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);

export const Minus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" {...base} strokeWidth="3">
    <path d="M6 12h12" />
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" {...base} strokeWidth="3">
    <path d="M12 6v12M6 12h12" />
  </svg>
);

export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path
      fill="#fff"
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
    />
  </svg>
);

export const WalletIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
    <path d="M4 7.5V7a3 3 0 0 1 3-3h9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    <rect x="3" y="7" width="18" height="13" rx="3" fill="#fff" />
    <rect x="14" y="11.5" width="8" height="4.5" rx="2.25" fill="#6b8fe6" />
    <circle cx="17" cy="13.75" r="1" fill="#fff" />
  </svg>
);
