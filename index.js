// TODO: UI with ejs
const service = require("./src/client");
const PROTO_PATH_USER = "./src/proto/user.proto";
const PROTO_PATH_POST = "./src/proto/post.proto";

const userClient = service.loadService(PROTO_PATH_USER, "UserService");
const postClient = service.loadService(PROTO_PATH_POST, "PostService");

const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index.ejs"));

app.get("/users", (req, res) => {
    userClient.getUsers({}, (err, response) => {
        if (err) throw err;
        res.render("user/index.ejs", response);
    });
});
app.get("/user/new", (req, res) => res.render("user/new.ejs"));
app.post("/user/create", (req, res) => {
    userClient.addUser({ name: req.body.name, email: req.body.email }, (err, response) => {
        if (err) throw err;
        if (response) res.redirect("/users");
    });
});
app.get("/user/:id", (req, res) => {
    userClient.getUser({ id: req.params.id }, (err, response) => {
        if (err) throw err;
        res.render("user/details.ejs", response);
    });
});
app.get("/user/edit/:id", (req, res) => {
    userClient.getUser({ id: req.params.id }, (err, response) => {
        if (err) throw err;
        res.render("user/edit.ejs", response);
    });
});
app.post("/user/update/:id", (req, res) => {
    userClient.updateUser({ id: req.params.id, name: req.body.name, email: req.body.email }, (err, response) => {
        if (err) throw err;
        if (response) res.redirect("/users");
    });
});
app.post("/user/delete/:id", (req, res) => {
    userClient.deleteUser({ id: req.params.id }, (err, response) => {
        if (err) throw err;
        res.redirect("/users");
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// userClient.getUsers({}, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.getUser({ id: 2 }, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.deleteUser({ id: 4 }, (err, res) => {
//     if (err) throw err;
//     console.log(res);
// });
// postClient.getPosts({}, (err, res) => {
//     if (err) throw err;
//     console.log(res);
// });
// postClient.addPost(
//     {
//         title: "Post ke 2",
//         content: `Do you all records from all tables
//     Sometimes you want to remove all data from all tables but keep the actual tables. This can be particularly useful in a development environment and whilst testing.
//     The following shows how to delete all records from all tables with Prisma Client and with Prisma Migrate.
//     Deleting all data with deleteMany
//     When you know the order in which your tables should be deleted, you can use the deleteMany function. This is executed synchronously in a $transaction and can be used with all types of databases.`,
//         published: true,
//         authorId: 2,
//     },

//     (err, res) => {
//         if (err) throw err;
//         console.log(res);
//     }
// );
