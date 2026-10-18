"use client";

import { useState, startTransition } from "react";
import { addPropertyControls, ControlType } from "./framer-shim.js";

/**
 * CardDeck — a fan of overlapping cards that spread apart on hover
 * (ported from Framer's "CardDeck"). Self-contained: pure CSS transforms,
 * no framer dependency beyond the local shim.
 *
 * Adaptations vs. the original:
 *  - Prop defaults are declared here (matching the Framer property-control
 *    defaults) so the component works standalone outside the Framer canvas.
 */

const defaultImages = [
  { src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg", alt: "Gradient 1 - Blue" },
  { src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg", alt: "Gradient 2 - Purple" },
  { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "Gradient 3 - Orange" },
  { src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg", alt: "Gradient 4 - Yellow" },
  { src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg", alt: "Gradient 5 - Green" },
];

export default function CardDeck(props) {
  const {
    images = defaultImages,
    fanSettings = { spacing: 120, rotationIntensity: 12, arcIntensity: 12, scaleDecay: 0.06 },
    hoverBoost = 1.15,
    hoverLift = 60,
    pushForce = 130,
    cardWidth = 240,
    cardHeight = 360,
    borderRadius = 32,
    shadow = 0.15,
    transitionStyle = "smooth",
  } = props;

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const imageList = images && images.length > 0 ? images : defaultImages;
  const totalCards = imageList.length;
  const centerIndex = Math.floor(totalCards / 2);
  const transition =
    transitionStyle === "bouncy"
      ? "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";

  return (
    <div style={containerStyle}>
      {imageList.map((image, idx) => {
        const distanceToCenter = Math.abs(idx - centerIndex);
        const zIndex = 20 - distanceToCenter;
        const baseScale = 1 - distanceToCenter * fanSettings.scaleDecay;
        let xOffset = (idx - centerIndex) * fanSettings.spacing;
        let yOffset = Math.pow(distanceToCenter, 2) * fanSettings.arcIntensity;
        let rotation = (idx - centerIndex) * fanSettings.rotationIntensity;
        let scale = baseScale;
        if (hoveredIndex !== null) {
          const distFromHover = idx - hoveredIndex;
          const absDistFromHover = Math.abs(distFromHover);
          if (idx === hoveredIndex) {
            yOffset -= hoverLift;
            scale = baseScale * hoverBoost;
          } else {
            const decay = pushForce / (absDistFromHover + 0.6);
            const direction = distFromHover > 0 ? 1 : -1;
            xOffset += direction * decay;
            rotation += direction * (5 / (absDistFromHover + 0.2));
            scale = baseScale * 0.96;
          }
        }
        return (
          <div
            key={`${image.src}-${idx}`}
            onMouseEnter={() => startTransition(() => setHoveredIndex(idx))}
            onMouseLeave={() => startTransition(() => setHoveredIndex(null))}
            role="img"
            aria-label={image.alt || `Card ${idx + 1}`}
            style={{
              ...cardStyle,
              width: cardWidth,
              height: cardHeight,
              borderRadius,
              backgroundImage: `url(${image.src})`,
              zIndex,
              transform: `translate(${xOffset}px, ${yOffset}px) rotate(${rotation}deg) scale(${scale})`,
              transition,
              boxShadow: `0 15px 35px rgba(0, 0, 0, ${shadow})`,
            }}
          />
        );
      })}
    </div>
  );
}

const containerStyle = {
  display: "flex",
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  overflow: "visible",
};

const cardStyle = {
  position: "absolute",
  backgroundSize: "cover",
  backgroundPosition: "center",
  willChange: "transform",
  transformOrigin: "center center",
};

addPropertyControls(CardDeck, {
  images: {
    type: ControlType.Array,
    title: "Images",
    control: { type: ControlType.ResponsiveImage },
    defaultValue: defaultImages,
  },
  fanSettings: {
    type: ControlType.Object,
    title: "Layout",
    controls: {
      spacing: { type: ControlType.Number, title: "Spacing", min: 40, max: 200, defaultValue: 120 },
      rotationIntensity: { type: ControlType.Number, title: "Rotation", min: 0, max: 25, defaultValue: 12 },
      arcIntensity: { type: ControlType.Number, title: "Arc Depth", min: 0, max: 30, defaultValue: 12 },
      scaleDecay: { type: ControlType.Number, title: "Size Decay", min: 0, max: 0.15, step: 0.01, defaultValue: 0.06 },
    },
    defaultValue: { spacing: 120, rotationIntensity: 12, arcIntensity: 12, scaleDecay: 0.06 },
  },
  hoverBoost: { type: ControlType.Number, title: "Hover Scale", min: 1, max: 1.5, step: 0.01, defaultValue: 1.15 },
  hoverLift: { type: ControlType.Number, title: "Hover Lift", min: 0, max: 150, defaultValue: 60 },
  pushForce: { type: ControlType.Number, title: "Push Force", min: 0, max: 300, defaultValue: 130 },
  cardWidth: { type: ControlType.Number, title: "Card Width", defaultValue: 240, min: 100, max: 600 },
  cardHeight: { type: ControlType.Number, title: "Card Height", defaultValue: 360, min: 100, max: 800 },
  borderRadius: { type: ControlType.Number, title: "Border Radius", defaultValue: 32, min: 0 },
  shadow: { type: ControlType.Number, title: "Shadow", defaultValue: 0.15, min: 0, max: 1, step: 0.1 },
  transitionStyle: {
    type: ControlType.Enum,
    title: "Transition",
    options: ["bouncy", "smooth"],
    defaultValue: "smooth",
  },
});
