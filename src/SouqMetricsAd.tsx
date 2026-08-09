import React, {Suspense} from 'react';
import {RoundedBox, useTexture} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/DMSans';
import './style.css';

const {fontFamily} = loadFont();
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Source = {name: string; file: string; position: [number, number, number]; rotation: [number, number, number]; delay: number};
const sources: Source[] = [
  {name: 'Shopify', file: 'shopify.png', position: [-3.7, 3.45, -0.8], rotation: [-0.18, 0.45, -0.15], delay: 0},
  {name: 'Meta', file: 'meta.png', position: [3.55, 2.8, -1.7], rotation: [0.25, -0.5, 0.18], delay: 4},
  {name: 'Google Ads', file: 'googleads.png', position: [-4.2, 0.35, -2.2], rotation: [0.3, 0.55, 0.1], delay: 8},
  {name: 'Snapchat', file: 'snapchat.svg', position: [4.0, 0.15, 0.2], rotation: [-0.28, -0.5, -0.2], delay: 12},
  {name: 'WooCommerce', file: 'woocommerce.svg', position: [-3.35, -3.0, -1.2], rotation: [0.25, 0.5, -0.12], delay: 16},
  {name: 'TikTok', file: 'tiktok.png', position: [3.5, -3.15, -2.0], rotation: [-0.28, -0.4, 0.15], delay: 20},
  {name: 'Amazon', file: 'amazon.png', position: [0.15, 4.45, -2.8], rotation: [0.2, -0.35, 0.08], delay: 24},
];

const LogoFace: React.FC<{file: string; size: number; z: number}> = ({file, size, z}) => {
  const texture = useTexture(staticFile(`assets/${file}`));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return (
    <mesh position={[0, 0, z]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
};

const PlatformCube: React.FC<{source: Source; index: number}> = ({source, index}) => {
  const frame = useCurrentFrame();
  const start = 72 + source.delay;
  const pull = easeInOut(interpolate(frame, [start, start + 43], [0, 1], clamp));
  const float = 1 - pull;
  const position = source.position.map((value, axis) => {
    const drift = axis === 0 ? Math.sin((frame + index * 17) / 25) * 0.12 : axis === 1 ? Math.cos((frame + index * 11) / 28) * 0.14 : 0;
    return (value + drift) * float;
  }) as [number, number, number];
  position[2] += Math.sin(pull * Math.PI) * 1.7;
  const scale = interpolate(pull, [0, 0.75, 1], [1, 0.72, 0.02]);
  const spin = frame * 0.006;
  const rotation: [number, number, number] = [
    source.rotation[0] + spin * (0.6 + index * 0.04) + pull * 1.1,
    source.rotation[1] + spin * (0.9 + index * 0.05) + pull * 1.5,
    source.rotation[2] + spin * 0.45 + pull * 0.55,
  ];
  return (
    <group position={position} rotation={rotation} scale={scale} visible={pull < 0.995}>
      <RoundedBox args={[1.28, 1.28, 1.28]} radius={0.18} smoothness={5} castShadow receiveShadow>
        <meshPhysicalMaterial color="#fdfcf9" roughness={0.2} metalness={0.03} clearcoat={0.5} clearcoatRoughness={0.2} />
      </RoundedBox>
      <LogoFace file={source.file} size={0.72} z={0.647} />
    </group>
  );
};

const MainCube: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 48, fps, config: {damping: 18, stiffness: 90, mass: 1}});
  const processing = interpolate(frame, [145, 165, 205, 225], [0, 1, 0.55, 0], clamp);
  const final = interpolate(frame, [326, 360], [0, 1], clamp);
  const texture = useTexture(staticFile('assets/souqmetrics-icon.png'));
  texture.colorSpace = THREE.SRGBColorSpace;
  const scale = enter * interpolate(processing, [0, 1], [1, 1.045]) * interpolate(final, [0, 1], [1, 0.72]);
  return (
    <group position={[0, interpolate(final, [0, 1], [0, 3.15]), 0]} rotation={[-0.12 + Math.sin(frame / 65) * 0.035, -0.27 + frame * 0.0018, 0.025 + Math.sin(frame / 80) * 0.02]} scale={scale}>
      <RoundedBox args={[2.65, 2.65, 2.65]} radius={0.34} smoothness={8} castShadow receiveShadow>
        <meshPhysicalMaterial color="#080909" roughness={0.17} metalness={0.48} clearcoat={1} clearcoatRoughness={0.12} envMapIntensity={0.7} />
      </RoundedBox>
      <mesh position={[0, 0, 1.334]}>
        <planeGeometry args={[1.62, 1.62]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      <pointLight color="#32C8AC" intensity={processing * 2.5} distance={4.5} />
    </group>
  );
};

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraX = Math.sin(frame / 150) * 0.16;
  return (
    <ThreeCanvas width={1080} height={1350} camera={{position: [cameraX, 0.15, 12], fov: 39, near: 0.1, far: 100}} shadows gl={{antialias: true, alpha: true}}>
      <color attach="background" args={['#F5F2ED']} />
      <ambientLight intensity={1.35} color="#fffaf2" />
      <directionalLight position={[-4.5, 7, 8]} intensity={3.3} color="#fffdf8" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <directionalLight position={[6, -2, 4]} intensity={0.85} color="#bdeee5" />
      <pointLight position={[-5, 1, 5]} intensity={0.65} color="#32C8AC" distance={12} />
      <mesh position={[0, 0, -4]} receiveShadow>
        <planeGeometry args={[28, 28]} />
        <shadowMaterial color="#655f57" transparent opacity={0.12} />
      </mesh>
      <Suspense fallback={null}>
        {sources.map((source, index) => <PlatformCube key={source.name} source={source} index={index} />)}
        <MainCube />
      </Suspense>
    </ThreeCanvas>
  );
};

