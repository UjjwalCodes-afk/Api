import mongoose, {Document, Schema} from "mongoose"
const formSchema = new mongoose.Schema({
    firstName : {type : String, required : true},
    role :  {type : String, enum : ['admin', 'user'], default : 'user'},
    lastName : {type : String, required : true},
    phoneNumber : {type : String, required : true},
    email : {type : String, required : true},
    password : {type : String, required : true},
    confirmPassword : {type : String, required : true},
},
{timestamps :true}
);

export const Form = mongoose.model<FormModel>("users", formSchema);
export interface FormModel{
    firstName : string,
    lastName : string,
    phoneNumber : String,
    email : string,
    password : string,
    confirmPassword : string,
    role : 'admin' | 'user'
}

