# Motion design craft: timing, kinetic typography, transitions, and the reasoning of top studios

Scope note: this pass leaves out Material 3 / Apple spring numbers, Val Head durations, Tim Smith eye-tracking, Kyle Cooper and Deakins, which an earlier pass covered. Frame conversions: 24 fps means 1 frame = 41.7 ms. 30 fps means 1 frame = 33.3 ms. Each claim is labelled EVIDENCE (measured or study-based), RULE (a codified industry or house standard) or OPINION (a practitioner heuristic or critic's view).

## 1. Classical animation timing (Disney's 12 principles, Thomas & Johnston, Williams) as concrete frames

### Takeaway
The classical canon gives meaning-by-frame-count tables more than fixed durations. 0–4 in-betweens map to distinct "reads". A hold needs at least about 6 frames, and an expression needs 12–18 frames to read. Animate on twos by default and on ones for fast moves and camera moves. Even 1–2 frames of anticipation changes the feel. For motion graphics at 24/30 fps, these frame counts carry over almost unchanged.

### Cited Findings
- RULE (Thomas & Johnston, *The Illusion of Life*, as quoted). The number of in-betweens between two extremes changes the meaning. 0 = a head snapped by a huge force. 1 = hit by an object. 2 = a nervous tic. 3 = dodging an object. 4 = a crisp, urgent order. — [fullfrontal.moe, Animation fundamentals: timing and spacing](https://fullfrontal.moe/animation-fundamentals-timing-and-spacing/)
- RULE. Timing (number of frames) is objective and can be measured. Spacing (distance between drawings) sets the rhythm and is relative. The two can't be separated: more in-betweens means closer spacing. — [fullfrontal.moe](https://fullfrontal.moe/animation-fundamentals-timing-and-spacing/)
- RULE. On ones = 24 drawings/s. On twos = 12/s. On threes = 8/s. On fours = 6/s. Ones and twos are "full animation"; anything slower is "limited". Anime like Imaishi's mixes 3s with bursts of 2s and uses wide spacing for energy. — [fullfrontal.moe](https://fullfrontal.moe/animation-fundamentals-timing-and-spacing/)
- RULE. Twos are used most of the time. Ones are used for camera moves (trucks, pans) and for subtle or quick dialogue. — [Brian Lemay, Timing](https://brianlemay.com/Pages/animationschool/animation/lipsyncbook/timing.html)
- RULE / OPINION (Lemay):
  - Avoid holds of 2–5 frames. Three frames is "very rare". Six frames is the minimum hold.
  - About 12 frames (0.5 s) is enough for a facial expression to read. 16–18 frames is better. 24+ frames works only for comedy.
  - Chuck Jones's Coyote fall used a 14-frame pause: 12 frames was too short and 20 too long.
  - For long holds, use a "moving hold" so the line keeps a slight movement.

  — [Brian Lemay](https://brianlemay.com/Pages/animationschool/animation/lipsyncbook/timing.html)
- RULE (Lemay timing guide: frames per step or cycle):
  - 2s: vibrations and staggers.
  - 4s: a very fast run or a fast "no" head shake.
  - 6s: a fast run.
  - 8s: a normal run.
  - 12s: a march.
  - 16s: a walk with attitude.
  - 18s: a deliberate walk.
  - 24s: a slow, tired walk or a sneak.
  - Picking up a pencil takes 3 drawings as a "fast swish" or about 24 frames done realistically.

  — [Brian Lemay](https://brianlemay.com/Pages/animationschool/animation/lipsyncbook/timing.html)
- OPINION (Mariel Cartwright, GDC, via Animator Island). "Even one frame of anticipation is enough to make a difference." Try "a frame or two" of anticipation on any movement. — [Animator Island, 10 Second Tip: Always Anticipate](https://www.animatorisland.com/?p=4041)
- UNVERIFIED. A reader comment on that page credits *The Animator's Survival Kit* with "anything under 4 frames doesn't read", hedged with "I think". The author gives no source. — [Animator Island](https://www.animatorisland.com/?p=4041)
- OPINION (Andreas Hykade's "magic of 8"). Build timing on spans of 8 frames: keys on frames 1 and 9, breakdown on frame 5, quarters on 3 and 7. A 6-frame span (middle on frame 4) works for slower motion. Spans of 6 and 8 combine cleanly because 4×6 = 3×8 = 24. — [Animator Island, The Magic of 8](https://www.animatorisland.com/?p=2034)
- OPINION (invideo FAQ, unnamed source). Offset one axis's scale keyframes by 1–2 frames from the other to fake squash and stretch. 1 frame reads as light and snappy; 2 frames as heavier and softer. Add overshoot keys and decay. — [invideo FAQ](https://invideo.io/faq/why-does-staggering-width-and-height-keyframes-by-12/)

### Inferences
- Remotion cheat sheet at 30 fps (24 fps values in parentheses):
  - Anticipation: 2–4 f (2–3).
  - Main move for a "crisp order" read: about 4–8 f.
  - Overshoot and settle: 4–8 f.
  - Minimum hold: 6 f.
  - Hold for something to read (a logo or a face): 15–20 f (12–18).
  - Comic or dramatic pause: about 14–20 f, after Jones's 14 f at 24 fps.
- Animating "on twos" in Remotion means quantising the frame, e.g. `Math.floor(frame/2)*2`. This gives a hand-made, less "software" texture, which fits ManvsMachine's "never look like it came from a computer" goal (section 4). Use ones for camera moves and whip pans so they don't stutter.
- Hykade's 8-frame grid works as a rhythm unit at 24 fps: 8 f = 1/3 s, which locks to 90 BPM beats every 2 units. At 30 fps, a 10 or 15 f grid aligns better with 120 BPM (a beat every 15 f).

### Gaps
- I could not verify direct Williams page-level numbers this pass (his "slow in/slow out halving" charts, or "the timing is the number of frames"). The full book text exists on archive.org but I didn't fetch it. Use the classical ease-chart rule of progressive halving of spacing toward a key only as general knowledge, not as a cited figure.
- I found no reliable source for "X frames of overshoot" or "follow-through lags by N frames" as fixed numbers. The canon treats these as relative to mass.

## 2. Motion graphics translation: graph editor, easing, "premium vs cheap"

### Takeaway
The consensus from School of Motion and Mt. Mograph tools is that default easy-ease is "rarely what you need". Craft lives in shaping the in-between with the value or speed graph. In SoM's examples, sharp bursts, overshoot before settling and bounces come from curve shaping, not presets. "Cheap" usually means default curves, everything starting at once, and no hierarchy in the order of motion.

### Cited Findings
- RULE / OPINION (School of Motion):
  - Default easy-ease keyframes are "rarely exactly what you need." Control the in-between: "If you're looking to bring an illusion of life, you need the ability to control what happens between the keyframes."
  - The value graph shows the property value. Use it to shape movement such as bounces.
  - The speed graph (scaled 0–100) shows velocity. Use it to fine-tune timing, e.g. time remaps.
  - Examples: a burst of speed with an immediate stop; text that overshoots its position before settling.

  — [School of Motion, Graph Editor in After Effects](https://www.schoolofmotion.com/blog/graph-editor-after-effects)
- RULE (Mt. Mograph Motion docs). Read the speed graph left to right: speed leaving the first key, easing into the second. When speed values are included, curves can go negative, which produces overshoot (the layer passes its target). — [Mt. Mograph, Speed Graph](https://motion.mtmograph.com/m-screens/easing/speed-graph)
- OPINION (ManvsMachine's Mike Alderson):
  - "we never want something to look like it's come from a computer."
  - The best compliment is someone calling the work "really good" without asking what software made it.
  - Early motion design "was graphic design with a timeline."

  — [Clever podcast ep. 164](https://www.cleverpodcast.com/blog/ep-164-mike-alderson)
- OPINION (Ryan Honey, Buck). For portfolios: "if we don't see that everything is thought of down to the T, we get turned off." — [School of Motion podcast, Studio Ascended](https://www.schoolofmotion.com/podcast/studio-ascended-buck-cofounder-ryan-honey-som-podcast)

### Inferences
- In Remotion, avoid a single global `Easing.ease` or `inOut(ease)` on every element. Give each motion its own curve:
  - Entrances: strong ease-out, e.g. `Easing.bezier(0.16,1,0.3,1)` (expo-out).
  - Exits: ease-in and faster than the entrance.
  - Accents: overshoot (`Easing.back` or a spring).
  This applies SoM's "custom curve" advice. The bezier values are my own suggestion, not sourced.
- The "premium" signals are inferred from the sources above plus section 3: few elements moving at a time, staggered order that follows hierarchy, asymmetric curves (fast out, long settle), and holds long enough to read.

### Gaps
- I didn't retrieve School of Motion's specific "12 principles for motion design" article, or teaching from Ben Marriott, Jake Bartlett or Andrew Kramer, in quotable form. No numeric "premium vs cheap" checklist from those authors was verified.

## 3. Stagger, kinetic typography and reading speed

### Takeaway
Two regimes apply.
- Readable text (subtitles or explanatory copy) has to respect reading-speed norms:
  - Ofcom: 160–180 wpm maximum; above 200 wpm is hard to follow.
  - BBC R&D: about 175 wpm felt "right"; 230 too fast; 115 too slow.
  - Netflix: at least 5/6 s (20 f at 24 fps) and at most 7 s per event, max 2 lines.
- Rhythmic one-word kinetic type (Apple "Don't Blink") can run at about 5–7 frames per word (≈0.2 s, ~300 wpm), but only with 1–2 syllable words shown one at a time.

For a stagger between items, web practice is 50–100 ms per item, with more than 150 ms feeling sluggish and whole sequences kept under 1–2 s.

### Cited Findings
- EVIDENCE / RULE (BBC R&D, citing Ofcom):
  - Ofcom's maximum is 160–180 wpm, and above 200 wpm is "difficult for many viewers."
  - In a prior study, 145 wpm was the preferred rate. 9% found 170 wpm too fast, rising to 28% at 200 wpm.
  - In BBC R&D's own test (24 clips, 90–230 wpm), about 230 was too fast, about 115 too slow, and about 175 "about right".
  - Content pace matters: fast real-world clips were still rated acceptable.

  — [BBC R&D, How fast should subtitles be? (mirror)](https://bbcbreakingnews.pages.dev/rd/blog/2015-09-how-fast-should-subtitles-be)
- RULE (Netflix Timed Text Style Guide, General Requirements). Minimum 5/6 s per subtitle event (20 frames at 24 fps); maximum 7 s; at most 2 lines; one line where possible. — [Netflix Partner Help](https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617-Timed-Text-Style-Guide-General-Requirements)
- OPINION (open-design.ai). There is no universal seconds-per-word rule. Measure the "stable window", from when text has fully arrived until it starts to leave, and compute wpm = words ÷ stable seconds × 60. Shortening entrances and exits lengthens the readable hold without changing scene length: halving a 1 s in and 1 s out on a 4 s scene gives +50% hold. — [open-design.ai, On-screen text duration](https://open-design.ai/blog/on-screen-text-duration/)
- EVIDENCE (frame count) and OPINION (analysis) on Apple's "Don't Blink" (2016, 107 s, iPhone 7 event recap, studio anonymous):
  - Words are almost all 1–2 syllables and appear one at a time, for 5–7 frames at 29.97 fps each (≈0.2 s). The author relates this to roughly 300 wpm adult reading speed.
  - Lessons: animate at the speed of perception; make type act out its meaning ("re-engineered"); use time as a character by varying pace, with a sudden stop and a doorbell for AirPods; stay in 2D and break into z-space only once, for a laugh.
  - A commenter corrected the article's arithmetic to 0.2 s, not 0.02 s.

  — [Motionographer, 4 ways "Don't Blink" is a masterclass of type and rhythm](https://motionographer.com/2016/09/14/4-ways-dont-blink-is-a-masterclass-of-type-and-rhythm/)
- OPINION / RULE (SVGator):
  - Standardise offsets in 50–100 ms increments. Gaps over 150 ms feel sluggish. Load sequences should stay under 1–2 s.
  - Order by hierarchy: key content first (or last), supporting content in the middle, decorative content last or never.
  - Shared timing signals grouping; different timing separates groups. Follow reading direction.

  — [SVGator, Offset and delay in motion design](https://www.svgator.com/blog/offset-delay-motion-design/)

### Inferences
- Frame conversions:
  - Stagger: 50–100 ms = 1.5–3 f at 30 fps, or 1–2.5 f at 24 fps. A per-word stagger of 2–3 f is a safe default. Per-letter stagger should be smaller, around 1 f.
  - Reading time for subtitle-style captions: 175 wpm ≈ 2.9 words/s ≈ 10 f per word at 30 fps. Upper limit 180 wpm ≈ 10 f/word; floor 20 f per caption block.
  - One-word "punch" type: 5–7 f per short word is the proven Apple tempo. Words of 3+ syllables, numbers and brand names need more.
- Social reels are often watched muted on a small screen, so "Don't Blink"-style speed suits hooks and rhythm sections. Key claims and CTAs need a hold of at least 20–30 f after entry is complete (the stable window).
- Spanish words are on average longer than English. Expect to need about 10–20% more time per word than English-derived numbers suggest. This is my inference; I found no source.

### Gaps
- I found no peer-reviewed study on reading speed for animated one-word (RSVP-style) type in social video specifically. RSVP literature exists but wasn't retrieved.
- I didn't retrieve Netflix's per-language characters-per-second values (e.g. 17 cps adult / 13 cps children for English) from the primary page this pass, so treat those as unverified.

## 4. Transitions and studio process (Buck, ManvsMachine and others)

### Takeaway
Studio voices say a transition feels motivated when it carries continuity across the cut through similar composition or momentum (Holmedal's "fractured flow"). In their process, clarity of design, lighting and composition comes first, and execution "garnish" comes later. ManvsMachine admits concepts are often found by experimenting and then "post-rationalized" to fit the brief. Buck stresses collaborative ideation and polish down to the last detail.

### Cited Findings
- OPINION (Simon Holmedal, ManvsMachine):
  - On their edit: it "uses match cutting over similar compositions and/or momentum to carry the edit and bridge the shots", which he calls "fractured flow."
  - "if you find clarity early on, it often informs most of the problems you encounter later on."
  - "Be as clear as you can with stuff like lighting, shading and composition (everything)… This is the way you can get away with more abstract executions."
  - Don't "get too distracted with execution (garnish) until the foundation is in place."

  — [Motionographer interview](https://motionographer.com/2016/05/02/interview-man-vs-machines-simon-holmedal/)
- OPINION (Mike Alderson, ManvsMachine):
  - "thinkers who make and makers who think." The process is described as sculpting, not linear: ideas, storyboard, animate.
  - "concept… can mean something that you accidentally made". "post-rationalizing is a huge part of what we do."
  - "the key to winning pitches is creating the most concise pitch." "We put the product front and center, make it the star."
  - "We don't always believe there has to be a beginning, middle, end."

  — [Clever podcast ep. 164](https://www.cleverpodcast.com/blog/ep-164-mike-alderson)
- OPINION (Ryan Honey, Buck):
  - A studio model rather than a director model.
  - Talent from several offices "jams on ideas" for pitches.
  - "the creative is number one."
  - Personal projects are treated as marketing spend.

  — [School of Motion podcast](https://www.schoolofmotion.com/podcast/studio-ascended-buck-cofounder-ryan-honey-som-podcast)

### Inferences
- A practical rule for reels: a transition is motivated if at least one of these carries across the cut:
  - (a) shape or position: match cut on a similar silhouette at the same screen spot;
  - (b) direction and velocity: momentum or a whip that continues the motion vector;
  - (c) colour or value;
  - (d) meaning: type that acts out its word.
  If none carries across, use a hard cut instead.
- In Remotion, momentum matching means the outgoing element's final velocity (px/frame) should match the incoming element's initial velocity. Use ease-in on the outgoing element and ease-out on the incoming one, with a motion-blur or whip of about 4–8 f that peaks at the cut. This is my inference from Holmedal's principle; the frame count is not sourced.

### Gaps
- I didn't retrieve quotable process interviews from Ordinary Folk, Gunner, Golden Wolf or Oddfellows in this pass.
- I found no studio source giving style-frame or animatic counts or timelines.

## 5. Gestalt, leading lines and Japanese "ma" in motion; Apple motion language

### Takeaway
"Ma" (間, "gap, space, pause") treats emptiness and intervals as active elements. Miyazaki explicitly defends intentional pauses: without them, action becomes "just busyness," and tension can't build. In motion, ma means holds and empty frames placed on purpose. In "Don't Blink", Apple-style motion pairs very fast one-word type with time used as a character: tempo changes, a sudden full stop, and depth used only once.

### Cited Findings
- RULE (definition):
  - Ma = "gap, space, pause": empty space as important as the rest of the work, or the perceived interval.
  - Alan Fletcher: the interval "gives shape to the whole."
  - Miyazaki (Ebert, 2012): "It's called ma. Emptiness. It's there intentionally." Non-stop action without breathing space is "just busyness". Pauses let tension grow, while constant tension numbs. He illustrated ma as the time between hand claps.

  — [Wikipedia, Ma (negative space)](https://en.wikipedia.org/wiki/Ma_(negative_space))
- OPINION (Motionographer on Apple's "Don't Blink"):
  - Percussion-driven build to a crescendo, then a sudden stop with a doorbell chime for AirPods.
  - Pacing varied so the piece doesn't tire viewers.
  - Nearly all 2D, with one move into z-space.

  — [Motionographer](https://motionographer.com/2016/09/14/4-ways-dont-blink-is-a-masterclass-of-type-and-rhythm/)
- OPINION (SVGator, Gestalt-adjacent): shared timing groups elements and different timing separates them, which applies common fate in time. — [SVGator](https://www.svgator.com/blog/offset-delay-motion-design/)

### Inferences
- Applying ma in a reel:
  - After a dense rhythm section, put in a full-stop hold of 15–30 f on a near-empty frame before the key line or reveal. Contrast makes the beat land.
  - Don't animate every element constantly.
  - Use holds of at least 6 f as punctuation.
- Gestalt common fate: elements that start together with the same curve read as one group. To separate a headline from its supporting text, change both the offset (a delay) and the curve.

### Gaps
- I found no rigorous, sourced analysis of Apple's keynote and product-film motion language (slow reveals, light sweeps, minimal type). The search results I found were SEO and marketing blogs (youmind, motion.so), which I left out as low quality.
- I didn't source Gestalt-plus-leading-lines guidance specific to motion frames.
