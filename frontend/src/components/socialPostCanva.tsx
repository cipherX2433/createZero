import { Stage, Layer, Text, Image } from "react-konva";
import { useState, useEffect } from "react";

interface SocialPostProps {
  background: string;
  headline: string;
  points: string[];
  cta: string;
}

export default function SocialPostCanvas({
  background,
  headline,
  points,
  cta
}: SocialPostProps) {

  const [img, setImg] = useState<any>();

  useEffect(() => {

    const image = new window.Image();
    image.src = background;

    image.onload = () => setImg(image);

  }, [background]);

  return (
    <Stage width={1080} height={1080}>
      <Layer>

        {img && <Image image={img} width={1080} height={1080} />}

        <Text
          text={headline}
          fontSize={80}
          fill="white"
          width={900}
          x={100}
          y={120}
        />

        {points?.map((p: string, i: number) => (
          <Text
            key={i}
            text={`${i + 1}. ${p}`}
            fontSize={40}
            fill="white"
            x={120}
            y={400 + i * 80}
          />
        ))}

        <Text
          text={cta}
          fontSize={50}
          fill="#FFD700"
          x={120}
          y={900}
        />

      </Layer>
    </Stage>
  );
}