# OrganizZen

For event planners, team leaders, and collaborative groups who are overwhelmed with a great number of tasks and responsibilities, OrganizZen emerges as an essential event and project management tool. Instead of just offering a simple to-do list, OrganizZen weaves together comprehensive event management capabilities such as a calendar where individuals can schedule meetings and deadlines, as well as robust collaboration by incorporating a chat feature.

# Contributing
Style:
- Tabs are the length of 4 spaces
- Single statements should go onto the next line
- Braces should go on the same line

Scripts to set up frontend developer environment (Run all of these scripts from the root directory!):
-  npm run frontend                  ->       starts react app

Scripts to set up frontend developer environment (Pick between either start or dev commands):
-  npm run backend-start             ->       starts backend for tasks/events
-  npm run backend-start-users       ->       starts backend for users
OR
-  npm run backend-dev               ->       starts backend for tasks/events (but using nodemon)
-  npm run backend-dev-users         ->       starts backend for users (but using nodemon)

Style Scripts (Also run from root!):
-  npm run format (run prettier)   ->    "format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"
-  npm run lint (run eslint)       ->    "lint": "npx eslint . && npx prettier --check ."
    
NOTE: This project user Prettier and ESLint, and the project files contain the configuration for these tools. If using VSCode, please go to the "Extensions" tab and install "Prettier - Code formatter" by Prettier and "ESLint" from Microsoft. Trust the tools!

# UI Prototype
See the Figma Prototype: https://www.figma.com/file/YENWh5f5g0Fv2FgBzbFjee/Prototype?type=design&node-id=0%3A1&mode=design&t=eZ1aoEtJQrye0w2N-1
