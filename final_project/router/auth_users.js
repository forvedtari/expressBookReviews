const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  let UserDuplicateName = users.filter((user)=>{
    return user.username === username
  });
  if(UserDuplicateName.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let auth_users = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(auth_users.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
  
    if (!username || !password) {
        return res.status(404).send("Both field required !!");
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    req.session.username=username
    return res.status(200).send("User "+username+" successfully logged in");
   }
   else {
    return res.status(208).send("Invalid. Check username and password");
  }
});

// Add a book review 
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn=req.params.isbn;
  const book = books[isbn];
 if(book)
 {
     
    const username = req.session.username; 

    if (username) {
      const reviews=book.reviews
      let existingReview =reviews[username]

      if (existingReview) {
        book.reviews = req.query.review;
        res.send(`Book review for isbn ${isbn} updated.`);
      } else {
        book.reviews[username] = req.query.review;
        res.send(`Book review for isbn ${isbn} added.`);
      }
      
      books[isbn] = book; 
    }
 } 

  
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  const isbn=req.params.isbn;
  const book = books[isbn];
if(book)
{
   
  const username = req.session.username; 

  if (username) {
      const reviews=book.reviews
      if (username in reviews) {
          
          delete reviews[username];
          res.send(`Review for isbn ${isbn} deleted.`);
        }
     
     else {
      res.send(`Book review for isbn ${isbn} not found`);
    }
    
    books[isbn] = book; 
  }
} 

    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
