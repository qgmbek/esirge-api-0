const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const States = require("../models/states");

// GET request 
router.get("/", (req, res, next) => {
  States.find()
    .select("name capital banner map legislature area tamga qaghans religion language etymology history administration economy id")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        states: docs.map(doc => {
          return {
            name: doc.name,
            capital: doc.capital,
            banner: doc.banner,
            map: doc.map,
            legislature: doc.legislature,
            area: doc.area,
            tamga: doc.tamga,
            qaghans: doc.qaghans,
            religion: doc.religion,
            language: doc.language,
            etymology: doc.etymology,
            history: doc.history,
            administration: doc.administration,
            economy: doc.economy,
            id: doc.id,
            request: {
              type: "GET",
              url: "http://localhost:3000/states/" + doc._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


router.post("/", upload.fields([{ name: 'map', maxCount: 1 }, { name: 'tamga', maxCount: 1 }]), (req, res, next) => {
  const state = new States({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    capital: req.body.capital,
    banner: req.body.banner,
    map: req.files['map'][0].path,
    legislature: req.body.legislature,
    area: req.body.area,
    tamga: req.files['tamga'][0].path,
    qaghans: req.body.qaghans,
    religion: req.body.religion,
    language: req.body.language,
    etymology: req.body.etymology,
    history: req.body.history,
    administration: req.body.administration,
    economy: req.body.economy,
  });
  state
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created state successfully",
        createdState: {
            name: result.name,
            capital: result.capital,
            etymology: result.etymology,
            history: result.history,
            administration: result.administration,
            economy: result.economy,
            id: result.id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/states/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// GET request by ID
router.get("/:stateId", (req, res, next) => {
  const id = req.params.stateId;
  States.findById(id)
    .select('name capital banner map legislature area tamga qaghans religion language etymology history administration economy _id')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            state: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/states'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// PATCH request
router.patch("/:stateId", (req, res, next) => {
  const id = req.params.stateId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  States.updateOne({ id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'State updated',
          request: {
              type: 'GET',
              url: 'http://localhost:3000/states/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// DELETE request
router.delete("/:stateId", (req, res, next) => {
  const id = req.params.stateId;
  States.deleteOne({ id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'State deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/states',
              body: { name: 'String', capital: 'String' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
