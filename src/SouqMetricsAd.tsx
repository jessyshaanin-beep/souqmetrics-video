import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont} from '@remotion/google-fonts/DMSans';
import './style.css';

const {fontFamily} = loadFont();
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const sources = [
  {name: 'Shopify', file: 'shopify.png', x: -330, y: -400, r: -13, delay: 0},
  {name: 'Meta', file: 'meta.png', x: 330, y: -330, r: 14, delay: 4},
  {name: 'Google Ads', file: 'googleads.png', x: -390, y: 10, r: 9, delay: 8},
  {name: 'Snapchat', file: 'snapchat.svg', x: 380, y: 35, r: -12, delay: 12},
  {name: 'WooCommerce', file: 'woocommerce.svg', x: -300, y: 385, r: -8, delay: 16},
  {name: 'TikTok', file: 'tiktok.png', x: 340, y: 400, r: 12, delay: 20},
  {name: 'Amazon', file: 'amazon.png', x: 15, y: -510, r: 7, delay: 24},
];

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

const PlatformCube: React.FC<{source: (typeof sources)[number]; index: number}> = ({source, index}) => {
  const frame = useCurrentFrame();
  const start = 72 + source.delay;
  const progress = interpolate(frame, [start, start + 42], [0, 1], clamp);
  const magnetic = easeOut(progress);
  const driftX = Math.sin((frame + index * 19) / 23) * 10;
  const driftY = Math.cos((frame + index * 13) / 27) * 12;
  const x = (source.x + driftX) * (1 - magnetic);
  const y = (source.y + driftY) * (1 - magnetic);
  const scale = interpolate(magnetic, [0, 0.72, 1], [1, 0.73, 0.05]);
  const opacity = interpolate(magnetic, [0, 0.85, 1], [1, 1, 0]);
  return (
    <div className="platform-wrap" style={{transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${source.r * (1 - magnetic)}deg)`, opacity}}>
      <div className="platform-cube">
        <div className="platform-shine" />
        <Img src={staticFile(`assets/${source.file}`)} alt={source.name} />
      </div>
    </div>
  );
};

const MainCube: React.FC<{final?: boolean}> = ({final = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 57, fps, config: {damping: 18, stiffness: 105, mass: 1}});
  const pulse = interpolate(frame, [150, 163, 180, 195, 210], [1, 1.045, 1, 1.025, 1], clamp);
  const finalScale = final ? interpolate(frame, [325, 352], [1, 0.82], clamp) : 1;
  const rotation = interpolate(frame, [57, 150, 330, 450], [-7, 1.5, -1, 1], clamp);
  return (
    <div className="main-cube-holder" style={{opacity: enter, transform: `translate(-50%, -50%) scale(${enter * pulse * finalScale}) rotate(${rotation}deg)`}}>
      <div className="cube-shadow" />
      <div className="main-cube">
        <div className="black-gloss" />
        <div className="edge-light" />
        <Img className="souq-icon" src={staticFile('assets/souqmetrics-icon.png')} />
        <div className="energy" style={{opacity: interpolate(frame, [145, 165, 205, 225], [0, .75, .45, 0], clamp)}} />
      </div>
    </div>
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
      <div className="metric-accent" />
      <div className="metric-value">{metric.value}</div>
      <div className="metric-label">{metric.label}</div>
    </div>
  );
};

export const SouqMetricsAd: React.FC = () => {
  const frame = useCurrentFrame();
  const final = interpolate(frame, [326, 360], [0, 1], clamp);
  const answersOpacity = interpolate(frame, [205, 225, 320, 340], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill className="canvas" style={{fontFamily}}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="stage" style={{transform: `translateY(${interpolate(final, [0, 1], [0, -220])}px)`}}>
        {sources.map((source, index) => <PlatformCube key={source.name} source={source} index={index} />)}
        <MainCube final={final > 0} />
        {metrics.map((metric, index) => <MetricCard key={metric.label} metric={metric} index={index} />)}
        <div className="answers-label" style={{opacity: answersOpacity}}>CLARITY, INSTANTLY.</div>
      </div>
      <div className="end-frame" style={{opacity: final, transform: `translateY(${interpolate(final, [0, 1], [34, 0])}px)`}}>
        <div className="eyebrow"><span />SOUQMETRICS</div>
        <h1>ONE SOURCE<br />OF TRUTH.</h1>
        <p>For your entire ecommerce business.</p>
        <div className="cta">Start free for 30 days <b>→</b></div>
      </div>
      <div className="grain" />
    </AbsoluteFill>
  );
};
