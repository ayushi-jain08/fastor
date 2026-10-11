import { useRef, useState } from "react";
import FoodImage from "./FoodImage.jsx";

const SLIDES = [
  { text: "Experience our delicious new dish", big: "30% OFF" },
  { text: "Fresh from the kitchen, every weekend", big: "20% OFF" },
  { text: "Treat yourself to something sweet", big: "15% OFF" },
  { text: "Lunch just got a little cheaper", big: "25% OFF" },
  { text: "Your first order is on us, almost", big: "10% OFF" },
];

export default function Banner({ images = [] }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  const goTo = (i) => {
    const el = trackRef.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div>
      <div className="carousel" ref={trackRef} onScroll={onScroll}>
        {SLIDES.map((s, i) => (
          <div className="slide" key={s.big + i}>
            <div className="slide__copy">
              <span className="ring ring--top" aria-hidden="true" />
              <span className="ring ring--bottom" aria-hidden="true" />
              <p className="slide__text">{s.text}</p>
              <p className="slide__big">{s.big}</p>
            </div>
            <FoodImage className="slide__img" src={images[i % Math.max(images.length, 1)]} />
          </div>
        ))}
      </div>
      <div className="dots" role="tablist" aria-label="Offers">
        {SLIDES.map((s, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === active}
            aria-label={`Offer ${i + 1}`}
            className={`dot${i === active ? " is-active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
