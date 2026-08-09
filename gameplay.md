Right now, you are standing in the interrogation room. Here is how you play and solve the case:

Step 1: Bring in a Suspect
Look at the bottom of the Case File sidebar on the left. You will see three buttons with the names of the generated suspects.

Click on one of the suspect names.

This will "seat" them in the interrogation room. The chat input box at the bottom of the screen will unlock, and the header will change to show who you are talking to.

Step 2: Start Interrogating
Type a question into the chat box and hit Ask (or press Enter).

Ask them where they were at the time of the murder.

Ask them about their relationship with the victim.

Ask them if they recognize the murder weapon.

Step 3: Cross-Examine (The Core Gameplay)
The game is all about finding contradictions.

Once Suspect 1 gives you their alibi, click on Suspect 2 in the sidebar to switch the chat.

Ask Suspect 2 to verify Suspect 1's story.

Remember the rules: One of them is the killer and will lie. The other two are innocent, but they might be hiding minor, embarrassing secrets that make them act suspicious. You have to press them to find out what they are hiding.

Step 4: Catch the Killer
Currently, this is a "sandbox" version of the game. You win when you have cornered the killer in a lie and are personally satisfied that you've solved the case!


Phase 1: Establish the Baseline (The Alibi)
Don't accuse anyone immediately. Go down the list of all three suspects and ask them the exact same basic questions to lock in their stories.

"Where exactly were you at the time of the murder?"

"Who can verify your whereabouts?"

"When was the last time you saw [Victim's Name] alive?"

Phase 2: The Cross-Examination
Because the AI generated all three suspects together in the initial Game Master JSON, they "know" each other based on their relationships. Use this against them.

If Suspect 1 says they were with Suspect 2, switch to Suspect 2 and ask: "Suspect 1 claims they were with you. Is that true?"

Ask them for their opinions on each other: "Who do you think had a reason to kill [Victim's Name]?" The killer will often eagerly throw someone else under the bus.

Phase 3: The Weapon Trap
The murder weapon is listed on your Evidence Board, but the suspects don't know that you know what it is.

The Bluff: Tell an innocent suspect, "We found your fingerprints on the [Weapon]." An innocent suspect will usually act shocked, confused, or deny ever touching it.

The Trap: Tell the killer the same thing. Because their prompt says YOU ARE THE KILLER. You murdered them using [Weapon], the AI will often panic, invent a highly specific excuse for why their fingerprints are on it, or slip up by describing the weapon in too much detail.

Phase 4: Tell the Secret from the Murder
If a suspect gets defensive, don't immediately assume they are the killer. Remember, the innocents are programmed to hide minor secrets.

If a suspect is being evasive, press them on the inconsistency: "You're hiding something. If you don't tell me what you were really doing, you're going to prison for murder."

An innocent AI will usually break and confess their embarrassing secret (e.g., "Fine! I wasn't in the library, I was stealing wine from the cellar!").

The killer AI will double down on their lie or try to change the subject.

The Final Test: The "Columbo" Strategy
When you think you have your killer, act like you believe their story, then hit them with one final, contradictory detail. "That makes perfect sense. You were in the garden. But wait... if you were in the garden, how did you know the body was found in the study?" The killer's AI logic will usually stumble trying to reconcile the lie.

How to Find the Killer (The Hacker Way)
If you are completely stuck and just want to know who did it, you can peek at the underlying code running in your browser:

Right-click anywhere on your game screen and select Inspect (or press F12 on your keyboard) to open the Developer Tools.

Click on the Console tab at the top of that new panel.

Type gameState.suspects and press Enter.

Click the small arrow to expand the list of three suspects. Look at the properties for each one; the real killer is the one with "is_killer": true.

Once you know who it is, you can read their personality traits and relationship to figure out why the AI decided they committed the crime!