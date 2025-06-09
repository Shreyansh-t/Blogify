require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require('./models/blogs');


mongoose.connect(process.env.MONGO_URL).then(e => console.log('MongoDB'));

const app = express();
const PORT = process.env.PORT || 1000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));

app.get("/", async (req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home", {
        user: req.user,
        blogs: allBlogs,
    });
});

app.use('/', userRouter);
app.use('/', blogRouter);

app.listen(PORT, ()=> console.log(`Server Started on port ${PORT}`));