import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { loginWithOtp, registerPhone } from "../api.js";
import { useAuth } from "../AuthContext.jsx";
import { ArrowLeft } from "../components/Icons.jsx";
import OtpInput from "../components/OtpInput.jsx";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const mmss = (s) => `00:${String(s).padStart(2, "0")}`;

export default function Verify() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  if (!state?.phone) return <Navigate to="/login" replace />;
  const { phone, dialCode } = state;

  async function submit(e) {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH || busy) return;
    setBusy(true);
    setError("");
    try {
      const token = await loginWithOtp(phone, dialCode, otp);
      signIn(token, `${dialCode} ${phone}`);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message);
      setOtp("");
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError("");
    try {
      await registerPhone(phone, dialCode);
      setOtp("");
      setSeconds(RESEND_SECONDS);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="screen" onSubmit={submit} noValidate>
      <button type="button" className="back" aria-label="Go back" onClick={() => navigate(-1)}>
        <ArrowLeft />
      </button>

      <h1 className="screen__title">6-digit code</h1>
      <p className="screen__lead">
        Please enter the code we've sent to
        <br />
        <strong>{dialCode} {phone.slice(0, 5)} {phone.slice(5)}</strong>
      </p>

      <OtpInput value={otp} onChange={(v) => { setOtp(v); setError(""); }} length={OTP_LENGTH} disabled={busy} invalid={!!error} />
      {error && <p className="field-error" role="alert">{error}</p>}

      <p className="resend">
        I didn't receive a code{" "}
        {seconds > 0 ? (
          <b className="resend__timer">({mmss(seconds)})</b>
        ) : (
          <button type="button" className="resend__btn" onClick={resend}>Resend code</button>
        )}
      </p>

      <div className="screen__footer">
        <button className="btn-primary" type="submit" disabled={otp.length !== OTP_LENGTH || busy}>
          {busy ? "Checking…" : "Continue"}
        </button>
      </div>
    </form>
  );
}
