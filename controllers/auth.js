const User = require('../models/User');

//@desc     register user
//@routes   POST /api/v1/auth/register
//@access   public
exports.register=async(req, res, next) => {
    try {
        const {name, email, tel, password, role} = req.body;
        const user = await User.create({
            name,
            email,
            tel,
            password,
            role
        })

        //const token = user.getSignedJwtToken();
        //res.status(200).json({success:true, token});
        sendTokenResponse(user,200,res);

    } catch (err) {
        res.status(400).json({success:false, message: err.message});
        console.log(err.stack);
    }
};

//@desc     Login user
//@routes   POST /api/v1/auth/login
//@access   public
exports.login=async(req, res, next) => {
    try{

        const {email, password} = req.body;
        if(!email || !password){
            res.status(400).json({success:false, msg: 'Plese provide an email and password'});
        }

        const user = await User.findOne({email}).select('+password');

        if(!user){
            res.status(400).json({success:false, msg: 'Invalid credentials'}); 
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            res.status(400).json({success:false, msg: 'Invalid credentials'}); 
        }

        //const token = user.getSignedJwtToken();
        //res.status(200).json({success:true, token});
        sendTokenResponse(user,200,res);
    } catch (err){
        console.log(err.stack);
        return res.status(401).json({success:false, message:'Not authorize to access this route'});
    }
};

const sendTokenResponse=(user, statusCode, res) =>{
    const token = user.getSignedJwtToken();
    const days = parseInt(process.env.JWT_COOKIE_EXPIRE, 10);
    const options = {
        expires: new Date(Date.now() + days*24*60*60*1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }
    res.status(statusCode).cookie('token', token, options).json({success:true, _id: user._id, name: user.name, role: user.role, email:user.email, token});
}

//@desc     get currend loggrd user
//@routes   POST /api/v1/auth/me
//@access   private
exports.getMe = async(req, res, next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({success:true, data:user});
}


//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        data: {}
    });
};