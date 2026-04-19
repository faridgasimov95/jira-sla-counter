/**
 * Entry point. Starts the Express server on the configured port.
 */

import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
