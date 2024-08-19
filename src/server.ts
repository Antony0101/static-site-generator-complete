import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));

console.log("NODE_ENV:", process.env.NODE_ENV);

app.use(express.static("public"));
app.use(express.static("static"));

app.use((req, res, next) => {
    res.send("static/notFound.html");
});
const port = process.env.PORT || 5000;
const server = app.listen(port, () =>
    console.log(`listening on http://127.0.0.1:${port}`),
);
