const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
require("dotenv").config();

const apiKey = process.env.APIKEY;
const uniqueId = process.env.ListId;
const serverId = process.env.serverNum;


const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html"); 
});

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailId = req.body.eId;

    const data = {
        members: [
            {
            email_address : emailId,
            status : "subscribed",
            merge_fields : {
                FNAME : firstName,
                LNAME : lastName
            }
        }
    ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us"+serverId+".api.mailchimp.com/3.0/lists/"+uniqueId+"/";

    const options = {
        method: "POST",
        auth: "anyone:"+apiKey
    }

    const request = https.request(url, options,function(response) {
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
            // if(data.error_count===0){
            //     console.log("No Errors")
            // }
            // else{
            //     console.log("Error")
            // }
        })
    })

    request.write(jsonData); //with this we are pasing json data to mailchimp server
    request.end();

});


//failure route

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.post("/success",function(req,res){
    res.redirect("/");
});






app.listen(process.env.PORT || 3000,function(){
    console.log("Connected Sucessfully to port 3000")
});

