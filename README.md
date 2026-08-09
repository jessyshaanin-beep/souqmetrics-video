# SouqMetrics vertical ad

A 15-second, 1080×1350 Remotion composition at 30fps. All motion is deterministic and driven by the Remotion timeline.

## Preview

```bash
npm install
npm start
```

Open the Studio URL and select **SouqMetricsVerticalAd**. The project intentionally does not include a rendered MP4 so the first version can be reviewed in Studio.

## 3D preview checkpoints

The composition uses React Three Fiber through `@remotion/three`. Review these frames before rendering the final MP4:

```bash
npx remotion still src/index.ts SouqMetricsVerticalAd preview-stills/early.png --frame=60
npx remotion still src/index.ts SouqMetricsVerticalAd preview-stills/absorption.png --frame=105
npx remotion still src/index.ts SouqMetricsVerticalAd preview-stills/post-processing.png --frame=265
npx remotion still src/index.ts SouqMetricsVerticalAd preview-stills/final.png --frame=410
```
