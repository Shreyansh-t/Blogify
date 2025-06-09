const {Schema, model} = require('mongoose');
const {createHmac, randomBytes} = require("node:crypto");
const {createTokenForUser, validateToken} = require("../services/authentication");

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: '/images/default.png',
    },
    role:{
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
},
{timestamps: true});

userSchema.pre("save", function(next){
    const user = this;

    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString;
    const hashPassword = createHmac('sha256', salt).update(user.password).digest("hex");
    
    this.salt = salt;
    this.password = hashPassword;

    next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function(email, password) {

    const user = await User.findOne({email});
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");

    let isMacthed = false;

    if(hashedPassword === userProvidedHash){
        isMacthed = true;
    }
    else{
        throw new Error('Password does not match');
    }
    const token = createTokenForUser(user);
    return token;
};

const User = model("user", userSchema);

module.exports = User;