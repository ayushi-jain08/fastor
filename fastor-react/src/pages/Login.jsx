import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerPhone } from "../api.js";
import { ArrowLeft } from "../components/Icons.jsx";

const DIAL_CODE = "+91";
const clean = (v) => v.replace(/\D/g, "");

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const firstRef = useRef(null);
  const secondRef = useRef(null);

  const phone = first + second;
  const valid = phone.length === 10;

  const onFirst = (e) => {
    const v = clean(e.target.value);
    setError("");
    if (v.length > 5) {
      setFirst(v.slice(0, 5));
      setSecond(v.slice(5, 10));
      secondRef.current?.focus();
    } else {
      setFirst(v);
      if (v.length === 5) secondRef.current?.focus();
    }
  };

  const onSecond = (e) => {
    setError("");
    setSecond(clean(e.target.value).slice(0, 5));
  };

  const onSecondKey = (e) => {
    if (e.key === "Backspace" && !second) {
      e.preventDefault();
      setFirst((f) => f.slice(0, -1));
      firstRef.current?.focus();
    }
  };

  async function submit(e) {
    e.preventDefault();
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      await registerPhone(phone, DIAL_CODE);
      navigate("/verify", { state: { phone, dialCode: DIAL_CODE } });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="screen" onSubmit={submit} noValidate>
      <button
        type="button"
        className="back"
        aria-label="Go back"
        onClick={() => location.key !== "default" && navigate(-1)}
      >
        <ArrowLeft />
      </button>

      <h1 className="screen__title">Sign Up to Fastor</h1>
      <p className="screen__lead">
        Let us know your mobile number and we will send you an OTP for verification.
      </p>

      <div className={`phone-field${error ? " is-invalid" : ""}`}>
        <span className="phone-field__dial">{DIAL_CODE}</span>
        <input
          ref={firstRef}
          className="phone-field__part phone-field__part--first"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="00000"
          aria-label="First five digits of mobile number"
          value={first}
          disabled={busy}
          autoFocus
          onChange={onFirst}
        />
        <span className="phone-field__dash" aria-hidden="true">-</span>
        <input
          ref={secondRef}
          className="phone-field__part"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00000"
          aria-label="Last five digits of mobile number"
          value={second}
          disabled={busy}
          onChange={onSecond}
          onKeyDown={onSecondKey}
        />
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}

      <div className="screen__footer">
        <button className="btn-primary" type="submit" disabled={!valid || busy}>
          {busy ? "Sending…" : "Get OTP"}
        </button>
        <p className="terms">
          By clicking, I accept the <strong>Terms &amp; Conditions</strong> and <strong>Privacy Policy</strong>
        </p>
      </div>
    </form>
  );
}
