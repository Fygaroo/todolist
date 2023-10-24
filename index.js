import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { uri } from "./secrets.js";
console.log(uri);
// import { MongoClient, ServerApiVersion } from "mongodb";

const app = express();
const port = 3000;
// const port = process.env.PORT;
app.use(express.static("public"));
// app.disable("view cache");
app.use(bodyParser.urlencoded({ extended: true }));

await mongoose.connect(uri);
// await mongoose.connect("mongodb://127.0.0.1:27017/notes");

const noteSchema = new mongoose.Schema({
  note: String,
});

const NotesToday = mongoose.model("NotesToday", noteSchema);
const NotesWork = mongoose.model("NotesWork", noteSchema);

// const note = new NotesToday({ note: "And a third one" });

// await note.save();
// const notesTodayDisplay = await NotesToday.find();
// console.log(notesTodayDisplay);

//Purge
// NotesToday.collection.drop();
// NotesWork.collection.drop();

let state = "today";

let notesTodayList = await NotesToday.find();
let notesWorkList = await NotesWork.find();

const saveTheNoteToday = async function (note) {
  const newNote = await NotesToday.create({
    note: note,
  });

  notesTodayList = await NotesToday.find();
};

const saveTheNoteWork = async function (note) {
  const newNote = await NotesWork.create({
    note: note,
  });

  notesWorkList = await NotesWork.find();
};
// const goneAndDone = function () {
//   const listItems = document.querySelectorAll(".list-group-item");
//   listItems.addEventListener("click", function (e) {
//     console.log(e.target);
//   });
// };

app.get("/", (req, res) => {
  res.render("index.ejs", { notes: notesTodayList, state: state });
});

app.get("/today", async (req, res) => {
  notesTodayList = await NotesToday.find();
  state = "today";
  res.render("index.ejs", { notes: notesTodayList, state: state });
});

app.get("/work", async (req, res) => {
  notesWorkList = await NotesWork.find();
  state = "work";
  res.render("index.ejs", { notes: notesWorkList, state: state });
});

app.post("/submit", (req, res) => {
  if (state === "today") {
    // async () => {
    // const newNote = new NotesToday({ note: req.body.newItem });
    // await newNote.save();
    saveTheNoteToday(req.body.newItem);
    // res.render("index.ejs", { notes: notesTodayList, state: state });
    res.redirect("/today");
  }
  if (state === "work") {
    saveTheNoteWork(req.body.newItem);

    res.redirect("/work");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
