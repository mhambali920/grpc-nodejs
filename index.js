// TODO: UI with ejs
const express = require("express");
const app = express();
const service = require("./src/client");
const PROTO_PATH_USER = "./src/proto/user.proto";
const PROTO_PATH_POST = "./src/proto/post.proto";

const userClient = service.loadService(PROTO_PATH_USER, "UserService");
const postClient = service.loadService(PROTO_PATH_POST, "PostService");

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
postClient.getPosts({}, (err, res) => {
    if (err) throw err;
    console.log(res);
});
postClient.addPost(
    {
        title: "Post Petamax",
        content: `Delete all records from all tables
    Sometimes you want to remove all data from all tables but keep the actual tables. This can be particularly useful in a development environment and whilst testing.
    
    The following shows how to delete all records from all tables with Prisma Client and with Prisma Migrate.
    
    Deleting all data with deleteMany
    When you know the order in which your tables should be deleted, you can use the deleteMany function. This is executed synchronously in a $transaction and can be used with all types of databases.`,
        published: true,
        authorId: 2,
    },

    (err, res) => {
        if (err) throw err;
        console.log(res);
    }
);
