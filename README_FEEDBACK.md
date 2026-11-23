# CART 351 — Peer Feedback

Feedback on three classmates' projects from the presentations.

---

## 1. Data Vending Machine
**Creators:** Skyla & Abhi

### Concept & Implementation
A vending machine interface where users "order" items of data about themselves, such as their cookies, their location or a file from their device. Once something is dispensed, the app sends the data to ChatGPT and shows a paragraph that makes antagonistic assumptions about the user based on what it received.

### What worked
- **The metaphor is strong.** A vending machine stands for a casual, low-stakes transaction, so it fits data extraction well: you press a button and something comes out. The friendly interface makes the hostile result more surprising and spooky.
- **The user hands over their own data.** Nobody takes it from you. You choose to "buy" it, which makes you complicit. It mirrors how we accept cookie banners and permissions without thinking.
- **The AI paragraph pays off.** The machine making assumptions about you transforms the data from something intangible to a story that is being written about you. There is something exciting about that, whether or not the story is accurate or pleasant to read. I could see many people being curious about what their result would be.

### What could be stronger
- **The AI's tone changes too much between runs.** Some responses felt sharp and on-concept, while others drifted into generic or overly harsh text. LLMs also have a tendency to add too much fluff of text for no reason, which can weaken the experience. 

### Suggestion
**Lock down the AI's behaviour with variables.** For example:
- Lower the `temperature` so responses are more controlled.
- Pass the data in as named, structured fields (`location`, `cookie_count`, `file_type`) so the model reasons from specific inputs.
- Add one or two example outputs to the prompt (few-shot examples) to anchor the tone.

**Extension idea:** Make the vending machine remember. If every purchase adds to a running "profile" that grows more specific each time, you get a sense of accumulation, which mimics how data profiling works.

---

## 2. Phishing Website
**Creator:** Kervin

### Concept & Implementation
A website built to phish its visitors. It acts like a familiar web experience while collecting information about the person using it in the background, then reveals what it took.

### What worked
- **The humour is what makes it work.** It's fun before it's scary. You lower your guard because it's playful, which is how real phishing works. The joke is doing cool conceptual work.
- **You learn by experiencing it.** Being phished yourself, even in a safe setting, teaches more than any warning about phishing could.

### What could be stronger
- **The data collected felt a little limited.** The reveal would be stronger if what was shown felt more personal. If the information is too general, users can shrug it off as "every site knows that."

### Suggestion
**Collect more, but keep it lighthearted.** A browser exposes a surprising amount without asking: screen resolution, timezone, language, battery level (in some browsers), device type, referrer, how long the user hovered over things, and where their mouse went. Showing a few of these in a cheeky, specific way (*"You hesitated 4 seconds before clicking this. Nervous?"*) would make users feel more exposed.

I'd keep the tone, though. Keep it funny and don't make it overly serious or preachy.

---

## 3. Cat Museum
**Creators:** Phil & [teammate's name]

### Concept & Implementation
A Three.js application where users upload a photo of their cat, which then appears as a texture on a cube in a simple 3D environment, a kind of virtual museum of everyone's cats.

### What worked
- **It's charming and immediately understandable.** Everyone gets "put your cat in the museum" right away. There's no learning curve, and that makes people want to participate.
- **The lo-fi 3D aesthetic suits it.** Simple cubes in an empty space have a deadpan humour. Cats treated as solemn museum artifacts is funny.
- **It's collective.** The piece improves as more people add to it, which makes it social and not just something you look at.

### What could be stronger
- **Each cat has little identity.** Right now a cat is a face on a cube. Without names, stories or context, the cubes start to feel the same once there are many of them, and the "museum" framing isn't fully used. Real museums have placards, wings and curation.
- **There's not much reason to stay or come back.** After you add your cat and look around, the experience ends. Give us a reason to keep visiting!

### Suggestion
**Add placards.** Let users submit a name, age and a short fact about their cat. Show it when you click or approach a cube, like a museum label. This gives each cat personality and leans into the museum concept.

**If that fits your direction**, I would also think about adding some gamified elements to the experience. Can you steal a cat? Can you make points from adding more types of cats?

Any of these could turn it into a real community project that people return to.
