import { User } from "../models/user.model.js"
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js"

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(401).json({
                message: 'something is missing, please check!',
                success: false
            });
        }
        const user = await User.findOne({email})
        if(user) {
            return res.status(401).json({
                message: 'user already exists, try with another email or login with same!',
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            email,
            username,
            password: hashedPassword
        });
        return res.status(201).json({
            message: 'Account created successfully',
            success: true
        });
    } catch (err) {
        console.log(err)
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    if(!email || !password) {
        return res.status(401).json({
            message: 'something is missing, please check!',
            success: false
        });
    }

    const user = await User.findOne({email});
    if(!user) {
        return res.status(401).json({
            message: 'incorrect email or password!',
            success: false
        });
    }
    
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
        return res.status(401).json({
            message: 'incorrect email or password!',
            success: false
        });
    }
    user.password = undefined;
    const token = jwt.sign({userId: user._id}, process.env.SECRET_KEY, {expiresIn: '1d'});
    return res.cookie('token', token, {httpOnly: true, sameSite: 'strict', maxAge: 1*24*60*60*1000}).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
    });
    } catch (err) {
        console.log(err)
    }
}

export const logout = (_, res) => {
    try {
        return res.cookie('token', '', {maxAge: 0}).json({
            message: 'Logged out successfully!',
            success: true
        });
    } catch (err) {
        console.log(err)
    }
}

export const getProfile = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password')
        return res.status(200).json({
            user,
            success: true
        })
    } catch (err) {
        console.log(err)
    }
}

export const editProfile = async(req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const avatar = req.file;

        let cloudResponse;
        if(avatar) {
            const fileUri = getDataUri(avatar);
            cloudResponse = await cloudinary.uploader.upload(fileUri)
        }

        const user = await User.findById(userId).select('-password');
        if(!user) {
            return res.status(404).json({
                message: 'User not found!',
                success: false
            });
        }
        if(bio) user.bio = bio;
        if(gender) user.gender = gender;
        if(avatar) user.avatar = cloudResponse.secure_url;

        await user.save();

        user.password = undefined;
        return res.status(200).json({
            message: 'Profile updated successfully!',
            success: true,
            user
        })
    } catch (err) {
        console.log(err)
    }
}

export const suggestedUsers = async(req, res) => {
    try {
        const suggestedUsers = await User.find({_id: {$ne: req.id}}).select("-password");
        if(!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users!',
                success: false
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (err) {
        console.log(err)
    }
}

export const followOrUnfollow = async(req, res) => {
    try {
        const followKrneWala = req.id;
        const jiskoFollowKrunga = req.params.id;
        if(followKrneWala === jiskoFollowKrunga) {
            return res.status(400).json({
                message: `You can't follow/unfollow yourself!`,
                success: false
            })
        }
        const user = await User.findById(followKrneWala);
        const targetUser = await User.findById(jiskoFollowKrunga);

        if(!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found!',
                success: false
            })
        }

        const isFollowing = user.following.includes(jiskoFollowKrunga);
        if(isFollowing) {
            await Promise.all([
                User.updateOne({_id: followKrneWala}, {$pull: {following: jiskoFollowKrunga}}),
                User.updateOne({_id: jiskoFollowKrunga}, {$pull: {follower: followKrneWala}})
            ])
            return res.status(200).json({
                message: 'unfollow successfully',
                success: true,
            })
        }
        else {
            await Promise.all([
                User.updateOne({_id: followKrneWala}, {$push: {following: jiskoFollowKrunga}}),
                User.updateOne({_id: jiskoFollowKrunga}, {$push: {follower: followKrneWala}})
            ])
            return res.status(200).json({
                message: 'followed successfully',
                success: true,
            })
        }
    } catch (err) {
        console.log(err)
    }
}