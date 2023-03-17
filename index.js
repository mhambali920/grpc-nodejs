// TODO: UI with ejs
const express = require("express");
const service = require("./src/client");
const PROTO_PATH_USER = "./src/proto/user.proto";

const userClient = service.loadService(PROTO_PATH_USER, "UserService");

// userClient.getUsers({}, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.updateUser({ id: 4, name: "John update lagi aja" }, (error, response) => {
//     if (error) throw error;
//     console.log(response);
// });

// userClient.deleteUser({ id: 4 }, (err, res) => {
//     if (err) throw err;
//     console.log(res);
// });