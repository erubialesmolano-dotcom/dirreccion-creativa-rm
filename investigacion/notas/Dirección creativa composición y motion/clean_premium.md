# Clean / premium vs amateur: visual finish and design system for video, motion graphics and edits

Evidence labels: [EVIDENCE] = standard, spec or measured research; [PRACTITIONER] = practitioner or critic opinion; [INFERENCE] = my reasoning, not sourced. Scope: typography, layout, color, finishing/export, AI tells, restraint. Cut techniques and AE easing are covered by another researcher.

## 1. Typography for video (hierarchy, tracking, leading, weights, captions, phone legibility, contrast, text on images)

### Takeaway
"Premium" type in video means few faces and weights, tracking that changes with size (looser when small, tighter or neutral when large), generous leading in body text, short lines (Netflix: 42 characters max per line, 2 lines max), no light weights at small sizes, and contrast of at least 4.5:1 (3:1 for large text). Most cheap-looking captions break several of these at once.

### Cited Findings
- [EVIDENCE] Netflix Timed Text Style Guide (English): max **42 characters per line**, **max 2 lines**. Keep one line unless it exceeds 42 characters. Reading speed is **20 characters/second** for adult content and 17 for children's. Font is white, with Arial as the generic proportional sans-serif placeholder, sized relative to the resolution so that 42 characters fit across the screen. — [Netflix Partner Help](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)
- [EVIDENCE] Netflix line-break rules: prefer a **bottom-heavy pyramid** shape, but don't leave only 1–2 words on the top line. Break after punctuation and before conjunctions or prepositions. Never split article+noun, adjective+noun, first+last name, subject pronoun+verb, verb+auxiliary/negation. Use the single ellipsis character (U+2026), not three periods. — [Netflix Partner Help](https://partnerhelp.netflixstudios.com/hc/en-us/articles/217350977-English-USA-Timed-Text-Style-Guide)
- [PRACTITIONER] Butterick's Practical Typography key rules: line length **45–90 characters**. Line spacing **120–145% of point size**. Add **5–12% letterspacing to ALL CAPS and small caps**. Use bold/italic "as little as possible" and never combine them. All caps is fine for **less than one line**. Avoid goofy fonts, most free fonts and system defaults such as Arial/Times. — [Practical Typography](https://practicaltypography.com/summary-of-key-rules.html)
- [EVIDENCE] Apple HIG: "**In general, avoid light font weights**". Prefer Regular/Medium/Semibold/Bold and avoid Ultralight/Thin/Light, which are hard to see, "especially when text is small". A custom font with a thin weight should go larger than the recommended sizes. iOS default text size is 17 pt and the minimum is 11 pt. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [EVIDENCE] Apple HIG: for 3 or more lines of text, avoid tight leading even when height is limited. Use loose leading for wide columns. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [EVIDENCE] Apple SF Pro tracking table (1/1000 em): tracking depends on size. **+41 at 6 pt, 0 at 12 pt, −26 at 17 pt (tightest, −0.43 pt), −23 at 20 pt, ~0 at 23–24 pt**. Then **positive again (+14 at 28 pt, +10 at 40 pt, +8 at 48 pt, 0 at 80 pt+)** because the Display optical size, which is already tightly drawn, takes over. Small text gets looser tracking and mid sizes get tighter. Large display tracking depends on whether the font has its own display cut. — [Apple HIG Typography, Tracking values](https://developer.apple.com/design/human-interface-guidelines/typography)
- [EVIDENCE] WCAG 2.2 SC 1.4.3 (AA): text contrast **≥ 4.5:1**, and **≥ 3:1 for large text**. Large text is **≥ 18 pt (~24 px), or ≥ 14 pt bold (~18.5 px)**. Don't round ratios (4.499:1 fails). AAA (1.4.6) is **7:1**. — [W3C Understanding Contrast Minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [PRACTITIONER] For Reels, keep text **large, high-contrast and away from the bottom edge**, where captions and UI controls sit. Fine text and sharp edges are the first things Instagram's re-compression degrades. — [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide); [Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/)
- [EVIDENCE/tool] Remotion ships a `<SocialSafeZones>` overlay element (1080×1920) with Instagram Reels (default) and TikTok UI PNG overlays for checking placement. Margins are visual, not numeric. — [Remotion docs](https://www.remotion.dev/elements/overlays/social-safe-zones/)
- [PRACTITIONER] A McDonald's AI ad (2025) was criticized because its on-screen text "isn't nearly legible". Warped or illegible text is a top AI tell. — [AOL/Yahoo on McDonald's & Coca-Cola AI ads](https://www.aol.com/articles/ai-slop-christmas-why-mcdonalds-143342213.html)

### Inferences
- [INFERENCE] Converting Netflix's rule to vertical 1080-wide video: 42 characters across ~1080 px is for horizontal 16:9. On 9:16 the usable width is ~900 px after side margins, so social captions should run **~20–32 characters per line, 1–2 lines** (word-by-word or short-phrase styles go even shorter). This is a derived value, not a published spec.
- [INFERENCE] Phone legibility: WCAG's "large text" is ~24 CSS px on a ~390-pt-wide phone. Scaled to a 1080-px canvas (~2.77×), that is ≈ **66 px**. A practical floor is **~40–48 px for secondary text** and **~60–80 px+ for main captions/hooks** on a 1080×1920 canvas. This is derived, so verify on a real device.
- [INFERENCE] Tracking rule for Remotion: use positive tracking (+5–12%) for small labels and all caps (Butterick). For large display headlines in fonts without a display optical size (e.g. Inter text cut, Helvetica), use mildly negative tracking (roughly −1% to −3% em, i.e. `letterSpacing: '-0.02em'`). For fonts that have a Display cut, or SF at 80 pt+, use ~0. Apple's table shows that negative tracking is not universal. It depends on the font.
- [INFERENCE] Hierarchy: limit a piece to **1 family (2 at most, e.g. a serif display face plus a neutral sans), 2–3 weights, 3 sizes** (hook/headline, body/caption, label). Step sizes with a consistent ratio. Modular scales of 1.25 (major third), 1.333 (perfect fourth), 1.5 or 1.618 are standard practice, and for short-form vertical video a larger ratio (1.5–1.618) reads better at a glance.
- [INFERENCE] Text on images: use a gradient scrim (dark at ~40–60% opacity fading to 0 over ~30–40% of the frame height), a soft shadow (large blur, low opacity, small or no offset) or a solid box (Netflix/BBC-style background). Avoid hard 1–2 px drop shadows, thick strokes and glows, which read as cheap. Check contrast against the brightest pixel behind the text, not the average.

### Gaps
- BBC subtitle guidelines page (size as % of screen height, background boxes) could not be fetched: the BBC research page returned no content. The often-quoted "BBC Teletext / ~1/15 of screen height" figure is unverified here.
- No official TikTok/Instagram numeric safe-zone pixels were verified. Third-party tools exist (Kapwing, merginit, socialync) but weren't fetched. Common practitioner values (~250–300 px top, ~350–450 px bottom, ~120–190 px right UI column on 1080×1920) are unverified.
- Netflix's separate "Subtitle Timing Guidelines" (min/max durations, e.g. the 5/6-second limits) were not fetched.
- Modular-scale ratios, Ellen Lupton's and Müller-Brockmann's texts, and Material's type scale were not fetched, so those points are standard practice rather than cited.

## 2. Layout / grid (grids, margins, alignment, spacing, hierarchy)

### Takeaway
I found no fetched primary source for this section. The rules below are standard design practice, labeled as inference: one grid, consistent spacing tokens, generous margins and one focal point per frame.

### Cited Findings
- [EVIDENCE] Apple HIG: use weight, size and color to "emphasize important information and help people visualize hierarchy", and keep that relative hierarchy consistent. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- [PRACTITIONER] Keep critical text out of the bottom UI region on Reels. — [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide)
- [EVIDENCE/tool] Remotion's safe-zone overlay can be layered in previews to check layouts against the Reels/TikTok UI. — [Remotion docs](https://www.remotion.dev/elements/overlays/social-safe-zones/)

### Inferences
- [INFERENCE] Use a spacing system: every margin, gap and offset is a multiple of 8 px (8/16/24/32/48/64/96…) on the 1080×1920 canvas. That alone removes the "random nudges" look.
- [INFERENCE] Use a column grid (e.g. 6 or 12 columns on 1080 wide, with outer margins of ~64–96 px and gutters of ~24–32 px), Müller-Brockmann-style. Snap text blocks to column edges. Keep left-aligned text on one consistent left edge throughout the piece, and use centered text only for short, single-line statements.
- [INFERENCE] Align by eye where geometry misleads: round or pointed shapes and letters like O, A and V overshoot the edge, so nudge them; punctuation and quotes hang outside the margin; play-button triangles move right of their geometric center.
- [INFERENCE] One focal point per frame. Each frame should have one dominant element (≥ 2× the size or contrast of anything else) and at most two supporting elements.

### Gaps
- No primary source fetched for Müller-Brockmann, the 8pt grid (e.g. Material/spec.fm) or optical alignment. The report writer should present these as standard practice, not cited fact.

## 3. Color (limited palettes, harmony, consistent grade, skin tones, saturation, clean brands)

### Takeaway
Fetched evidence here is thin. Critic evidence says over-polish, unrealistic smoothness and inconsistent detail read as cheap. Practice says to use a restricted palette (1 dominant neutral, 1 secondary, 1 accent), keep one grade across shots and protect skin tones.

### Cited Findings
- [PRACTITIONER] Heavy colour grading makes Instagram's compression harder and can cause colour shifts and banding. — [Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/); [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide)
- [PRACTITIONER] Critics described a Guess/Vogue AI ad as an "overly polished" flawless model, and Toys "R" Us's Sora ad as "candy-colored" with an "awful oily sheen". Over-saturated, glossy color is part of the cheap AI look. — [Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)

### Inferences
- [INFERENCE] Use a 60-30-10 split: ~60% dominant neutral (background: off-white, warm grey, near-black rather than pure #000/#FFF), ~30% secondary (brand or support tone), ~10% accent (CTA, key word highlight). Use one accent color per piece.
- [INFERENCE] "Clean" brands like Apple, Aesop and Anthropic share large neutral fields, a single accent, few typefaces, lots of negative space and consistent photography lighting. Nike is the counterexample: high contrast, but a strict system (one typeface family, black/white plus product color). The common factor is a strict system, not minimalism as such.
- [INFERENCE] Grade every shot to one look, matching white balance, black level and saturation across all shots, especially when mixing AI generators (Kling/Veo/Sora outputs differ in contrast and saturation). Keep skin on the skin-tone line of a vectorscope. Cap saturation well below generator defaults. Avoid pure black and white for text and backgrounds and pick slightly tinted ones (e.g. #0E0E0E, #F5F3EF).

### Gaps
- No fetched source for 60-30-10, color scripts, or published analyses of Apple/Aesop/Nike/Anthropic visual systems.

## 4. Finishing (grain, banding, sharpening, halation, export settings)

### Takeaway
Banding comes mainly from 8-bit gradients plus platform re-compression. Fix it with grain/noise dithering applied consistently across all shots, or with 10-bit H.265 export. For Instagram/TikTok, export 1080×1920, H.264 MP4, ≥ 30 fps, at a high bitrate (rule of thumb ≥ 10 Mbps), and avoid double compression.

### Cited Findings
- [EVIDENCE/PRACTITIONER] Banding appears mainly in 8-bit footage or 8-bit exports and in subtle gradients such as skies. Adding grain breaks hard color edges and hides banding after compression, but it "may look out of place if your other shots have no grain", so apply it consistently. Exporting H.265 **Main10** (10-bit) helps only if the source has the bit depth. Banding usually can't be fully removed. — [PremiumBeat](https://www.premiumbeat.com/blog/debanding-footage-davinci-resolve)
- [PRACTITIONER] Reels export: **1080×1920 (9:16)**, **≥ 30 fps** (convert 60 fps to 30), **MP4 H.264**, bitrate "**10 Mbps or more for 1080p**" as a creator rule of thumb (Instagram publishes no target). Don't upload 4K, which gives Instagram a larger file to shrink. Turn on **Profile → Menu → Media quality → "Upload at highest quality"**. Schedulers may re-compress the file. High motion, busy backgrounds, fast cuts, heavy grading and fine text all compress worse. — [Lilach Bullock](https://www.lilachbullock.com/fix-instagram-reels-quality-dropping-after-upload/)
- [PRACTITIONER] H.264 + AAC, MP4 container, 30 fps "sweet spot". Export a clean master and make any smaller copy from it, never from an already-compressed file. Reduce bitrate rather than resolution. For grainy footage use a slightly higher bitrate or mild noise reduction. Convert variable frame rate phone footage to constant before export. — [Visnalize](https://visnalize.com/blog/instagram-media-specs-compression-guide)
- [PRACTITIONER] Grain on its own doesn't make a piece look cinematic. Volvo's AI ad used "a grainy filter meant to look cinematic" that critics called "lazy". — [Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)

### Inferences
- [INFERENCE] Remotion: render with `--codec=h264 --crf` around 16–18 (or a video bitrate of ~12–20 Mbps), `yuv420p`, 30 fps, 1080×1920. Add a subtle full-frame animated grain/noise layer (~2–4% opacity, changing every frame) over gradients and flat color fields so they survive re-encoding without banding.
- [INFERENCE] Use one texture recipe for the whole piece (same grain size and amount, same halation and bloom strength). Mixed textures make a piece look assembled from parts. Keep halation and bloom subtle and confined to highlights. Don't over-sharpen AI output: halos around edges read as cheap, and platform compression adds its own artifacts.

### Gaps
- No official TikTok or Instagram bitrate spec exists publicly. Both sources say Instagram doesn't publish one.
- No fetched source for film-emulation and halation parameters (e.g. Dehancer/FilmConvert settings).

## 5. AI-specific tells and how top AI filmmakers avoid them

### Takeaway
The recurring critic vocabulary is "plastic", "oily sheen", "overly polished/smooth", inconsistent detail, odd anatomy, illegible text, jerky motion and short clips stitched with hard jump cuts. The filmmakers who are praised anchor AI in human performance or existing art, generate many takes and curate hard, and treat the tool as one layer in a mixed pipeline.

### Cited Findings
- [PRACTITIONER] McDonald's Netherlands AI ad (2025, later removed): people look "plastic-y", motion is jerky, text "isn't nearly legible", fine details are off, and there is "that AI look". It used "short clips stitched together with hard jump cuts", consistent with the ~10-second limit of generators. — [AOL/Yahoo](https://www.aol.com/articles/ai-slop-christmas-why-mcdonalds-143342213.html)
- [PRACTITIONER] Coca-Cola "Holidays Are Coming" AI remake (2025): fur detail is inconsistent and gets less defined toward the back of the animals. Animals make "overexaggerated surprised faces" with perfectly circular mouths and look "part shiny, part plastic". "No polar bear's fur is that smooth." A human animator "likely would've caught and corrected" these errors. The team used Veo 3 for the truck and iterated variations, and the critic praised the AI disclosure label. — [AOL/Yahoo](https://www.aol.com/articles/ai-slop-christmas-why-mcdonalds-143342213.html); also [TechRadar](https://www.techradar.com/ai-platforms-assistants/coca-cola-faces-backlash-again-for-missing-the-spirit-of-the-holidays-with-another-ai-slop-ad)
- [PRACTITIONER] Creative Bloq list (Aug 2025): Coca-Cola 2024 relied on "generic Christmas stereotypes" and felt emotionally empty. Volvo used a fake-cinematic grain filter ("lazy"). Guess/Vogue showed an "overly polished" flawless model. Skechers had "overly smooth, blurred-looking imagery, odd anatomy" printed with visible errors. Toys "R" Us (Sora) was uncanny and "candy-colored" with an "awful oily sheen". — [Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)
- [PRACTITIONER] Paul Trillo: generates "hundreds of shots", selects the strongest and builds the story from them. He explores with generators first, then scripts, storyboards and animatics. He grounds work in existing art (Paul Flores's murals and 2D graffiti with 3D compositing in *Cuco*, Shyama Golden's paintings) and calls generic output "Glop". "Craft always outlasts shortcuts." Motionographer notes the quotes were rebuilt from voice notes and may not be verbatim. — [Motionographer, May 2025](https://motionographer.com/2025/05/20/paul-trillo-hacking-cinemas-next-level/)
- [PRACTITIONER] Runway AIFF 2025 Grand Prix "Get Me Out" (Daniel Antebi): its strength is the emotional quality of **human performances**, with AI used to re-skin an actor as a visual metaphor. The winner called the toolset "tedious and imperfect", and he credited his inspirations in the end credits. — [Variety](https://variety.com/vip/runway-ai-film-festival-1235993270)
- [PRACTITIONER] Tool-vendor advice (Imagine.art): set camera, lens, focal length and aperture deliberately. Choose a camera movement per shot instead of the default. Write motion prompts, not appearance prompts. Always generate from a reference start frame for consistency. Generate 2–3 variants of key shots and don't accept the first output. Storyboard before generating. — [Imagine.art blog](https://www.imagine.art/blogs/ai-film-mistakes-quality)

### Inferences
- [INFERENCE] Anti-cheap checklist for AI shots: no floating or warped text (add all text in Remotion, never generate it). Hands and teeth checked. Consistent light direction and color temperature across shots. Reduce gloss and specular sheen and add skin texture (pores, slight imperfection). Lower saturation. Add consistent grain to break the "too clean" plastic surface. Avoid symmetric, over-centered "stock" compositions. Hold shots only as long as the AI motion stays coherent, but don't let the ~5–10 s generator limit dictate a choppy jump-cut rhythm.
- [INFERENCE] Hybrid wins: real photos, real voice or real performance as the anchor, with AI as texture or extension. This matches both the Antebi and Trillo cases.

### Gaps
- No fetched interviews with Higgsfield or Kling power users. There is no 2026 data on AIFF 2026 winners, and no The Verge, It's Nice That or Creative Review pieces were fetched.

## 6. "Less is more": restraint, focal point, motion system

### Takeaway
Direct sources here are weak. The critic evidence implies that over-polish, effect-as-shortcut (grain filters), and stereotyped content read as cheap. Restraint and a consistent motion and design system are what read as premium.

### Cited Findings
- [PRACTITIONER] Fake "cinematic" filters were called lazy (Volvo), and generic stereotypes were criticized (Coca-Cola). Adding effects instead of craft is penalized by audiences. — [Creative Bloq](https://www.creativebloq.com/design/branding/5-failed-ai-ads-that-prove-human-creativity-is-still-superior)
- [PRACTITIONER] Default camera motion is "safe and forgettable". Choose motion intentionally for each shot. — [Imagine.art](https://www.imagine.art/blogs/ai-film-mistakes-quality)
- [PRACTITIONER] Use bold/italic "as little as possible" (Butterick), the typographic version of restraint. — [Practical Typography](https://practicaltypography.com/summary-of-key-rules.html)

### Inferences
- [INFERENCE] Define a motion system up front and reuse it everywhere: 1–2 easing curves, 2–3 durations (e.g. 8 / 12 / 20 frames at 30 fps), one entrance direction convention, one transition type, and one highlight style for key words.
- [INFERENCE] Keep at most 1 primary animation and at most 2 secondary ones on screen at the same time. Stagger offsets consistently (e.g. 2–4 frames).
- [INFERENCE] Premium-vs-cheap quick audit: more than 2 fonts, more than 3 colors plus neutrals, mixed text styles, random spacing, glow/stroke/bevel on type, default transitions, different grain per shot, illegible small text, pure #000/#FFF, oversaturated AI glow. Each item makes a piece look cheaper.

### Gaps
- No fetched source (School of Motion, Motionographer critiques) giving numeric guidance on simultaneous animations or motion-system tokens. The numbers above are inference.
