const express = require("express");
const CryptoRouter = express.Router();

const { CryptoModel } = require("../models/model.crypto");
const { authentication } = require("../middlewear/authentication");

// get oneCrypto

CryptoRouter.get("/:id", authentication, async (req, res) => {
  try {
    const userOne = await CryptoModel.findById({ _id: req.params.id });

    res.status(200).send({ msg: true, userOne });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// get all crypto ..and pagination filtering serching sorting implemented ...!

CryptoRouter.get("/", authentication, async (req, res) => {
  const { sortBy, sortOrder, page, search, department, limit} = req.query;

  const Query = {};

  if (department) {
    Query.department = department;
  }

  if (search) {
    Query.firstname = { $regex: search, $options: "i" };
  }

  const sortObj = {};

  sortObj[sortBy] = sortOrder == "desc" ? -1 : 1;

  const skip = (page - 1) * parseInt(limit);

  const totaldata = await CryptoModel.countDocuments(Query) 
  console.log(totaldata)

  const totalpage = Math.ceil(totaldata/(limit || 1));
  console.log(totalpage);

  try {
    const cryptoes = await CryptoModel.find(Query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).send({ msg: true, cryptoes,totaldata,totalpage });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// create crypto ..

CryptoRouter.post("/add", authentication, async (req, res) => {
  try {
    const crypto = new CryptoModel(req.body);
    const newcrypto = await crypto.save();

    res.status(200).send({ msg: true, newcrypto });
  } catch (error) {
    res.status(500).send({ error });
  }
});

// delete crypto

CryptoRouter.delete("/delete/:cryptoID", authentication, async (req, res) => {
  try {
    const deletecrypto = await CryptoModel.findByIdAndDelete({
      _id: req.params.cryptoID,
    });

    res.status(200).send({ msg: "deleted successfully!" });
  } catch (error) {
    res.status(500).send({ error });
  }
});

CryptoRouter.put("/update/:cryptoID", authentication, async (req, res) => {
  try {
    const updatedcrypto = await CryptoModel.findByIdAndUpdate(
      { _id: req.params.cryptoID },
      req.body,
      { new: true }
    );
    res.status(200).send({ msg: "updated successfully!", updatedcrypto });
  } catch (error) {
    res.status(500).send({ error });
  }
});

module.exports = { CryptoRouter };
