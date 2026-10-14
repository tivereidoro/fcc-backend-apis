import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.get("/", (_req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Do not change code above this line

function timestamp(req, res) {
  const { date } = req.params;

  let parsed;
  if (!date) {
    parsed = new Date();
  } else if (/^\d+$/.test(date)) {
    parsed = new Date(Number(date));
  } else {
    parsed = new Date(date);
  }

  if (Number.isNaN(parsed.getTime())) {
    return res.json({ error: "Invalid Date" });
  }

  return res.json({ unix: parsed.getTime(), utc: parsed.toUTCString() });
}

// Express 5 dropped the `:date?` optional-parameter syntax, so the empty
// and populated forms are registered as two routes.
app.get("/api", timestamp);
app.get("/api/:date", timestamp);

// Do not change code below this line

const PORT = 8000;
const listener = app.listen(PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
