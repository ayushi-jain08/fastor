import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRestaurants } from "../RestaurantsContext.jsx";
import { money } from "../format.js";
import FoodImage from "../components/FoodImage.jsx";
import { ArrowLeft, Minus, Plus } from "../components/Icons.jsx";
import Toast from "../components/Toast.jsx";

const PORTIONS = [
  { label: "Personal (4 Slides)", extra: 0 },
  { label: "Medium (8 Slides)", extra: 3 },
  { label: "Familiar (10 Slides)", extra: 6 },
  { label: "Jumbo (12 Slides)", extra: 10 },
];

const FALLBACK_PRICE = 14;

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, status } = useRestaurants();
  const [qty, setQty] = useState(3);
  const [portion, setPortion] = useState(3);
  const [toast, setToast] = useState("");

  const item = items.find((r) => String(r.id) === id);

  if (status === "loading") {
    return (
      <div className="detail">
        <div className="detail__hero skeleton" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="detail">
        <div className="state">
          <h2>We couldn't find that item</h2>
          <p>It may have been removed.</p>
          <button className="pill pill--solid" onClick={() => navigate("/", { replace: true })}>Back to home</button>
        </div>
      </div>
    );
  }

  const unit = item.price ?? FALLBACK_PRICE;
  const total = (unit + PORTIONS[portion].extra) * qty;
  const description =
    item.description ||
    (item.cuisines.length
      ? `${item.cuisines.join(", ")}${item.location ? ` in ${item.location}` : ""}. Freshly prepared and served hot.`
      : "Freshly prepared and served hot. Pick a portion and add it to your cart.");

  return (
    <div className="detail">
      <div className="detail__hero">
        <FoodImage src={item.image} alt={item.name} className="detail__img" />
        <button className="detail__back" aria-label="Go back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="detail__price-row">
        <span className="detail__price">{money(unit)}</span>
        <div className="stepper">
          <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus /></button>
          <span aria-live="polite">{qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(20, q + 1))}><Plus /></button>
        </div>
      </div>

      <h1 className="detail__title">{item.name}</h1>
      <p className="detail__desc">{description}</p>

      <h2 className="detail__heading">Personal portion</h2>
      <div role="radiogroup" aria-label="Portion size">
        {PORTIONS.map((p, i) => (
          <button
            key={p.label}
            role="radio"
            aria-checked={i === portion}
            className="portion"
            onClick={() => setPortion(i)}
          >
            <span>{p.label}</span>
            <span className="portion__line" aria-hidden="true" />
            <span>{money(p.extra)}</span>
            <span className={`radio${i === portion ? " is-on" : ""}`} aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        className="btn-primary detail__cta"
        onClick={() => setToast(`Added ${qty} × ${item.name} (${PORTIONS[portion].label.split(" (")[0]}) for ${money(total)}`)}
      >
        Add to cart
      </button>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
