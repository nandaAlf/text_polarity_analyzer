# Text Polarity Analyzer

## Description

The **Text Polarity Analyzer** processes user-input text and determines its sentiment by analyzing individual words. It assigns colors based on polarity (positive, negative, or neutral) and calculates the overall sentiment of the text. The UI is built with React, while sentiment analysis is handled via a WebSocket connection to a Java-based server.

## Features

- Users can input text for sentiment analysis.
- Words are color-coded based on their sentiment:
  - **Positive** words: Green
  - **Negative** words: Red
  - **Neutral** words: White
- Displays the **average polarity** of the text:
  - **Green** if positive
  - **Red** if negative
  - **White** if neutral
- Connects to a **Java WebSocket server** for sentiment analysis.

## Installation

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn
- Java 8+ (for the WebSocket server)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/text-polarity-analyzer.git
   cd text-polarity-analyzer
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Start the React app:
   ```sh
   npm run dev
   ```

## WebSocket Server Setup

The sentiment analysis is handled by a **Java WebSocket server**. Ensure the backend is running before using the application.

1. Navigate to the Java server directory:
   ```sh
   cd server
   ```
2. Compile and run the server:
   ```sh
   javac WebSocketServer.java
   java WebSocketServer
   ```

## Usage

1. Enter text in the provided textarea.
2. Click the **Analyze** button.
3. The analyzed text will be displayed with color-coded words.
4. The **average polarity** will be shown in a separate section.

## Technologies Used

- **Frontend**: React, HTML, CSS
- **Backend**: Java WebSocket Server
- **Sentiment Analysis**: Custom NLP processing , SentiWordNet


