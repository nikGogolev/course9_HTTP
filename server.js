const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
const port = 8000;

const userData = {
  login: "user",
  pass: "qwerty",
  id: 123,
};

app
  .route("/auth")
  .post((req, res) => {
    if (
      +req.query.id === +userData.id &&
      req.query.login === userData.login &&
      req.query.pass === userData.pass
    ) {
      res.cookie("userId", userData.id, {
        maxAge: 24 * 60 * 60,
        httpOnly: true,
      });
      res.cookie("authorized", true, {
        maxAge: 24 * 60 * 60,
        httpOnly: true,
      });
      return res.status(200).send("success");
    } else {
      return res.status(400).send("Wrong login or pass");
    }
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/post")
  .post((req, res) => {
    if (req.cookies.authorized) {
      try {
        fs.writeFileSync(
          path.join(path.resolve(__dirname, "files"), req.query.fileName),
          req.query.content
        );
      } catch (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).send("success");
    } else {
      return res.status(400).send("no authorized");
    }
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/delete")
  .delete((req, res) => {
    if (req.cookies.authorized) {
      try {
        fs.unlinkSync(
          path.join(path.resolve(__dirname, "files"), req.query.fileName)
        );
      } catch (err) {
        return res.status(500).send(err.message);
      }
      return res.status(200).send("success");
    } else {
      return res.status(400).send("no authorized");
    }
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app.use((req, res) => {
  return res.status(404).send("Not found");
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