const metrics = [
  {value: '$128K', label: 'Revenue', x: -270, y: -210},
  {value: '3.8×', label: 'ROAS', x: 270, y: -210},
  {value: '$21', label: 'CPA', x: -270, y: 220},
  {value: '84%', label: 'Attributed', x: 270, y: 220},
];

const MetricCard: React.FC<{metric: (typeof metrics)[number]; index: number}> = ({metric, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({frame: frame - 216 - index * 8, fps, config: {damping: 17, stiffness: 95}});
  const fade = interpolate(frame, [318, 340], [1, 0], clamp);
  return (
    <div className="metric-card" style={{opacity: reveal * fade, transform: `translate(calc(-50% + ${metric.x * reveal}px), calc(-50% + ${metric.y * reveal}px)) scale(${0.45 + reveal * 0.55})`}}>
      <div className="metric-accent" /><div className="metric-value">{metric.value}</div><div className="metric-label">{metric.label}</div>
    </div>
  );
};

export const SouqMetricsAd: React.FC = () => {
  const frame = useCurrentFrame();
  const final = interpolate(frame, [326, 360], [0, 1], clamp);
  const answersOpacity = interpolate(frame, [205, 225, 320, 340], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill className="canvas" style={{fontFamily}}>
      <Scene />
      <div className="overlay-stage">
        {metrics.map((metric, index) => <MetricCard key={metric.label} metric={metric} index={index} />)}
        <div className="answers-label" style={{opacity: answersOpacity}}>CLARITY, INSTANTLY.</div>
      </div>
      <div className="end-frame" style={{opacity: final, transform: `translateY(${interpolate(final, [0, 1], [34, 0])}px)`}}>
        <div className="eyebrow"><span />SOUQMETRICS</div><h1>ONE SOURCE<br />OF TRUTH.</h1><p>For your entire ecommerce business.</p><div className="cta">Start free for 30 days <b>→</b></div>
      </div>
      <div className="grain" />
    </AbsoluteFill>
  );
};
