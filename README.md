# OrganizZen

For event planners, team leaders, and collaborative groups who are overwhelmed with a great number of tasks and responsibilities, OrganizZen emerges as an essential event and project management tool. Instead of just offering a simple to-do list, OrganizZen weaves together comprehensive event management capabilities such as a calendar where individuals can schedule meetings and deadlines, as well as robust user interface where users can filter and color code their tasks to their convenience.​

# UI Prototype
See the Figma!
[PROTOTYPE] https://www.figma.com/file/pZ8oo4HfhDI6RlzLrSeHOo/Prototype?type=design&node-id=0-1&mode=design&t=TIlkFC3eWPdjNO6a-0 

[WIREFRAME] https://www.figma.com/file/YENWh5f5g0Fv2FgBzbFjee/Prototype?type=design&node-id=0-1&mode=design&t=uyaBs6wzBL4t2mry-0 

Last updated: December 4, 2023

# UML CLASS DIAGRAM
[UML Class Diagram](docs/UML.md)

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
-  npm run backend-dev               ->       starts backend for tasks/events (but using nodemon)
-  npm run backend-dev-users         ->       starts backend for users (but using nodemon)
-  npm run backend:both              ->       starts backend for users AND tasks/events using nodemon

Style Scripts (Also run from root!):
-  npm run format (run prettier)   ->    "format": "prettier --write './**/*.{js,jsx,ts,tsx,css,md,json}' --config ./.prettierrc"
-  npm run lint (run eslint)       ->    "lint": "npx eslint . && npx prettier --check ."

Jest Test (This tests the NewEvent React component):
-  npm run test
    
NOTE: This project user Prettier and ESLint, and the project files contain the configuration for these tools. If using VSCode, please go to the "Extensions" tab and install "Prettier - Code formatter" by Prettier and "ESLint" from Microsoft. Trust the tools!
