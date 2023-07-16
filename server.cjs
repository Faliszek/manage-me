const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ObjectId } = mongoose.Types;
const app = express();

app.use(express.json());
app.use(cors());

const email = "adam@adamczyk.com";
const password = "zaq1@WSX";
const secret = "your_secret_key";

function createUserInDb() {
  console.log("Connected to MongoDB");

  bcrypt.hash(password, 10);

  User.findOne({ email }).then((user) => {
    if (!user) {
      bcrypt
        .hash(password, 10) // 10 is the saltRounds, increase it for more security but it will be slower
        .then((hashedPassword) => {
          User.create({ email, password: hashedPassword })
            .then(() => console.log("User created"))
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    } else {
      console.log("User already exists");
    }
  });
}

// Połączenie z bazą danych MongoDB
mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    createUserInDb();
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});
// Definicja modelu Task
const FunctionalitySchema = new mongoose.Schema({
  title: String,
});

// Definicja modelu Task
const TaskSchema = new mongoose.Schema({
  title: String,
  status: String,
  functionalityId: mongoose.Types.ObjectId,
});

const Functionality = mongoose.model("Functionality", FunctionalitySchema);
const Task = mongoose.model("Task", TaskSchema);
const User = mongoose.model("User", UserSchema);

/**
 * Login endpoint
 */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ token: null, message: "Invalid email or password" });
    }

    const token = jwt.sign({ _id: user._id }, secret); // replace 'your_secret_key' with your real secret key

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Functionalites list
 */
app.get("/functionalities", (req, res) => {
  Functionality.find()
    .then((functionalities) => {
      return res.json(functionalities);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve Functionality" });
    });
});
/**
 * Creating new functionality
 */
app.post("/functionalities", (req, res) => {
  const { title } = req.body;

  const newFunc = new Functionality({
    title,
  });

  newFunc
    .save()
    .then(() => {
      res.status(201).json(newFunc);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create func" });
    });
});

/**
 * Delete functionality
 */

app.delete("/functionalities/:id", (req, res) => {
  const functionalityId = req.params.id;

  Task.deleteMany({ functionalityId: new ObjectId(functionalityId) });
  Functionality.findByIdAndRemove(functionalityId)
    .then((functionality) => {
      if (!functionality) {
        return res.status(404).json({ error: "functionality not found" });
      }
      res.json({ message: "functionality deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete functionality" });
    });
});

/**
 * Getting single functionality (tasks list)
 */

app.get("/functionalities/:funcId/tasks", async (req, res) => {
  const funcId = req.params.funcId;
  console.log({ funcId });
  try {
    const func = await Functionality.findById(funcId);

    const tasks = await Task.find({
      functionalityId: new ObjectId(funcId),
    });

    console.log({ tasks });
    return res.json({
      _id: func._id.toHexString(),
      title: func.title,
      tasks: tasks.map((task) => ({
        _id: task._id.toHexString(),
        title: task.title,
        status: task.status,
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to retrieve Functionality" });
  }
});

/**
 * Update single func
 */
app.put("/functionalities/:funcId", (req, res) => {
  const funcId = new ObjectId(req.params.funcId);

  const { title } = req.body;

  Functionality.findByIdAndUpdate(funcId, { title }, { new: true })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Func not found" });
      }
      res.json(task);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update task" });
    });
});

/**
 * Creating single task
 */
app.post("/functionalities/:funcId/tasks", (req, res) => {
  console.log(req?.path);
  const { funcId } = req.params;
  console.log({ funcId });

  const { title, status } = req.body;

  const newTask = new Task({
    title,
    functionalityId: new ObjectId(funcId),
    status,
  });

  console.log({ newTask });

  newTask
    .save()
    .then(() => {
      res.status(201).json(newTask);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to create task" });
    });
});

/**
 * Deleting single task
 */
app.delete("/functionalities/:funcId/tasks/:taskId", (req, res) => {
  console.log(req?.path);
  const { taskId } = req.params;

  Task.findByIdAndRemove(taskId)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ _id: taskId });
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to delete task" });
    });
});

/**
 * Update single task
 */
app.put("/functionalities/:funcId/tasks/:taskId", (req, res) => {
  const taskId = new ObjectId(req.params.taskId);
  const funcId = new ObjectId(req.params.funcId);

  const { title } = req.body;

  let newTask = {};

  if (req.body.title) {
    newTask.title = req.body.title;
  }
  if (req.body.status) {
    newTask.status = req.body.status;
  }
  console.log({ title });

  Task.findOneAndUpdate({ _id: taskId, functionalityId: funcId }, newTask, {
    new: true,
  })
    .then((task) => {
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      console.log({ task });
      res.json(task);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to update task" });
    });
});

// Nasłuchiwanie na określonym porcie
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
