const express = require("express");

const router = express.Router();

const db = require("./data/dbConfig.js");

//Try to practice with async Chris!!!!!
//get request for all accounts.
//create accounts to await db then
//select all accounts from the accounts db.  then display accounts with 200. if not display 500 for err
router.get("/accounts/", async (req, res) => {
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

//get request for accounts just by using the id
//create id and set to req.params.id to search for id given in browser
//select all options from accounts found with specific id
//after finding then set account (db) and display it or display message
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

//post request   create post and set to require body
//create id and set to req.body.params
//if validatePost middleware validates when passing post body through insert to post with an id then display post.  if not display 500 message
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

//put request .  set id to req.params.id to search for given id in browser and post to req.body
//if when passing post through middleware validate Update , set account to db, found with an id. want to update name, and budget and use req.body. then display success message for updated account
//if validate does not work then display can not be found
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

//delete request. set id to req.params.id for pulling id from given id in browser
//account set to db to pull from
//find the acount with id, then delete.  if account data was deleted succesfully display 200 success message.else display 400 if can not find id, or 500 if other issues deleting
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const account = await db("accounts")
    .where("id", id)
    .delete()
    .then((account) => {
      if (account) {
        res.status(200).json({ message: "account deleted successfully" + id });
      } else {
        res
          .status(400)
          .json({ message: "account not found or does not exist" });
      }
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

//validate post return false or unvalidated if post.name and post.budget requirements not met or given by user. validate true if info given
const validatePost = (post) => {
  return Boolean(post.name && post.budget);
};

//validate update with false if post.name or post.budget not given. return true and succcesful if information given
const validateUpdate = (post) => {
  return Boolean(post.name || post.budget);
};

module.exports = router;
