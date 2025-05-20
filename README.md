# 🌍 Age Of Traders

**Age Of Traders** is a text-based economic strategy browser game inspired by classic mobile trading games from the Java ME era.  
The player takes on the role of a trader, traveling from city to city, buying and selling goods, managing ships, and aiming to dominate the global market.

> Built with Next.js, TypeScript, and MongoDB.

---

## 🚀 Technologies Used

- **Next.js 15** – App Router and React-based frontend framework
- **TypeScript** – Strict typing and safer code
- **MongoDB + Mongoose** – NoSQL database and schema-based ORM
- **Tailwind CSS** – Utility-first CSS framework
- **ESLint + Prettier** – Code quality and formatting

---

## 📦 Getting Started

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/age-of-traders.git
cd age-of-traders
```

2. **Install dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Create a `.env.local` file based on `.env.example`:**

```bash
cp .env.example .env.local
```

4. **Run the development server:**

```bash
npm run dev
```

5. **Open the app in your browser:**

[http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

You need to provide the following environment variables in your `.env.local` file:

```env
# Your MongoDB connection string WITHOUT a database name
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority"

# The name of the MongoDB database to use
MONGODB_DB_NAME="ageoftraders"
```

---

## 📁 Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
├── models/          # Mongoose schemas and models
├── services/        # Business/game logic (trading, players, etc.)
├── lib/             # Database connection, utilities
├── types/           # Shared TypeScript types
```

---

## 👥 Contributing

**Age Of Traders** is an open-source hobby project with long-term potential. Contributions are welcome!

**🔒 Do not push directly to `main`. Use pull requests and work in feature branches.**

You can:

- Suggest new features
- Fix bugs or refactor code
- Create Pull Requests
- Help improve documentation
- Join discussions and shape the future of the game

Let's build something unique together ⚡

---

## 🛠 Planned Features

> The game is in early development — many powerful features are planned to create a deep, immersive trading world.

- 📊 **Global Leaderboard System**  
  Track player rankings based on wealth, reputation, and historical trade success.

- 🏙 **Unique Cities with Dynamic Economies**  
  Each city will have its own supply/demand logic, population, political situation, and economic traits.

- 🚢 **Ship Upgrades and Fleet Expansion**  
  Buy better ships, hire crew, expand your fleet, and unlock different sailing strategies.

- 🌪 **Random Market Events**  
  Experience real-time economic shifts: shortages, surpluses, pirate attacks, wars, embargoes, and weather disasters.

- 👥 **Light Multiplayer via HTTP/API**  
  Trade indirectly with other players, compare stats, and influence global market prices.

- 🧠 **AI-Driven NPC Traders**  
  Compete against intelligent traders who evolve and adapt.

- 💼 **Reputation and Guild System**  
  Unlock missions, better deals, and special access through your reputation in various factions.

- 📜 **Story-Based Missions and World Lore**  
  Immersive text-based quests and dynamic storylines to add depth and narrative goals.

- 🧭 **Exploration System**  
  Discover hidden cities, rare goods, and legendary items through long-distance exploration.

- 🏴‍☠️ **Pirates, Smugglers, and Naval Conflicts**  
  Choose to trade fairly or take a darker path. Risk high-reward smuggling or protect your fleet from raiders.

- ⚒ **Crafting & Resource Management (Advanced)**  
  Combine goods into advanced trade items or invest in production chains across cities.

- 🧮 **Investment and Banking System**  
  Deposit gold, lend money, or manipulate markets through speculation.

- 💬 **Event Log and Trade Journal**  
  Keep track of your actions, ship routes, and trade history in an in-game dashboard.

- 🕹 **Offline/Single-player Optimized Mode**  
  Designed to be fully enjoyable even without multiplayer.

- 📱 **Future mobile-friendly layout**  
  Play easily on any device with responsive UI.

---

## 🛰 Deployment

Recommended platform: [Vercel](https://vercel.com), optimized for Next.js hosting.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---
