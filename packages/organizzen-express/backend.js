import express from "express";

const app = express();
const port = 8000;

const events = {
  events_list: [
    {
      name: "Event1",
      desc: "Description of event 1",
      date: "2012-04-23",
    },
    {
      name: "Event2",
      desc: "Description of event 2",
      date: "2012-04-12",
    },
    {
      name: "Event3",
      desc: "Description of event 3",
      date: "2012-05-01",
    },
    {
      name: "Event4",
      desc: "Description of event 4",
      date: "2012-04-28",
    },
    {
      name: "Event5",
      desc: "Description of event 5",
      date: "2012-03-30",
    },
  ],
};

app.use(express.json()); //set up express to process incoming dats in JSON format

app.get("/", (req, res) => {
  res.send("Hello World!"); //sets the endpoint to accept http GET requests
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
