const express = require("express");
const router = express.Router();
const _ = require("lodash");
const auth = require("../middleware/auth");
const authObjectId = require("../middleware/authObjectId");
const isAdmin = require("../middleware/isAdmin");

const { Customer, validateCustomer } = require("../model/customer");

router.get("/", auth, async (req, res) => {
  const customer = await Customer.find()
    .select({ name: 1, isGold: 1 })
    .sort("name");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(_.pick(req.body, ["name", "phone", "isGold"]));
  await customer.save();
  res.send(customer);
});

router.delete("/:id", [auth, isAdmin, authObjectId], async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(400).send("Invalid ID");

  res.send(customer);
});

module.exports = router;
