# @visual-engineer/frontend

## Environment

The necessary environment variables in order to run the frontend application can be configured by copying the _.env.example_ file into a new _.env_ file, and editing the values as follows:

| Key          | Description                        |
| :----------- | :--------------------------------- |
| `REACT_APP_API_URL` | URL to the host where the API backend is running |

## Important Scripts
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

### `npm run test:cypress`

Launches the cypress test runner and runs all tests headlessly.
See cypress docs about [running tests](https://docs.cypress.io/guides/guides/command-line#How-to-run-commands) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

## How to Start the Project

1. Create a _.env_ file in the root of the frontend project using the same format as in the given _.env.example_ file.
2. Run the [backend](../backend/README.md) project first.
3. Run `npm run dev` in a terminal at the root of the frontend project.

The app will run in development mode on [http://localhost:8080](http://localhost:8080).
