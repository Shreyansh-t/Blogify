const express = require("express");
const Blog = require("../models/blogs");
const Comment = require("../models/comment");
const multer = require("multer");
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
const upload = multer({ storage: storage })

router.get('/addBlog', (req, res)=>{
    res.render("addBlog", {
        user: req.user,
    });
})

router.post('/addBlog', upload.single('coverImage'), async (req, res)=>{
    const {title, body} = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
    return res.redirect(`blog/${blog._id}`);
});

router.get('/blog/:id', async (req, res) => {
    
    if (!req.user) {
        return res.redirect('/signin');
    }
    
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate("createdBy");
    console.log(blog);
    console.log("comments", comments);
    return res.render("blog",{
        user: req.user,
        blog,
        comments,
    });
});

router.post("/comment/:blogId", async (req, res)=>{
    const {content} = req.body;
    const comment = await Comment.create({
        content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    console.log("comment Created");
    console.log(comment);
    return res.redirect(`/blog/${req.params.blogId}`)
});

module.exports = router;