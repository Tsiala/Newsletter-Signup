const express = require("express");
const bodyParser = require("body-parser");
const request = require("request")
const http = require("node:http");

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
          email_address: email,
          status: "subscribed",
          merge_fields: {

            FNAME: firstName,
            LNAME: lastName,

          }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "http://us13.api.mailchimp.com/3.0/lists/6db099c763";
  const options = {
    method: "POST",
    auth: "Tsiala:2dc54eac283fb35f60fcc2544a111be0-us13"
  }

  const request = http.request(url, options, function(response){

    if(response.statusCode===200 || 426) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    //
    // response.on("data", function(data){
    //     console.log(JSON.parse(data));
    // });

    console.log(response.statusCode);

  })

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){

  console.log("Server is running on port 3000");
});


// api key
// 2dc54eac283fb35f60fcc2544a111be0-us13


// list id
// 6db099c763
