# ProductBox Assessment Test

## Overview
This project is a Website Title Fetcher built with Node.js and Express. It allows you to fetch the title of a website using different implementation approaches:

- Callback Implementation
- Async.js Implementation
- Promise Implementation
- Bacon.js Implementation

You can select which implementation to run using an interactive menu when starting the server.

## Setup
1. Clone the repository or download the source code.
2. Install dependencies:
   ```
   npm install
   ```

## Usage
1. Start the application:
   ```
   node server.js
   ```
2. Choose the desired implementation from the menu.
3. Access the endpoint in your browser or via curl:
   ```
   http://localhost:3000/I/want/title?address=https://www.google.com
   ```

## Implementations
- **Callback:** Traditional callback-based approach.
- **Async.js:** Uses Async.js for concurrency control.
- **Promise:** Modern promises with Promise.allSettled.
- **Bacon.js:** Reactive programming with Bacon.js.

## Author
Wasiq Khan

## License
MIT