import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { useRestaurants } from "../RestaurantsContext.jsx";
import { money } from "../format.js";
import Banner from "../components/Banner.jsx";
import FoodImage from "../components/FoodImage.jsx";
import { PhoneIcon, WalletIcon } from "../components/Icons.jsx";
import Toast from "../components/Toast.jsx";

function Skeletons() {
  return (
    <>
      <div className="best" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => <div key={i} className="best__item skeleton" />)}
      </div>
      <div className="pop" aria-hidden="true">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="row">
            <div className="row__img skeleton" />
            <div className="row__body">
              <div className="skeleton line line--lg" />
              <div className="skeleton line" />
              <div className="skeleton line line--sm" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { items, status, error, reload } = useRestaurants();
  const [toast, setToast] = useState("");

  const bannerImages = useMemo(() => items.filter((r) => r.image).map((r) => r.image).slice(0, 5), [items]);
  const open = (r) => navigate(`/item/${encodeURIComponent(r.id)}`);

  return (
    <div className="home">
      <header className="home__header">
        <div>
          <p className="home__label">Current Locations</p>
          <p className="home__place">Model Town, New Delhi</p>
        </div>
        <button className="home__logout" onClick={signOut}>Log out</button>
      </header>

      <div className="home__top">
        <div className="name-chip">Karan</div>
        <div className="quick">
          <button className="quick__btn quick__btn--call" aria-label="Call support" onClick={() => setToast("Calling isn't available in this demo.")}>
            <PhoneIcon />
          </button>
          <button className="quick__btn quick__btn--wallet" aria-label="Wallet" onClick={() => setToast("Wallet isn't available in this demo.")}>
            <WalletIcon />
          </button>
        </div>
      </div>

      <main className="home__main">
        {status === "loading" && (
          <>
            <h2 className="section-title">Best Seller</h2>
            <Skeletons />
          </>
        )}

        {status === "error" && (
          <div className="state" role="alert">
            <h2>Couldn't load restaurants</h2>
            <p>{error}</p>
            <button className="pill pill--solid" onClick={reload}>Try again</button>
          </div>
        )}

        {status === "ready" && items.length === 0 && (
          <div className="state">
            <h2>No restaurants yet</h2>
            <p>Check back in a bit, new places are added often.</p>
          </div>
        )}

        {status === "ready" && items.length > 0 && (
          <>
            <h2 className="section-title">Best Seller</h2>
            <div className="best">
              {items.slice(0, 8).map((r) => (
                <button key={r.id} className="best__item" onClick={() => open(r)} aria-label={r.name}>
                  <FoodImage src={r.image} className="best__img" />
                  <span className="best__price">
                    {r.price ? money(r.price, 1) : r.rating ? `★ ${r.rating.toFixed(1)}` : "New"}
                  </span>
                </button>
              ))}
            </div>

            <Banner images={bannerImages} />

            <h2 className="section-title section-title--pop">Popular Items</h2>
            <div className="pop">
              {items.map((r) => (
                <article
                  key={r.id}
                  className="row"
                  tabIndex={0}
                  onClick={() => open(r)}
                  onKeyDown={(e) => e.key === "Enter" && open(r)}
                >
                  <FoodImage src={r.image} className="row__img" alt={r.name} />
                  <div className="row__body">
                    <div className="row__line">
                      <h3 className="row__name">{r.name}</h3>
                      {r.price && <span className="row__price">{money(r.price)}</span>}
                    </div>
                    <div className="row__line row__line--sub">
                      <span className="row__sub">{r.location || r.cuisines.slice(0, 2).join(", ")}</span>
                      {r.rating && <span className="row__sub">★ {r.rating.toFixed(1)}</span>}
                    </div>
                    <div className="row__line">
                      <button
                        className="pill pill--solid"
                        onClick={(e) => { e.stopPropagation(); setToast("Cancel Order isn't available in this demo."); }}
                      >
                        Cancel Order
                      </button>
                      <button
                        className="pill pill--soft"
                        onClick={(e) => { e.stopPropagation(); setToast("Track Driver isn't available in this demo."); }}
                      >
                        Track Driver
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>

      <Toast message={toast} onDone={() => setToast("")} />
    </div>
  );
}
