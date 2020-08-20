const express = require("express");

const router = express.Router();

const db = require("../data/dbConfig.js");

router.get("/", async (req, res) => {
  const accounts = await db
    .select("*")
    .from("accounts")
    .then((accounts) => {
      res.status(200).json(accounts);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const account = await db
    .select("*")
    .from("accounts")
    .where("id", id)
    .first()
    .then((account) => {
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: "that account id does not exist" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.post("/", async (req, res) => {
  const post = req.body;
  const id = req.body.params;

  if (validatePost(post)) {
    db("accounts")
      .insert(post, "id")
      .where("id", id)
      .then((post) => {
        res.json(post);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({ message: "please give a name and budget" });
  }
});

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const post = req.body;

  if (validateUpdate(post)) {
    const account = await db("accounts")
      .where("id", id)
      .update({ name: req.body.name, budget: req.body.budget })
      .then((account) => {
        if (account) {
          res.status(200).json({ message: `updated ${account} account(s)!` });
        } else {
          res.status(404).json({ message: "that account can not be found" });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  } else {
    res.status(400).json({ message: "please give name and or budget" });
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const account = await db("accounts")
    .where("id", id)
    .delete()
    .then((account) => {
      if (account) {
        res.status(200).json({ Message: "account deleted successfully" + id });
      } else {
        res
          .status(404)
          .json({ MESSAGE: "account not found or does not exist" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

const validatePost = (post) => {
  return Boolean(post.name && post.budget);
};

const validateUpdate = (post) => {
  return Boolean(post.name || post.budget);
};

module.exports = router;
