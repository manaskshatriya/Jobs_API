require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");



const express = require("express");
const app = express();
const db = require("./db/connect");
const auth = require("./middleware/authentication");

// routes
const jobsRouter = require("./routes/jobs");
const authRouter = require("./routes/auth");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

// extra packages

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", auth , jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.set('trust proxy', true);
 
app.use(rateLimit ({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());


const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await db(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port} and connected to DB ...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
