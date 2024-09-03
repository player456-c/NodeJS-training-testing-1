const express = require('express');
const router = express.Router();


let users = [
    {
        firstName: "John",
        lastName: "Wick",
        email:"johnwick@gamil.com",
        DOB:"22-01-1990",
    },
    {
        firstName: "John",
        lastName: "Smith",
        email:"johnsmith@gamil.com",
        DOB:"21-07-1983",
    },
    {
        firstName: "Joyal",
        lastName: "White",
        email:"joyalwhite@gamil.com",
        DOB:"21-03-1989",
    },
    {
        firstName: "James",
        lastName: "White",
        email:"jameswhite@gamil.com",
        DOB:"22-03-1989",
    },
];

// GET request: Retrieve all users
router.get("/",(req,res)=>{
    //Declaring empty result string
    /* let result="";
    //Iterating through users array
    for(let i of users){
        result+="{\n";
        //Iterating through props of users[i]
        for (const prop in i) {
            result+=(`\t${prop}: ${i[prop]}\n`);
        };
        result+="},\n";
    }; */
    //res.send(result);
    res.send(JSON.stringify({users},null,4));
    //console.log(JSON.stringify({users},null,4));
});

router.get("/lastName/:lastName",(req,res)=>{
    let lastName=req.params.lastName;
    let filtered_users=users.filter((user)=>user.lastName===lastName)
    let result="";
    //Iterating through users array
    if(filtered_users!=0){
        for(let i of filtered_users){
            result+="{\n";
            //Iterating through props of users[i]
            for (const prop in i) {
                result+=(`\t${prop}: ${i[prop]}\n`);
            };
            result+="},\n";
        };
        res.send(result);
    }else{
        res.send(`Users with last name ${lastName} not found.\n`);
    };
});

//Convert a date in "dd/mm/yyyy" format to a Date object
function getDateFromString(strDate) {
    let [dd, mm, yyyy] = strDate.split('-');
    return new Date(yyyy + "/" + mm + "/" + dd);
};

// Define a route handler for GET requests to the "/sort" endpoint
router.get("/sort", (req, res) => {
    // Sort the users array by DOB in ascending order
    let sorted_users = users.sort(function(a, b) {
        let d1 = getDateFromString(a.DOB);
        let d2 = getDateFromString(b.DOB);
        return d1 - d2;
    });
    // Send the sorted_users array as the response to the client
    res.send(sorted_users);
});

// GET by specific ID request: Retrieve a single user with email ID
router.get("/:email",(req,res)=>{
    // Copy the code here
    let result="";
    let email=req.params.email;
    let filteredUser=users.filter((user)=>user.email===email);
    //console.log(filteredUser);
    if(filteredUser==0){
        res.send("User not found.\n")
    }else{
        result+="{\n";
        //Iterating through props of filteredUser[0]
        for (const prop in filteredUser[0]) {
            result+=(`\t${prop}: ${filteredUser[0][prop]}\n`);
        };
        result+="}\n";
        res.send(result);
    };
});


// POST request: Create a new user
router.post("/",(req,res)=>{
    // Copy the code here
    users.push({
        "firstName": req.query.firstName,
        "lastName": req.query.lastName,
        "email": req.query.email,
        "DOB": req.query.DOB
    });
    res.send("The user "+req.query.firstName+" is added!\n");
});


// PUT request: Update the details of a user by email ID
router.put("/:email", (req, res) => {
    // Extract email parameter and find users with matching email
    const email = req.params.email;
    let filtered_users = users.filter((user) => user.email === email);
    
    if(filtered_users.length > 0) {
        // Select the first matching user and update attributes if provided
        let filtered_user = filtered_users[0];
        
         // Extract and update parameteres if provided
        
        let firstName = req.query.firstName;
        let lastName = req.query.lastName;
        let DOB = req.query.DOB;   
        if (firstName) {
            filtered_user.firstName = firstName;
        };
        if (lastName) {
            filtered_user.lastName = lastName;
        };
        if (DOB) {
            filtered_user.DOB = DOB;
        };
        
        // Replace old user entry with updated user
        users = users.filter((user) => user.email != email);
        users.push(filtered_user);
        
        // Send success message indicating the user has been updated
        res.send(`User with the email ${email} updated.\n`);
    }else{
        // Send error message if no user found
        res.send("Unable to find user.\n");
    }
});


// DELETE request: Delete a user by email ID
router.delete("/:email", (req, res) => {
    // Extract the email parameter from the request URL
    const email = req.params.email;
    // Filter the users array to exclude the user with the specified email
    users = users.filter((user) => user.email != email);
    // Send a success message as the response, indicating the user has been deleted
    res.send(`User with the email ${email} deleted.\n`);
});

module.exports=router;
