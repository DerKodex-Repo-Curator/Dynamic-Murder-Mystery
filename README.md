# The Dynamic Murder Mystery: AI-Powered Detective Game

A completely serverless, browser-based murder mystery game powered by Large Language Models (LLMs). Every time you play, the AI acts as a "Game Master" to dynamically generate a unique crime scene, victim, weapon, and three distinct suspects.

As the detective, your job is to interrogate the suspects, inspect the evidence, consult with the Police Chief, and catch the killer in a lie.

!(Screenshot 2026-08-09 183312.png)
---

## ✨ Features

* **Infinite Replayability:** The victim, location, weapon, and suspects (including who the killer is) are randomly generated on the fly every time you click "New Game".
* **Intelligent Suspects:** The AI engine gives each suspect a personality and a relationship to the victim. The killer is programmed to lie and cover their tracks, while innocent suspects tell the truth but may hide embarrassing secrets.
* **Interactive Evidence Locker:** The game generates hidden physical clues about the murder weapon and the crime scene. Click on the Evidence tags to inspect them for subtle hints.
* **The "Police Chief" Hint System:** A context-aware AI assistant that reads your ongoing chat transcripts. If you get stuck, consult the Chief for a summary of the evidence or hints about contradictions you might have missed.
* **Zero-Latency Local Mode:** Supports offline, completely free inference using [Ollama](https://ollama.com/) for local models like `llama3.1`.
* **Cloud API Support:** Plug in an API key for OpenRouter, Groq, or OpenAI to use state-of-the-art cloud models.
* **Single-File Architecture:** The entire application (HTML, CSS, Vanilla JS) is bundled into a single `index.html` file. No build steps, no backend, no dependencies.

---

## 🕹️ How to Play

1. **Review the Case File:** When the game loads, review the generated Victim, Location, and Weapon in the left sidebar.
2. **Inspect the Evidence:** Click the **SITE** and **WPN** tags in the Evidence Locker to reveal subtle clues left behind by the killer.
3. **Open a Dossier:** Click on a suspect's card to expand their dossier. Read their profile and their relationship to the victim.
4. **Interrogate:** Use the chat box to question the suspect. Ask for their alibi, cross-reference their stories with other suspects, and confront them with the evidence.
5. **Consult the Chief:** If you are losing the trail, click the gold Police Chief card. Ask him to review your transcripts and point out inconsistencies.
6. **Make Your Accusation:** When you are confident you know who is lying, click the red **Make Accusation** button. Choose your suspect to see if you cracked the case or let the real killer walk free!

---

## 🚀 Installation & Setup

Because this is a lightweight frontend application, no installation is required. Simply download the `index.html` file and double-click it to open it in any modern web browser.

### Option A: Playing with Local AI (Ollama)

To play offline, you must configure Ollama to accept cross-origin requests from your web browser.

1. Install [Ollama](https://ollama.com/).
2. Pull a fast model (e.g., `ollama pull llama3.1`).
3. Enable CORS:
* **Windows:** Open Environment Variables, add a System Variable named `OLLAMA_ORIGINS` and set the value to `*`. Restart Ollama.
* **Mac/Linux:** Start Ollama from the terminal using the command: `OLLAMA_ORIGINS="*" ollama serve`.


4. Open the game, set the Provider to **Local**, and click **New Game**.

### Option B: Playing with Online AI (OpenRouter / Groq)

1. Open the game in your browser.
2. In the bottom left **API Configuration** panel, switch the Provider to **Online**.
3. Paste your API Key (e.g., from OpenRouter).
4. (Optional) Adjust the Endpoint Base URL and Model Name if you are using a different provider.
5. Click **New Game**.

---

## 🧠 Under the Hood (Architecture)

* **The Game Master Prompt:** On initialization, the app sends a strict JSON-formatting prompt to the LLM to invent the scenario. The JS parses this JSON to build the UI and populate the suspect list.
* **Array Shuffling:** To prevent the AI from defaulting to making the first generated person the killer, the parsed suspect array is mathematically shuffled before rendering the UI.
* **Isolated Context Windows:** The game maintains distinct chat history arrays for each character. When you switch suspects, the UI swaps the active history. Suspect A has no memory of what you just said to Suspect B.
* **Dynamic System Prompts:** Each suspect's chat history is prepended with a hidden system prompt containing their specific traits and a boolean flag determining if they are the killer or innocent, dictating their behavior.
* **The Chief's Memory:** When you talk to the Police Chief, the JS dynamically concatenates all your previous suspect chat logs into a single transcript and passes it to the Chief's context window, allowing for cross-examination analysis.
