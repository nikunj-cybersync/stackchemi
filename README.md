# StackChemi: Drug Interaction Analysis Tool

StackChemi is a modern, user-friendly web application that helps users analyze potential interactions between multiple medications. Built with Next.js and powered by AI, it provides real-time visualization of drug interactions and detailed safety information.


## 🌟 Features

- **Interactive Drug Selection**: Easy-to-use interface with auto-suggestions for common medications
- **Real-time Analysis**: Instant analysis of drug interactions between multiple medications
- **Visual Network Graph**: Interactive D3.js visualization showing relationships between drugs
- **Severity Classification**: Clear indication of interaction severity (Mild, Moderate, Severe)
- **Detailed Information**: Comprehensive information about each interaction, including:
  - Effect of the interaction
  - Mechanism of action
  - Recommendations for management
- **Dark Mode Support**: Full dark mode compatibility for comfortable viewing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google AI API key (for Gemini Pro model)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stackchemi.git
cd stackchemi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add:
```env
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💡 Why Use StackChemi?

StackChemi addresses a critical need in medication safety by providing instant, accessible information about drug interactions. Here's why you should consider using it:

- **Safety First**: Get immediate alerts about potentially dangerous drug combinations
- **User-Friendly**: Simple interface makes it easy to check multiple medications at once
- **Visual Understanding**: Interactive graph helps visualize complex interactions
- **AI-Powered**: Leverages advanced AI models for accurate and up-to-date information
- **Privacy-Focused**: All analysis happens server-side with no data storage
- **Accessibility**: Dark mode and responsive design ensure comfortable use on any device

## 🛠️ Technical Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Visualization**: D3.js
- **AI Integration**: Google Gemini Pro
- **API**: RESTful endpoints with Next.js API routes
- **Styling**: Tailwind CSS with custom theming

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.


## ⚠️ Disclaimer

This tool is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider before making any changes to your medication regimen.

## 🙏 Acknowledgments

- Drug interaction data powered by AI models
- Visualization powered by D3.js
- UI components inspired by modern design practices
- Vibe coding contest by Real coderss community
