# Expert motion craft in After Effects, translated to code (Remotion / CSS / springs)

Evidence labels used throughout:
- **[DOC]** official documentation (Adobe, Remotion)
- **[EXPERT]** a recognised practitioner source (Dan Ebberts, School of Motion, Josh Comeau, ProVideo Coalition / Chris & Trish Meyer)
- **[PRACT]** a secondary tutorial site (rule-of-thumb level)
- **[INFERENCE]** my own derivation or synthesis. The writer should present it as a recommendation, not as a sourced fact.

Scope note: I made about 18 tool calls. Several sub-questions (anticipation %, squash amounts, camera shake values, kinetic-type timings, Flow preset numbers) have **no sourced numbers** in this pass. They are listed under Gaps rather than invented.

## 1. Graph editor: influence, asymmetric eases, why linear looks robotic, spatial vs temporal

### Takeaway
AE's default Easy Ease sets speed 0 and **33.33% influence** on both sides of a keyframe. That is a mild, symmetric S-curve that pros treat as a starting point, not a result. "Designed" motion comes from **higher and asymmetric influence**: a strong outgoing ease on the first key, a long incoming ease on the last key, with separate tuning per dimension. In code, an AE influence pair maps almost directly onto a cubic-bezier.

### Cited Findings
- [DOC] "After you apply Easy Ease, each keyframe has a speed of 0 with an influence of 33.33% on either side." Influence sets how far the keyframe reaches toward the previous keyframe (incoming) or the next one (outgoing). You set it in Animation > Keyframe Velocity, which has fields for incoming/outgoing Speed and Influence and a "Continuous" lock. Easy Ease In / Easy Ease Out also exist as one-sided variants. — [Adobe: Speed between keyframes](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html)
- [DOC] Roving keyframes exist only for spatial properties (Position, Anchor Point, effect control points). A keyframe can rove only if it is not the first or last keyframe. Each dot on a motion path is one frame. — [Adobe: Speed](https://helpx.adobe.com/after-effects/desktop/animate-in-after-effects/speed-between-keyframes/speed.html)
- [EXPERT] Graph types: the Value graph shows the property's actual value over time, and the Speed graph shows its rate of change. Default easy-ease keyframes are "rarely exactly what you need." SoM recommends learning to read curves before relying on presets, and recommends Flow for building a preset library. — [School of Motion: Graph Editor](https://www.schoolofmotion.com/blog/graph-editor-after-effects)
- [PRACT] Influence ranges and their feel:
  - **33–60%** on both ends: subtle UI or logo moves that stay close to linear.
  - **60–85%**: a more "designed" glide. Too high feels "floaty."
  - Polish pass: **50–70% outgoing on the first key and 60–80% incoming on the last key**.
  - If the move hangs too long at either end, lower the influence. If it feels abrupt, raise it.
  - — [Cursa: Smooth motion with easing and the Graph Editor](https://cursa.app/en/page/after-effects-for-absolute-beginners-smooth-motion-with-easing-and-the-graph-editor)
- [PRACT] Linear motion shows as a flat line in the Speed graph and "tends to feel robotic." For a snappy start with a soft landing, apply Ease Out to the first keyframe and Ease In to the last instead of Easy Ease on both. When Position uses Separate Dimensions, check X and Y curves for overshoot separately. A curved spatial path (Bezier handles in the Comp panel) can create a sense of overshoot even when values never exceed the target. — [Cursa](https://cursa.app/en/page/after-effects-for-absolute-beginners-smooth-motion-with-easing-and-the-graph-editor)
- [PRACT] Starting durations: small move **10–16 frames**, medium **16–24 frames**, large entrance **20–30 frames**. The source does not state the fps; read it as 24/30 fps. — [Cursa](https://cursa.app/en/page/after-effects-for-absolute-beginners-smooth-motion-with-easing-and-the-graph-editor)
- [EXPERT] Mt. Mograph Motion's Value Graph labels the peak value of any overshoot. Shift+drag locks speed at 0, and Cmd+drag mirrors in/out speed. The page gives no numeric influence guidance. — [Mt. Mograph Ease Influence](https://mtmograph.com/products/motion/tools/ease-influence)

### Inferences
- [INFERENCE] **AE to cubic-bezier mapping.** For a 1D move, keyframe A has speed 0 with outgoing influence `a`, and keyframe B has speed 0 with incoming influence `b`. That curve is approximately `cubic-bezier(a, 0, 1-b, 1)`:
  - AE default Easy Ease (33/33) ≈ `cubic-bezier(0.33, 0, 0.67, 1)`
  - "Pro" asymmetric (70 out / 90 in) ≈ `cubic-bezier(0.7, 0, 0.1, 1)`
  - Strong ease-out only (0 out / 85 in) ≈ `cubic-bezier(0, 0, 0.15, 1)`
  - Use in Remotion as `interpolate(frame,[0,20],[0,1],{easing: Easing.bezier(a,0,1-b,1), extrapolateLeft:'clamp', extrapolateRight:'clamp'})`.
  - This is the standard way Flow-type tools translate curves, but I did not verify it against Flow's own docs in this pass.
- [INFERENCE] "S-curve vs exponential":
  - Symmetric S (Easy Ease, `Easing.inOut`) gives equal acceleration and deceleration. It reads as mechanical and "presentation-like."
  - Exponential / quint ease-out (`Easing.out(Easing.exp)`, `Easing.out(Easing.poly(5))`) covers most of the distance in the first 20–30% of the time, then settles for a long time. Pros use this for entrances: fast out, slow in.
  - For exits, reverse it: ease-in only, shorter duration.
- [INFERENCE] Separate dimensions in code means animating X and Y with **different easings or durations** (for example, X with a long ease-out and Y with a slightly earlier finish or a small overshoot). The resulting path is an arc, not a straight line. Straight-line diagonals are a robotic tell. The AE equivalent is a curved spatial path.

### Gaps
- No primary source found for the exact feel of 90/100% influence. Practitioner consensus is that it gives "very long tail, near-instant start," but that is unsourced.
- Flow's preset bezier numbers (Expo, Quint) were not retrieved from aescripts docs. Widely circulated easings.net values exist (easeOutExpo ≈ cubic-bezier(0.16, 1, 0.3, 1), easeOutQuint ≈ cubic-bezier(0.22, 1, 0.36, 1)), but I recall them from memory and did not fetch them. Verify at easings.net before quoting.

## 2. Concrete recipes: overshoot, inertial bounce, bounce-back, springs

### Takeaway
The canonical AE overshoot is Dan Ebberts' **velocity-driven exponentially decaying sine**: amp = incoming velocity / (2π·freq), freq ≈ 3, decay ≈ 5. The popular "inertial bounce" preset uses amp 5, freq 2, decay 4. A real bounce, as opposed to an overshoot, is a sequence of shrinking parabolas (elasticity 0.7, gravity 5000, max 9 bounces). In Remotion the natural translation is `spring()`. Its default damping 10 / stiffness 100 / mass 1 is quite bouncy. Raise damping for "premium" UI.

### Cited Findings
- [EXPERT] Dan Ebberts on overshoot:
  - The overshoot is a sine wave multiplied by amp and divided by an exponential (`Math.exp(decay*t)`), i.e. constant frequency with decaying amplitude. Example values are amp 80, freq 1, decay 1 in the basic version, and **freq 3, decay 5** in the overshoot versions.
  - The key is that the overshoot amplitude must **match the incoming velocity**: amp = v / (freq·2π). Higher frequency gives a smaller overshoot. For a bigger overshoot, increase the incoming velocity or lower the frequency.
  - The keyframe version reads `velocityAtTime(key.time - .001)`.
  - — [motionscript.com: Bounce and Overshoot](http://www.motionscript.com/articles/bounce-and-overshoot.html)
- [EXPERT] Dan Ebberts on bounce-back: a bounce loses energy per impact, so amplitude **and** period shrink. A sine wave is wrong here, and he warns against `Math.abs(sin)` with a keyframed frequency. Each segment is a parabola, with `e = .7` (elasticity), `g = 5000` (gravity), `nMax = 9` (max bounces), and segment duration `2*v/g`. It works on Scale, Position (2D/3D) and Rotation. — [motionscript.com](http://www.motionscript.com/articles/bounce-and-overshoot.html)
- [EXPERT] The Animoplex "Inertial Bounce" expression uses `amp = 5.0, freq = 2.0, decay = 4.0`. It applies to any property with two keyframes and is driven by velocity. Amp is intensity, freq is bounces per second, and decay is how fast the bounce fades. It is credited to an original at graymachine.com. — [Animoplex gist](https://gist.github.com/animoplex/aafd6a157282351c8dfeea385d969ef2)
- [DOC] Remotion `spring()`:
  - Defaults: `mass 1, damping 10, stiffness 100, overshootClamping false`.
  - To reduce bounce, increase damping. Lower mass makes it faster.
  - `durationInFrames` stretches the curve to an exact length. With `durationRestThreshold`, e.g. 0.001, the spring reaches 99.9% of the way in that many frames.
  - `delay` is in frames.
  - Order of operations: stretch, then reverse, then delay.
  - The function is adapted from React Native Reanimated 2.
  - — [Remotion spring](https://www.remotion.dev/docs/spring)
- [EXPERT] Josh Comeau on spring parameters: stiffness (tension) means snappier and bouncier. Damping (friction) means less bouncy, and high damping gives a smooth non-bouncing settle. Mass means slower with more inertia. His sandbox default is mass 1.75, tension 200, friction 12. Springs "do a better job tricking our brains" than Béziers, which are limited to two control points. CSS `linear()` can approximate a spring with many points, but it is "not quite as good." — [Josh Comeau: Friendly intro to spring physics](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)
- [DOC] Remotion `Easing`:
  - Available functions: `bezier(x1,y1,x2,y2)`, `in/out/inOut`, `elastic(bounciness)` (default 1; 0 means no overshoot, N > 1 overshoots about N times), `back(s)` (pulls backward before moving, i.e. a built-in anticipation), `bounce`, `exp`, `poly(n)`, `quad`, `cubic`, `circle`, `sin`.
  - Docs example: `Easing.bezier(0.5, 0.01, 0.5, 1)`.
  - — [Remotion Easing](https://www.remotion.dev/docs/easing)

### Inferences
- [INFERENCE] **Premium pop-in recipe** at 30 fps, synthesised from the above:
  - Scale 0 → 1, 12–18 frames, with a single visible overshoot of about 5–10% (peak ≈ 1.05–1.10).
  - Opacity 0 → 1 over the first 4–6 frames only. It must not fade for the full duration, or the move feels mushy.
  - In Remotion: `spring({frame: frame - delay, fps, config:{damping: 14, stiffness: 180, mass: 0.8}})`.
  - Mapping to AE feel:
    - damping ≈ 8–10 ≈ inertial bounce with 2+ visible wobbles (amp 5 / freq 2 / decay 4)
    - damping ≈ 14–18 ≈ one overshoot (Ebberts freq 3 / decay 5)
    - damping ≥ 26 or `overshootClamping:true` ≈ pure exponential ease-out
  - These damping-to-feel equivalences are my estimate. Validate by rendering.
- [INFERENCE] Ebberts' formula explains why an AI-style "bounce on everything" looks fake. The overshoot should **scale with arrival speed**: fast arrivals overshoot, slow arrivals barely do. A spring driven from the actual distance and velocity does this automatically. A fixed `Easing.elastic` does not.
- [INFERENCE] **Anticipation in code** comes in two forms:
  - `Easing.back(s)`, which is CSS-like back-in.
  - An explicit 3-key interpolate, e.g. `interpolate(frame,[0,6,20],[0,-0.08*dist,dist])`. That is a pullback of about 5–10% of travel over about 4–8 frames, then the main move with a strong ease-out.
  - The pullback amount and frame count are a practitioner range from animation-principles literature. They are not sourced in this pass.
- [INFERENCE] **Follow-through / overlap**: drive child layers with the same spring but `delay` 1–3 frames each, plus slightly lower damping on the children, so they settle after the parent. That reproduces "drag" and successive breaking of joints.

### Gaps
- Exact anticipation %, squash & stretch amounts for UI or text, and rotation-wobble values: no primary source retrieved.
- No sourced value table for wiggle restraint (e.g. `wiggle(1–2, 3–10)` for subtle drift). I found no sources for this in this pass.
- Motion v4 / EaseCopy documentation was not fetched.

## 3. Motion blur: shutter angle, phase, samples, and code equivalents

### Takeaway
AE's 180° shutter angle with **-90° phase** centres the blur on the current frame. That matches film (1/48 s at 24 fps). Blur length depends on fps, so the same angle blurs more at 24 fps. Pros use realistic blur for realism or live-action compositing, and skip it or replace it with smears/trails for stylised work and for readable text. Remotion's `<CameraMotionBlur>` defaults to shutterAngle 180 with 10 samples.

### Cited Findings
- [EXPERT] Shutter settings:
  - 180° is the typical film setting.
  - Since CS3, the default shutter phase is minus half the angle (-90 for 180), so subframes straddle the current frame. Pre-CS3 the phase was 0 and trails went forward only.
  - Samples Per Frame controls 3D layers, shape layers and some effects. The old value was 16 and the newer maximum is 64.
  - Adaptive Sample Limit controls 2D layers, with an upper limit of 256.
  - Moving to 24 fps with the same angle can make trails about 2–2.5× longer than interlaced video.
  - Heavy blur reduces text readability, so tune per project.
  - Shooting 24p at 1/48 s simulates film.
  - — [ProVideo Coalition: Motion blur](https://www.provideocoalition.com/motion_blur/)
- [EXPERT] School of Motion on when to use blur:
  - Use realistic blur for realism or for compositing into live action (RSMB is suggested for 3D/realistic work).
  - Skip it for stylised or stop-motion looks, or when it hides detail: in a bouncing-ball example, blur obscured the contact moment and weakened the sense of weight.
  - Stylised alternatives: **smear frames, multiples, motion trails** (Cartoon Moblur, Super Lines, Speed Lines).
  - The article gives no numeric shutter values.
  - — [School of Motion: Should you use motion blur?](https://www.schoolofmotion.com/blog/motion-blur-after-effects)
- [DOC] Remotion `<CameraMotionBlur>`:
  - Props: `shutterAngle` (default 180) and `samples` (default 10, recommended 5–10).
  - It renders frames at time offsets and averages them. Higher fps means less blur at the same angle.
  - The docs cite 90° and 180° as common film values.
  - Children must be absolutely positioned (`<AbsoluteFill>`).
  - The technique is **destructive to colours**, so keep samples low.
  - — [Remotion CameraMotionBlur](https://www.remotion.dev/docs/motion-blur/camera-motion-blur)
- [DOC] Remotion `<Trail>`: props are `layers` (int), `lagInFrames` (float) and `trailOpacity` (max opacity; the lowest layer is 0). The example uses `layers={50} lagInFrames={0.1} trailOpacity={1}`. — [Remotion Trail](https://www.remotion.dev/docs/motion-blur/trail)
- [DOC] Common mistake: calling `useCurrentFrame()` in a parent outside the blur wrapper breaks the effect, because these components manipulate the time context. Put the animated logic in a child component rendered inside the wrapper. — [Remotion: common mistake](https://www.remotion.dev/docs/motion-blur/common-mistake)

### Inferences
- [INFERENCE] **Velocity-based directional blur (cheaper than CameraMotionBlur):**
  - Compute per-element velocity as `v = value(frame+0.5) - value(frame-0.5)` in px/frame.
  - Set blur length L = |v| × (shutterAngle/360).
  - Apply it as a directional blur along the motion vector. CSS has no native directional blur, so approximate it with an SVG `feGaussianBlur stdDeviation="L/2 0"` rotated to the motion angle, or with a slight scaleX stretch along the direction of travel.
  - Clamp L to 0 when |v| < ~1 px/frame so resting text stays sharp. That handles SoM's "blur hurts readability" point.
- [INFERENCE] At 24/30 fps, use 180° for photographic realism and 90–120° when text must stay legible. Use none or smears for flat, graphic or cel looks.
- [INFERENCE] It is unclear whether Remotion's `<CameraMotionBlur>` centres samples (AE -90° phase) or trails backward. Check the source before claiming equivalence (see Gaps).

### Gaps
- CC Force Motion Blur parameters (shutter samples, wire-frame quality) and RSMB settings were not retrieved.
- I did not verify whether Remotion's CameraMotionBlur samples are centred on the frame or lag behind it.

## 4. Typography animation

### Takeaway
AE's per-character craft lives in Text Animators with a **Range Selector**: Based On characters/words/lines, a Shape, **Ease High / Ease Low (-100..100%)**, Offset, Randomize Order, and a Wiggly selector whose Correlation controls sync. The code translation is per-glyph staggered springs with an index-based delay, plus an easing on the per-character ramp.

### Cited Findings
- [DOC] Range Selector:
  - Units can be % or index.
  - Based On: characters (spaces count, so the animation pauses between words), characters excluding spaces, words, or lines.
  - Shape: Square, Ramp Up, Ramp Down, Triangle, Round, Smooth. Smoothness applies to Square.
  - **Ease High / Ease Low**: range -100% to 100%, controlling speed of change from fully selected to excluded. Higher values ease gradually, and -100% changes quickly.
  - Mode defaults to Add.
  - Amount: 0% means no effect and 50% means half.
  - Randomize Order, with a Random Seed (0 means order based on the animator group).
  - — [Adobe: Animating text](https://helpx.adobe.com/after-effects/using/animating-text.html)
- [DOC] Wiggly Selector: Max/Min Amount, Wiggles/Second, **Correlation** (100% means all characters wiggle together, 0% means independently), Temporal/Spatial Phase, Lock Dimensions. — [Adobe: Animating text](https://helpx.adobe.com/after-effects/using/animating-text.html)

### Inferences
- [INFERENCE] **Remotion per-character recipe:**
  - Split the text into spans and give each a delay of `i * stagger`. Use stagger ≈ 1–2 frames per character at 30 fps (33–66 ms), consistent with the prior research's 50–100 ms for larger elements.
  - Each span: `translateY` from 40–60% of the line height to 0, plus opacity, on a spring with damping ~15–20.
  - Wrap each line in `overflow:hidden` for a **mask reveal** (text rises from behind a baseline).
  - Base the stagger on words, not characters, for long lines. That is the AE "Based On: Words" equivalent.
- [INFERENCE] Tracking animation: animate letter-spacing from wide (e.g. 0.3em) to final with a long ease-out (exp/quint) over 30–60 frames. Pair it with opacity. In AE this is the Tracking Amount animator.
- [INFERENCE] Randomize Order with a seed corresponds to shuffling the delay indices with a seeded PRNG (Remotion's `random(seed)`).

### Gaps
- No sourced timings for kinetic type: reading holds, per-word durations, best-practice stagger in AE frames. Jake Bartlett's Skillshare class exists ([Skillshare](https://www.skillshare.com/en/classes/the-ultimate-guide-to-text-animators-in-adobe-after-effects/1141129555)) but is paywalled and not retrieved.
- No numeric AE defaults for Range Selector properties were found on the Adobe page.

## 5. Camera, transitions, smears, and robotic tells

### Takeaway
I found no sourced numbers in this pass for AE camera easing, depth of field, camera-shake values, or match-cut and morph timing. Smear frames and trails are documented as the stylised alternative to realistic blur. The "robotic tells" list is well supported indirectly: SoM's "easy ease rarely what you need," linear reading as robotic, overshoot matching velocity (Ebberts), and blur hiding the contact moment (SoM).

### Cited Findings
- [EXPERT] Smear frames, multiples and motion trails are named as stylised alternatives to realistic motion blur. Tools: Cartoon Moblur, Super Lines, Speed Lines (aescripts). — [School of Motion](https://www.schoolofmotion.com/blog/motion-blur-after-effects)
- [PRACT] Smear-frame references (not fetched in depth): [Bloop Animation: The Art of Smear Frames](https://www.bloopanimation.com/the-art-of-smear-frames/), [Motion Design School: smears with Echo](https://motiondesign.school/blog/smears-with-echo-effect/), [Battle Axe Schmeeer](https://help.battleaxe.co/freebies/schmeeer)
- [PRACT] Linear motion "tends to feel robotic." — [Cursa](https://cursa.app/en/page/after-effects-for-absolute-beginners-smooth-motion-with-easing-and-the-graph-editor); default easy ease is "rarely exactly what you need" — [School of Motion](https://www.schoolofmotion.com/blog/graph-editor-after-effects)

### Inferences
- [INFERENCE] **Robotic tells and their fixes.** This is a synthesis; each item is tied to a sourced principle where one exists:
  1. **Same start frame for everything.** Fix: stagger with delays and hierarchy. Hero first, supporting elements 2–4 frames later, details last.
  2. **Same duration everywhere.** Fix: scale duration with distance and size (the 10–16 / 16–24 / 20–30 frame bands above).
  3. **Linear, or symmetric Easy Ease 33/33.** Fix: asymmetric ease (strong ease-out on entrances, 60–85% incoming influence).
  4. **Overshoot that doesn't scale with speed.** Fix: velocity-matched springs (Ebberts).
  5. **No holds.** Fix: let the key moment rest (prior research: 6 frames minimum, 12 to read).
  6. **Bounce on everything.** Fix: reserve overshoot for the hero element. Use clamped ease-outs elsewhere.
  7. **Straight-line diagonals.** Fix: give X and Y different curves to make arcs.
  8. **Blur on text at rest, or on hard contacts.** Fix: velocity-gated blur.
- [INFERENCE] **Smear frame in code:** for 1–2 frames at peak velocity, apply `scaleX(1 + k·|v|)` along the motion direction (k chosen so the stretch is ~1.2–1.5×), or use Remotion `<Trail>` with few layers (3–6) and a small lagInFrames. The `<Trail>` parameter choice is my inference.
- [INFERENCE] **Camera shake done right** (unsourced practitioner convention): low-frequency wiggle on position (≈1–3 Hz, a few px) plus a separate small rotation wiggle, decaying after an impact. Avoid uniform high-frequency noise.

### Gaps
- Camera in AE: 2.5D parallax ratios, DOF settings, camera easing values. Not researched in this pass (tool budget).
- Match cuts, shape morphs and eased wipes: no sourced timing data.
- Animator's Survival Kit summaries and Rachel Nabors material were not retrieved.
