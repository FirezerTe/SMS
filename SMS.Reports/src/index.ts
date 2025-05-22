import app from "./server";

const port = Number(process.env.PORT || 5001);

app.listen(port, "0.0.0.0", () => {
  console.log(`Report server started:  http://localhost:${port}`);
});
