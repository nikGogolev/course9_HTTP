const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 8000;

app
  .route("/get")
  .get((req, res) => {
    try {
      const list = fs.readdirSync(path.resolve(__dirname, "files"));
      let fileList = "<ul>";
      list.forEach((fileName) => {
        fileList += `<li>${fileName}</li>`;
      });
      fileList += "</ul";

      return res.status(200).send(fileList);
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/post")
  .post((req, res) => {
    return res.status(200).send("success");
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/delete")
  .delete((req, res) => {
    return res.status(200).send("success");
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/redirect")
  .get((req, res) => {
    return res.status(301).redirect("/redirected");
  })
  .all((req, res) => {
    return res.status(405).send("HTTP method not allowed");
  });

app
  .route("/redirected")
  .get((req, res) => {
    return res.status(301).send("success");
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
