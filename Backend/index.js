require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model")
const Note = require("./models/note.model")

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utilites")

app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);

app.get("/" , (req,res) => {
    res.json({data : "hello"});
});

//create account
app.post("/create-account" , async (req ,res) => {

    const {fullName , email , password } = req.body;

    if(!fullName) {
        return res
        .status(400)
        .json({error: true , message: "Full Name is required"});
    }
    if(!email) {
        return res
        .status(400)
        .json({error: true , message: "Email is required"});
    }
    if(!password) {
        return res
        .status(400)
        .json({error: true , message: "Password is required"});
    }

    const isUser = await User.findOne({email: email})

    if(isUser){
        return res.json({
            error: true,
            message: "User already exist"
        });
    }

    const user = new User({
        fullName , email , password
    })

    await user.save();

    const accessToken = jwt.sign({ user } , process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    })

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registeration Successful"
    })
})

//login
app.post("/login" , async (req , res) => {
    const {email , password } = req.body;

    if(!email) {
        return res.status(400).json({
            error: true ,
            message: "Email is Required"
        })
    }

    if(!password) {
        return res.status(400).json({
            error: true ,
            message: "Password is Required"
        })
    }

    const userInfo = await User.findOne({email : email});

    if(!userInfo) {
        res.status(400).json({
            error : true,
            message : "User already Exist"
        })
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user : userInfo};
        const accessToken = jwt.sign(user , process.env.ACCESS_TOKEN_SECRET , {
            expiresIn: "36000m",
        })

        return res.json({
            error: false,
            message : "Loged in succesfully",
            email,
            accessToken
        })
    }
    else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials"
        })
    }
})

//get user
app.get("/getUser" , authenticateToken , async (req ,res) => {
    const { user } = req.user;

    const isUser = await User.findOne({
        _id : user._id,
    })
    
    if(!isUser) return res.status(400).json({
        error: true,
        message: "No User Found"
    })

    return res.json({
        error: false,
        user: isUser,
        message: "User is found"
    })

})

//Add a Note
app.post("/addNotes", authenticateToken, async (req, res) => {
    const { title, content, tag } = req.body;
    
    // Ensure user is attached to req from the authenticateToken middleware
    const user = req.user;

    if (!title) {
        return res.status(400).json({
            error: true,
            message: "Title is required"
        });
    }

    if (!content) {
        return res.status(400).json({
            error: true,
            message: "Content is required"
        });
    }

    try {
        const note = new Note({
            title,
            content,
            tag: tag || [],
            userId: user.user._id // Setting userId from req.user._id
        });
        await note.save();

        return res.json({
            error: false,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
});

//Edit a Note
app.put("/editNotes/:noteId" , authenticateToken , async (req , res) => {
    const noteId = req.params.noteId;
    const {title , content , tag , isPinned } = req.body;
    const {user} = req.user;

    if(!title && !content ) {
        return res.status(400).json({
            error: true,
            message: "Cannot Change"
        })
    }

    try{
        const note = await Note.findOne({_id: noteId , userId : user._id})

        if(!note){
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tag) note.tag = tag;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            message: "Edited succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
})

//Get all Note

app.get("/getAllNote" , authenticateToken , async (req , res) => {
    const { user } = req.user;
    try{
        const notes = await Note.find({
            userId : user._id
        }).sort({ isPinned: -1});

        return res.json({
            error: false,
            notes,
            message: "All notes retrived succesfully"
        })
    }
    catch (error){
        // console.log(error)
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
})

//delete a note
app.delete("/deleteNotes/:noteId" , authenticateToken , async (req ,res) => {
    const noteId = req.params.noteId;
    // const {title , content , tag , isPinned } = req.body;
    const { user } = req.user;

    try{
        const note = await Note.findOne({_id : noteId , userId: user._id});

        if(!note){
            return res.status(400).json({
                error: true,
                message: "Note not found"
            })
        }

        await Note.deleteOne({
            _id: noteId,
            userId: user._id
        });

        return res.json({
            error: false,
            message:"Note successfully deleted"
        })
    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
})

//update isPinned
app.put("/updateNotesPinned/:noteId" , authenticateToken , async (req ,res) => {
    const noteId = req.params.noteId;
    const {isPinned } = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId , userId : user._id})

        if(!note){
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            message: "Edited succesfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
})

app.listen(8000);

module.exports = app;