# Catálogo de técnicas de montaje y tipos de corte (para short-form, reels, ads, vídeos de historia en Remotion/DaVinci)

Evidence labels used: **[E]** = sourced claim from an editing authority or reference text; **[P]** = sourced practitioner/educator opinion; **[I]** = inference or unsourced convention from general editing practice (not verified in this session, treat as a starting value to test). Quotes are kept under 15 words. Spanish names are working translations used by Spanish-speaking editors **[I]**.

Note on sources: about 25 tool calls were used. Many educator pages (StudioBinder, No Film School, Adobe, PremiumBeat) give definitions and examples but **almost never give frame counts**. Every frame or millisecond number below is therefore **[I]** unless it is cited.

---

## 1. Split edits: J-cut, L-cut, the "T-cut", sound bridge, pre-lap

### Takeaway
A split edit means picture and sound change at different moments. A J-cut brings the incoming sound in early; an L-cut lets the outgoing sound carry over. I found no reliable source that defines a "T-cut", so treat it as a term to clarify with Erik (see Gaps). Split edits are the single biggest difference between amateur and professional dialogue cutting.

### Cited Findings
- **[E] Split edit (edición partida / corte desfasado):** audio and video transitions "happen at different times." Older sources call this "overlapping the sound." That is different from overlapping dialogue, where two voices are layered. — [Wikipedia: Split edit](https://en.wikipedia.org/wiki/Split_edit)
- **[E] Why use split edits:** without them, a conversation feels like a "tennis match." They let the viewer see context before or after a line is spoken. The editor can also pair the picture of one take with the sound of another, for example a better line reading. — [Wikipedia: Split edit](https://en.wikipedia.org/wiki/Split_edit)
- **[E] J-cut (corte en J):** the audio from the following shot starts under the picture of the preceding shot. **L-cut (corte en L):** the audio of the preceding shot continues under the picture of the following shot. The names come from the shape the clips make on an NLE timeline. — [Wikipedia: Split edit](https://en.wikipedia.org/wiki/Split_edit); [Wikipedia: J cut](https://en.wikipedia.org/wiki/J_cut)
- **[E] Source conflict:** in the StudioBinder match-cut page, as summarized by the fetch tool, the J and L definitions are swapped (J = "Scene 1's sound continues into Scene 2"). Wikipedia, Adobe and Apple all use the convention above. Use J = sound leads, L = sound lags. — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/) vs [Wikipedia](https://en.wikipedia.org/wiki/Split_edit)
- **[E] NLE support:** Final Cut Pro has a dedicated "create split edits" workflow (expand the audio, then drag the audio edge independently of the video). Adobe also documents J- and L-cuts. — [Apple FCP guide](https://support.apple.com/guide/final-cut-pro/ver1632d82c/mac); [Adobe: J-cut and L-cut](https://www.adobe.com/creativecloud/video/discover/j-cut-and-l-cut)
- **[E] Sound bridge (puente sonoro):** sound effects, dialogue or music shared across a cut between scenes. Examples:
  - *Shaun of the Dead* opening: TV channel-flipping dialogue carries over between scenes.
  - *Mean Girls*: Regina's screaming outside her car continues into the scene where she arrives home.
  — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)

### Inferences
- **[I] Pre-lap (pre-lap / adelanto de sonido):** a script-level and editorial term for a J-cut across scenes. The next scene's line or sound effect is heard over the end of the current scene. The audience is "pulled" forward and anticipates the scene before it appears.
- **[I] How to build a J-cut in DaVinci or Premiere:**
  1. Make a straight cut first.
  2. Unlink audio and video (Resolve: toggle Linked Selection, Ctrl/Cmd+Shift+L; Premiere: Alt-click or Alt-drag).
  3. Roll the *video* edit later, or the *audio* edit earlier.
- **[I] J-cut starting values:**
  - Dialogue: the audio leads by about 6–15 frames at 25 fps (0.25–0.6 s), so the listener reaction lands as the new speaker's face appears.
  - Scene transitions and pre-laps: 0.5–2 s.
- **[I] L-cut starting values:**
  - The outgoing line or ambience carries 8–24 frames (0.3–1 s) under the incoming shot. Common use: hold a speaker's last words over the listener's reaction.
  - Music or ambience tails can run several seconds.
- **[I] Emotional effect:**
  - J-cut: anticipation and curiosity. The ear leads the eye, so the cut feels motivated.
  - L-cut: reflection. It lets a line "land" on a face, which is where Kuleshov-style meaning happens.
- **[I] When NOT to use them:** comedy smash cuts and hard punchlines, where a clean simultaneous cut gives the shock. Avoid split edits when the overlap makes it unclear who is speaking. Avoid a J-cut that reveals a surprise too early.
- **[I] Short-form adaptation (reels, Remotion):**
  - In Remotion, offset the `<Sequence from>` of the `<Audio>` relative to the `<Video>`/`<Img>` sequence. For example, the next VO line starts 8 frames before the visual sequence.
  - In voiceover-driven reels, J-cutting the VO into the next b-roll makes the visuals feel cut "to the thought."
  - Keep overlaps shorter than in long-form (about 4–10 frames), because reel pacing is denser.
- **[I] "T-cut", possible meanings (unverified):**
  - (a) A loose synonym for any split edit, where the timeline shape looks like a T or an offset.
  - (b) A straight cut, where audio and video cut on the same frame and form a vertical line. This is also called a "butt cut" or "corte seco".
  - (c) Some editors may use a combined J+L arrangement, where audio leads in *and* lags out of an inserted shot (for example, a cutaway laid over continuous dialogue). That is effectively an insert over unbroken audio.
  - Recommend asking Erik which one he means.

### Gaps
- No reliable source found for "T-cut" as an established term in Avid, Premiere, Resolve or FCP documentation, or in editing textbooks.
- No sourced frame counts for J/L overlaps. All numbers above are [I].

---

## 2. Hard cut, cutting on action, cutting on the blink, Murch and Dmytryk rules

### Takeaway
The plain cut is the default professional transition. Cut it *during* movement, near the middle of the action, and decide each cut by emotion before story, rhythm and continuity (Murch's ranking). Dmytryk's rules say:
- Never cut without a reason.
- Cut in movement.
- Prefer emotional truth over a perfect match.

### Cited Findings
- **[E] Dmytryk's rules (*On Film Editing*, 1984), summarized by ProVideo Coalition:**
  1. Never cut without a positive reason. The only reason to cut is "to improve the scene."
  2. When unsure of the frame, cut long rather than short.
  3. Cut in movement. The ideal point is "near the dead center of the action." Too early makes the next shot seem nonsensical; too late withholds information. Example: a man sitting on a bench, cut at the point of contact.
  4. The fresh is preferable to the stale. Don't linger even "a couple of frames" on action leaving the frame. If you must add frames, add them to the head of the new shot.
  5. Begin and end scenes on continuing action, such as an actor entering frame or slamming down a phone, never on an actor doing nothing.
  6. Cut for proper values rather than proper matches: dramatic needs beat continuity.
  7. Substance first, then form.
  — [ProVideo Coalition: Seven rules](https://www.provideocoalition.com/seven_rules_for_film_and_video_editors/amp/)
- **[E] Murch's Rule of Six (*In the Blink of an Eye*):**
  1. Emotion 51%
  2. Story 23%
  3. Rhythm 10%
  4. Eye-trace 7%
  5. 2D plane of screen 5%
  6. 3D space of action 4%

  Murch: "The order of the items is the key here." — [PremiumBeat](https://www.premiumbeat.com/blog/cutting-on-the-blink-editing-tips-from-walter-murch); [UT Austin RTF wiki](https://cloud.wikis.utexas.edu/wiki/spaces/rtf318/pages/80022510/Murch+s+Rule+of+Six)
- **[E] Blink theory:** Murch links blink rate to mental state. A blink marks a completed thought, so a cut works like a blink. Editors can structure cuts around actors' blinks, because the blinks follow the flow of information. — [PremiumBeat](https://www.premiumbeat.com/blog/cutting-on-the-blink-editing-tips-from-walter-murch)
- **[P] Where in the movement to cut (Filmsupply):**
  - Cut early, before the movement finishes, to build anticipation (*Jaws* finale).
  - Cut midway for continuity and momentum in fast action (*Captain America: Civil War* fight).
  - Cut late, after completion, for resolution and processing time (*Saving Private Ryan*: the shot lingers on Upham's face).
  - Study by playing reference footage at 0.25x. Keep reverses on the same side of the 180° line (*Spectre*: candle throw, then a reverse as it lands on Hinx).
  — [Filmsupply: Cut on action](https://wpengine.fm.co/filmsupply/cutting-on-action-editing/)
- **[E] Match on action (raccord de movimiento):** "Our eyes follow movement," so cutting on action hides the cut. It can also condense time or hide stunt swaps (Texas Switch). — [No Film School](https://nofilmschool.com/match-on-action-cut)
- **[P] Pacing heuristics from an Adobe forum FAQ:** about 4–5 s per shot for general work, 1–2 s for action, cut near the end of a sentence in conversation, longer holds in documentary. The author's key test: "how long does a clip hold your attention." Loop each cut while fine-trimming frames in Trim Mode. — [Adobe Community FAQ](https://community.adobe.com/t5/premiere-pro-discussions/faq-discussion-learning-to-edit-how-do-i-decide-where-to-cut/m-p/10642611)
- **[P] Amateur vs professional cut points:** amateurs cut "when the clip runs out." Professionals cut when the energy shifts. Test: watch the edit with the sound off and check whether the cuts still pull you forward. — [Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)

### Inferences
- **[I] Action-cut mechanics:**
  - Overlap the action so that roughly the first third of the gesture is in shot A and the remaining two thirds are in shot B.
  - Many editors then remove 1–3 frames of repeated motion at the joint, so the action feels continuous rather than stuttered.
  - Sourced guidance says only "mid-action" (Dmytryk), so treat these numbers as starting values.
- **[I] Blink cut how-to:** cut on or just after the frame where the eyelid closes. Alternatively, cut where a thought completes in the performance, such as an exhale or a glance away.
- **[I] When NOT to use a cut on action:** when you want the viewer to notice the cut (rhythmic or Brechtian editing), or in contemplative pieces where the stillness after an action is the point (the "late" cut).
- **[I] Short-form adaptation:**
  - In reels, nearly every cut should be on motion: a hand entering, a head turn, the camera moving.
  - For static-image story videos (Remotion "Formato A"), *create* motion to cut on. Start the next image already scaling or panning. Or cut on the peak of a VO stress syllable, which works as an audio "action."

### Gaps
- No primary source found that gives an exact frame offset for cutting on action. Murch's "cut on the blink" is not reduced to frame counts in the sources fetched.

---

## 3. Match cuts: graphic, action, sound, idea/intellectual, eyeline

### Takeaway
A match cut links two shots through a shared shape, motion, sound or idea, so the viewer feels connection or metaphor. It is the highest-value "concept" transition for ads and reels, but only when the match also carries meaning.

### Cited Findings
- **[E] Graphic match (raccord gráfico):** shapes, colors or compositions match.
  - *Lawrence of Arabia*: a match flame cuts to a sunrise.
  - *Citizen Kane* opening: the light in the window stays in the same screen position across transitions.
  - *Psycho*: the drain dissolves to Marion's eye.
  - *Titanic*: the wreck dissolves to the ship in flashback.
  - *2001*: a bone cuts to a satellite, millions of years later.
  — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)
- **[E] Action match:** *The Graduate* montage. Benjamin pulls himself onto the raft and lands somewhere else, compressing time. — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)
- **[E] Godfather mustache-to-olive-tree dissolve:** links Vito to his heritage. — [No Film School](https://nofilmschool.com/match-on-action-cut)
- **[E] Intellectual montage (montaje intelectual):** two images create a third idea, Eisenstein's "tertium quid." Examples are the *Battleship Potemkin* Odessa Steps and the *2001* bone/satellite cut. — [PremiumBeat: 4 iconic techniques](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] Eyeline match (raccord de mirada):** Adobe has a dedicated guide on rules for filmmakers. A character looks off-screen, and the next shot shows what they see, keeping the direction of the gaze consistent. — [Adobe eyeline match guide](https://www.adobe.com/creativecloud/video/hub/guides/eyeline-match-rules-for-filmmakers.html)

### Inferences
- **[I] How-to for a graphic match:**
  1. Align the key shape at the same screen position and scale across the cut. Use an overlay or onion-skin, or a reference guide in Resolve or Remotion.
  2. Match the direction of motion and the speed.
  3. A straight cut reads as a jump in time or a juxtaposition. A short dissolve (6–12 frames) reads as a softer transformation.
- **[I] Sound match:** a sound in A rhymes with a sound in B, for example an alarm clock becoming a phone ring. Cut exactly on the transient of the sound.
- **[I] When NOT to use a match cut:**
  - When the visual rhyme carries no meaning, because it then reads as a gimmick.
  - Too many in one piece, since each spends novelty.
- **[I] Short-form adaptation:**
  - Match cuts are a staple of transition reels (an object passed to camera, a hand covering the lens, a spin).
  - In ads, the best ones link the problem to the product through a shared shape.
  - Plan them in the shot list; they rarely work when found in post.

### Gaps
- No sourced example of a well-documented "sound match cut" scene was fetched.

---

## 4. Jump cut (Godard vs YouTube), morph cut, 30° and 180° rules, continuity vs discontinuity

### Takeaway
A jump cut cuts within the same framing, skipping time. Godard used it as a deliberate rupture. YouTube uses it to remove dead air. The 30° rule exists to prevent accidental jump cuts. Morph Cut can hide talking-head jump cuts only under narrow conditions.

### Cited Findings
- **[E] Godard's *Breathless* (1960):** Godard, with editor Cécile Decugis, cut Jean Seberg's convertible ride so the gaps between shots stand out. This popularized the jarring jump cut in the 1960s. Wikipedia credits Jean-Pierre Melville with suggesting the approach. — [Wikipedia: Jump cut](https://en.wikipedia.org/wiki/Jump_Cut)
- **[E] Jump cut history:**
  - Earlier uses include *The Tempest* (1908), Vertov's *Man With a Movie Camera* (1929), and Dovzhenko's *Arsenal* (1929, nine progressively closer cuts).
  - Online vlog jump cuts were popularized by *the show with zefrank*.
  - The cuts in Méliès' accidental "camera jam" (the bus that turns into a buggy) are cited by PremiumBeat.
  — [Wikipedia: Jump cut](https://en.wikipedia.org/wiki/Jump_Cut); [PremiumBeat](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] 30-degree rule:** the camera should move at least 30° between consecutive shots so the cut reads as a new point of view. Some schools also require a change of framing. A jump cut deliberately breaks this. — [Wikipedia: Jump cut](https://en.wikipedia.org/wiki/Jump_Cut)
- **[E] City of God opening:** cited as a fast, jarring jump-cut introduction. — [PremiumBeat](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] Morph Cut (Premiere):** works only for a single-subject talking head, with a fixed shot and a static background with no lighting changes. Tips:
  - Look for short, natural pauses with similar head position at both ends.
  - Start and end the morph near the peaks of the last and first words.
  - Heavy hand or body movement and profile shots produce blotchy results. Use cutaways or dissolves instead.
  - Adobe gives no frame duration, only "Adjust the Morph Cut duration and symmetry."
  — [Adobe Blog: Morph Cut tips](https://blog.adobe.com/en/publish/2015/06/18/morph-cut-tips-tricks-for-best-results)
- **[E] 180-degree rule in reverses:** stay on the same side of the axis to avoid disorientation. — [Filmsupply](https://wpengine.fm.co/filmsupply/cutting-on-action-editing/)
- **[E] Continuity editing (montaje invisible / de continuidad):** No Film School and Columbia's film glossary cover this as the classical system. — [No Film School: continuity editing](https://nofilmschool.com/what-is-continuity-editing); [Columbia film glossary](https://filmglossary.ccnmtl.columbia.edu/term/editing)

### Inferences
- **[I] YouTube jump-cut how-to:**
  - Remove pauses, breaths and fluff so the edit runs at speech rhythm.
  - Leave about 2–4 frames of tail after a word, so consonants and breaths aren't clipped.
  - Alternate between 100% and a 110–130% punch-in (scale cut) to disguise the jump and add emphasis.
  - Put a 1–2 frame audio crossfade at each joint to avoid clicks.
- **[I] Godard vs YouTube:** Godard's jump cut is aesthetic and alienating; it reminds you that you are watching a film. The YouTube jump cut is functional; it delivers information density. The two should not be confused when giving creative direction.
- **[I] When NOT to use jump cuts:**
  - Emotional or confessional moments, where pauses carry the meaning. Hold the take, or J/L-cut to b-roll.
  - Premium brand ads, where uninterrupted jump cuts read as "vlog" and cheap.
- **[I] Discontinuity editing** includes jump cuts, deliberate axis breaks and flash cuts. It is legitimate when it expresses a subjective state (anxiety, memory, dissociation) or a brand energy. It is bad when it is accidental.

### Gaps
- No sourced frame recommendation for punch-in scale or morph duration.

---

## 5. Cross-cutting, intercutting, Kuleshov, montage (Soviet vs Hollywood), elliptical editing, reaction shots, shot/reverse shot

### Takeaway
Juxtaposition creates meaning (Kuleshov and Eisenstein). Cross-cutting builds contrast or suspense between simultaneous actions. A montage sequence compresses time. Each is a narrative tool, not a transition style.

### Cited Findings
- **[E] Intercutting / parallel editing (montaje paralelo / alterno):** two or more actions in distinct locations edited into one scene.
  - *The Godfather* baptism, intercut with the murders, for contrast.
  - Griffith's *Intolerance* (1916): four storylines centuries apart, each with its own color tint to help orientation. Griffith used the technique from 1909.
  — [PremiumBeat](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] Kuleshov effect:** the same shot of an actor's face is read as hunger, grief or desire depending on whether it is followed by soup, a coffin or a woman on a sofa. Hitchcock's *Psycho* shower scene contains no gore; "It's all in the editing." — [PremiumBeat](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] Soviet montage theory:** the editing of shots, not their content, constitutes the force of the film. Eisenstein's Odessa Steps sequence accumulates a feeling of oppression. — [PremiumBeat](https://www.premiumbeat.com/blog/4-iconic-editing-techniques/)
- **[E] Hollywood montage:** used to show the passage of time, as in *The Graduate*. — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)
- **[P] Low-movement tension:** instead of fast cuts, use a sequence of static inserts, for example a face, then a hand reaching, then a weapon drawn (*No Country for Old Men*). — [Filmsupply](https://wpengine.fm.co/filmsupply/cutting-on-action-editing/)
- **[E] Reaction shots via L-cut:** holding a speaker's line over the listener avoids "tennis match" cutting. — [Wikipedia: Split edit](https://en.wikipedia.org/wiki/Split_edit)

### Inferences
- **[I] Cross-cutting how-to:**
  - Shorten the segments progressively as the climax approaches (for example 6 s, 4 s, 2 s, 1 s).
  - Give each thread a distinct visual or sound signature.
  - Converge the threads at the payoff.
- **[I] Shot / reverse-shot pacing (plano/contraplano):** cut to the listener when the *listener* has the emotional information, not mechanically on each line change.
- **[I] Elliptical editing / temporal ellipsis (elipsis):** skip the in-between, for example a door opens, then the person is already seated. Trust the audience. Cut "in late, out early."
- **[I] Short-form adaptation:**
  - Kuleshov is the core of ad editing: the product shot plus the reaction shot defines what the product means.
  - Cross-cutting works in 30-second ads as "problem world vs solution world."
  - A Hollywood-style montage of about 0.3–0.7 s shots on music is the standard "transformation" beat in reels.

### Gaps
- No primary Kuleshov or Eisenstein text fetched (secondary sources only). Overlap editing (Eisenstein's repeated action, as in *Potemkin*, which extends time) is not covered by a fetched source.

---

## 6. Invisible / hidden cuts: whip pan, object wipe, body wipe, darkness

### Takeaway
Hidden cuts pass a cut through a moment where the frame has no readable information: a blur, a dark object or a body crossing the lens. *Rope*, *Birdman*, *1917* and *Spectre* are the canonical references.

### Cited Findings
- **[E] *Rope* (1948):** the camera pushes into a character's dark jacket to hide reel changes, a workaround for the roughly 10-minute 35mm magazine limit. *1917*, *Birdman*, *The Revenant* opening and the *Spectre* carnival-to-hotel shot are cited as modern invisible-cut long takes. — [No Film School: Iconic invisible cuts](https://nofilmschool.com/iconic-invisible-cuts-in-movies)
- **[E] Whip pan:** a fast camera movement used to transition between scenes, associated with P.T. Anderson and Damien Chazelle. — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/); see also [No Film School: How to do a whip pan](https://nofilmschool.com/how-to-do-a-whip-pan)
- **[E] Further reading on hidden editing:** *Birdman* breakdowns, plus guides to concealing cuts in artificial long takes. — [No Film School: Birdman hidden edits](https://nofilmschool.com/2015/10/a-closer-look-hidden-editing-techniques-in-birdman); [No Film School: artificial long take](https://nofilmschool.com/2017/05/watch-art-artificial-long-take); [Videomaker: invisible edit](https://www.videomaker.com/mastering-the-invisible-edit/)

### Inferences
- **[I] Whip-pan transition how-to:**
  1. Shoot both whips in the same direction and at the same speed.
  2. Cut on the blurriest frame of each.
  3. Add 2–6 frames of directional blur across the joint and a whoosh sound effect peaking on the cut.
- **[I] Object or body wipe how-to:**
  1. Cut at the frame where the foreground object fully covers the lens.
  2. If it isn't fully covered, mask the incoming shot behind the object's edge for 3–8 frames.
- **[I] When NOT to use hidden cuts:**
  - When they draw attention to the technique in an emotional scene.
  - When the visual and audio styles of the two shots don't match, because the seam then shows.
- **[I] Short-form adaptation:**
  - These are the classic "transition reel" moves.
  - In Remotion they can be built synthetically: an animated mask (a shape scaling over the frame), blur interpolation, or the "flash with mask" already in Erik's Formato A toolkit.

### Gaps
- No fetched source gives frame-precise whip-pan or object-wipe instructions.

---

## 7. Dissolves, fades, dips, wipes and iris; smash cut, flash cuts, freeze frame, speed ramps, slow motion, split screen

### Takeaway
Optical transitions carry *meaning*:
- A dissolve means time passing or a connection.
- A fade means an ending.
- A wipe or iris means a deliberate stylistic period, as in *Star Wars*.

The default 1-second cross dissolve on every cut is the clearest amateur signal. A smash cut is a hard cut timed for maximum contrast.

### Cited Findings
- **[P] Defaults are "a starting point":** Fstoppers cites the default 1-second cross dissolve and the default audio fade as things to question. Transitions signal change, so use them deliberately and not on every cut. Don't use effects to hide weak cuts: finish the cut with zero effects first. — [Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)
- **[E] Dissolves in graphic matches:** *Psycho* (drain to eye) and *Titanic* (wreck to ship) use dissolves for transformation and time-jump meaning. — [StudioBinder](https://www.studiobinder.com/blog/match-cuts-types-of-cuts/)
- **[E] Morph Cut fallback:** Adobe recommends traditional dissolves or cutaways when Morph Cut fails. — [Adobe Blog](https://blog.adobe.com/en/publish/2015/06/18/morph-cut-tips-tricks-for-best-results)

### Inferences
- **[I] Legitimate uses for a dissolve (encadenado):** time passing, a dream or memory, a soft visual rhyme, a montage of a slow process.
  - Typical lengths: 12–24 frames for a short dissolve, 1–3 s for an emotional one.
  - Avoid dissolving between two shots of the same subject from similar angles, because it reads as a mistake.
- **[I] Fade to black (fundido a negro):** marks a chapter end or a finality. Fade to white suggests death, a flash, a memory or transcendence. Dip to color (a 4–8 frame flash) gives a punctuation beat, a camera-flash feel or a brand-color stinger.
- **[I] Wipe and iris (cortinilla / iris):** only as a conscious stylistic homage (*Star Wars*, silent film) or as a graphic, brand-designed wipe in motion pieces.
- **[I] Smash cut (corte brusco / smash cut):** cut from a high-intensity moment to a contrasting one (loud to silent, or calm to chaos) with no audio overlap. Use it for comedy and shock.
- **[I] Flash cuts and subliminal frames:** 1–4 frame inserts for memory, trauma or impact. Avoid them in ads targeting platforms with photosensitivity rules, and use them sparingly.
- **[I] Freeze frame (congelado):** ends a scene on a decisive instant (the famous ending of *The 400 Blows*), or introduces a character with a name card in short-form.
- **[I] Speed ramping and time remapping (rampa de velocidad):**
  - Ramp from 100% down to 20–30% into the key moment, then back up, with eased curves (Resolve Retime Curve).
  - Shoot at 50/60 fps or more for clean slow segments.
  - Don't ramp without a motivated peak.
- **[I] Slow motion:** emphasizes emotion and detail. Overuse kills its effect.
- **[I] Frame cutting / staccato:** removing every other frame or holding frames creates a stutter feel for energy (music videos, sports).
- **[I] Split screen:** simultaneity or comparison (before/after, two perspectives). It is common in ads.
- **[I] Short-form adaptation:**
  - Hard cuts plus 1–2 designed signature transitions per piece beats many generic transitions.
  - A 2–4 frame white dip or flash is a strong reel "beat."
  - Freeze frame with a text callout is a common hook device.

### Gaps
- No fetched source covers smash cut, freeze frame, speed ramping, split screen or flash cuts with authoritative definitions or examples. These sections are [I] and need verification if precise citations matter.

---

## 8. Rhythm: cutting to the beat vs the phrase, off-beat cuts, pacing variation

### Takeaway
Don't cut on every beat. Hit the beat only at structural moments, offset other cuts by a few frames, and vary shot lengths the way a writer varies sentence length.

### Cited Findings
- **[P] Avoid the music-video feel:** "you never want to cut your film too closely to the beat." Save beat-synced cuts for key changes, "once or twice in a sequence." Edits placed "a few frames before or after" the musical change feel more organic. Mix the music to the edit, and avoid wall-to-wall music. — [PremiumBeat](https://www.premiumbeat.com/blog/how-to-edit-a-film-to-music-without-it-becoming-a-music-video)
- **[P] Vary shot length** like sentence length: a long hold, then a few quick cuts. This matters most when cutting to music. — [Adobe Community FAQ](https://community.adobe.com/t5/premiere-pro-discussions/faq-discussion-learning-to-edit-how-do-i-decide-where-to-cut/m-p/10642611)
- **[E] Beat markers:** FCP has an "edit to the beat" workflow using markers. — [Apple FCP: Edit to the beat](https://support.apple.com/guide/final-cut-pro/ver65b55a2b7/mac)
- **[E] Rhythm is third in Murch's ranking (10%),** below emotion and story. — [PremiumBeat](https://www.premiumbeat.com/blog/cutting-on-the-blink-editing-tips-from-walter-murch)

### Inferences
- **[I] Cutting to the beat vs cutting to the phrase:**
  - Cut on the downbeat (beat 1) of bars and phrases (every 4 or 8 bars) for structural changes.
  - Cut on off-beats or between beats inside a phrase for groove.
  - Change the cut *density* at section changes (verse to chorus, drop).
- **[I] Perceptual offset:** many editors put the cut 1–2 frames *before* the transient, because perceived sync lags slightly. Test by ear.
- **[I] Short-form adaptation:**
  - Trend-audio reels are often cut on every beat deliberately, a genre convention.
  - Story or ad pieces should follow the phrase and the VO, and hit the beat only on reveals.
  - Plan a "breathing" hold every 5–8 cuts.
  - Erik's reels-hurtald0 skill already encodes a 1.4 s average cut with one 8–9 s sustained shot.

### Gaps
- No source found quantifying the "1–2 frames before the beat" perception offset.

---

## 9. What makes an edit look CLEAN and professional vs amateur

### Takeaway
Professional finish comes from consistency and intention:
- Motivated cuts and transitions, no defaults.
- Audio treated as structure.
- Continuous room tone and micro-crossfades.
- Consistent grade and exposure.
- An organized timeline.

### Cited Findings
- **[P] Habits that look amateur:**
  - A messy timeline. Fix: V1 for A-roll, V2 for cutaways, V3 for graphics, with audio mirroring the layout.
  - Cutting when the clip runs out.
  - Leaving defaults untouched.
  - Treating audio as a finishing touch instead of building it alongside the picture.
  - Transitions on every cut.
  - Effects hiding weak cuts.
  — [Fstoppers](https://fstoppers.com/education/7-premiere-pro-habits-are-making-your-edits-look-amateur-902662)
- **[P] Clean audio:**
  - Record a few minutes of room tone on every shoot and use it to fill gaps.
  - Use "two very small crossfades" when swapping words.
  - Leave handles when stripping silence, and never clip words or breaths.
  - Use short fades at the edges of interview regions.
  - Time cuts to the speaker's breathing rhythm.
  — [Videomaker: hide audio transitions](https://www.videomaker.com/how-to/audio-how-to/audio-editing/how-to-hide-audio-transitions-for-a-cleaner-sounding-video/)
- **[E] Microfades:** Descript applies automatic microfades at clip edges to prevent clicks and pops. — [Descript help: automatic microfades](https://help.descript.com/timeline/automatic-microfades)
- **[P] Final check:** render and watch on a large screen to catch transition glitches and pacing problems. — [Adobe Community FAQ](https://community.adobe.com/t5/premiere-pro-discussions/faq-discussion-learning-to-edit-how-do-i-decide-where-to-cut/m-p/10642611)
- **[E] Continuity errors:** Dmytryk says most continuity errors come from choosing the strongest performance, not from laziness. Emotional truth beats a perfect match. — [ProVideo Coalition](https://www.provideocoalition.com/seven_rules_for_film_and_video_editors/amp/)

### Inferences
- **[I] Clean-edit checklist:**
  1. Audio crossfade of 1–4 frames (about 10–40 ms at 25 fps) on every audio cut.
  2. Room-tone bed under all dialogue gaps, so there are no digital-silence holes.
  3. Normalized loudness: about -14 LUFS integrated for social and YouTube, and roughly -23/-24 LUFS for broadcast.
  4. Consistent grade: match shots first with exposure and white balance, then apply the look on an adjustment layer.
  5. Stable horizons; crop or stabilize.
  6. A consistent type system: one or two fonts, fixed sizes and positions, safe margins. Keep text out of the platform UI zones in 9:16 (roughly the top 10–15% and bottom 20–25%, plus the right edge for buttons).
  7. Every transition motivated by story or motion.
  8. Pacing variation: no constant shot length.
  9. "Tight but breathing": cut dead air, but keep reaction and breath beats.
  10. No black frames or flash frames left between clips (search with gap detection).
  11. Subtitles timed within ±2 frames of speech.
- **[I] "Messy" edits** (glitch, raw jump cuts, handheld) can be a deliberate aesthetic. They read as professional when they are *consistent* across the piece and placed on purpose.

### Gaps
- None of the named YouTube educators' own content was fetched: Premiere Gal, Cinecom, Justin Odisho, Ali Abdaal's editors, Johnny Harris breakdowns, Editing Is Everything, Film Riot, Frame.io Insider. Their specific numbers are unverified, and the report writer should not attribute claims to them.
- LUFS targets and safe-zone percentages are [I] and come from general platform knowledge, not fetched sources.
