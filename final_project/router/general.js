const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});


// Get the book list available in the shop asychronously with axios
public_users.get('/books',async function (req, res) {
 // res.send(JSON.stringify(books, null, 4));
 try {
     const response = await axios.get('https://vedanti23145-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'); 
     const booklist = response.data;
     res.send(JSON.stringify(booklist, null, 4));
   } catch (error) {
     res.status(500).send('Something went wrong');}
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn= req.params.isbn
//     res.send(books[isbn])
//  });

 // Get book details based on ISBN with promises
 public_users.get('/isbn/:isbn',function (req, res) {
  const isbn= req.params.isbn
  const book = books[isbn]
    // res.send(books[isbn])
    let foundBook=new Promise((resolve,reject) =>{
      setTimeout(() => {
          if(book){
            resolve(book);
          }
        }, 100)
    })

    foundBook.then((book)=>{
        res.send(book)
    })
    .catch((error)=>{
        res.stattus(500).send("Something went wrong")
    })
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const Author= req.params.author
//     const Books = books;
//     let obj=[];
//     for (key in Books) {
//         var book = Books[key];
//            if(book.author === Author){
//              obj.push(Books[key]);

//            }
           
//       };
//       res.send(obj);
// });
// Get book details based on author using promises
public_users.get('/author/:author',function (req, res) {
  const Author= req.params.author
  const Books = books;
    let foundBook=new Promise((resolve,reject)=>{
      setTimeout(() => {
          let obj=[];
          for (key in Books) {
              var book = Books[key];
                 if(book.author === Author){
                   obj.push(Books[key]);
      
                 }
                 
            };
          resolve(obj)
        }, 100)   
    })

    foundBook.then((obj)=>{
      res.send(obj);
    }
    )
    .catch((error)=>{
        res.status(500).send("Something went wrong")
    })
});


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const Title= req.params.title
//   const Books = books;
//   let obj=[];
//   for (key in Books) {
//       var book = Books[key];
//          if(book.title === Title){
//            obj.push(Books[key]);

//          }
         
//     };
//     res.send(obj);
// });

// Get all books based on title using Promises
public_users.get('/title/:title',function (req, res) {
  const Title= req.params.title
  const Books = books;
  let foundBook=new Promise((resolve,reject)=>{
      setTimeout(() => {
          let obj=[];
          for (key in Books) {
              var book = Books[key];
                 if(book.title === Title){
                   obj.push(Books[key]);
      
                 }
                 
            };
          resolve(obj)
        }, 100)   
    })

    foundBook.then((obj)=>{
      res.send(obj);
    }
    )
    .catch((error)=>{
        res.status(500).send("Something went wrong")
    })
  
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn= req.params.isbn
  const book=books[isbn]
  res.send(book.reviews)
});

module.exports.general = public_users;
