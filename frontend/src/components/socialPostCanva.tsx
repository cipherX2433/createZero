import { Stage, Layer, Text, Image } from "react-konva";
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface SocialPostProps {
  background: string;
  headline: string;
  points: string[];
  cta: string;
}

const SocialPostCanvas = forwardRef((props: SocialPostProps, ref) => {
  const { background, headline, points, cta } = props;
  const [img, setImg] = useState<any>();
  const stageRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    download: () => {
      if (!stageRef.current) return;
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 }); // Higher resolution for download
      const link = document.createElement("a");
      link.download = "creatorzero-social-post.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }));

  useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = "Anonymous"; // Crucial for toDataURL with external images
    image.src = background;
    image.onload = () => setImg(image);
  }, [background]);

  return (
    <Stage width={1080} height={1080} ref={stageRef}>
      <Layer>
        {img && <Image image={img} width={1080} height={1080} />}

        {/* Headline */}
        <Text
          text={headline}
          fontSize={60}
          fontFamily="Syne"
          fontStyle="800"
          fill="white"
          width={880}
          x={100}
          y={100}
          lineHeight={1.1}
          wrap="word"
        />

        {/* Key Points */}
        {points?.map((p: string, i: number) => (
          <Text
            key={i}
            text={`${i + 1}. ${p}`}
            fontSize={32}
            fontFamily="Syne"
            fill="white"
            width={840}
            x={120}
            y={350 + i * 130}
            lineHeight={1.3}
            wrap="word"
          />
        ))}

        {/* CTA */}
        <Text
          text={cta}
          fontSize={40}
          fontFamily="Syne"
          fontStyle="700"
          fill="#FFD700"
          width={840}
          x={120}
          y={880}
          align="center"
          wrap="word"
        />
      </Layer>
    </Stage>
  );
});

export default SocialPostCanvas;