var express = require('express');
var router = express.Router();

const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport'); // used for authentication

//used to make user login
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

//multer 
const upload = require("./multer")


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
  const errors = req.flash('error');
  res.render('login', { error: Array.isArray(errors) ? errors : [errors] });
});
// initially error array is empty   
// blank arrAY is sent to login.ejs page


router.get('/feed', function (req, res, next) {
  res.render('feed')
});
router.get('/index', function (req, res, next) {
  res.render('index')
});

router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res, next) {
  if (!req.file) {
    return res.status(404).send('No files were uploaded')
  }
  //jo file upload hui hai usse save kro as a post and uska postid user ko do aur userid post ko do
  // comment out code below

  const user = await userModel.findOne({ username: req.session.passport.user });
  const postdata = await postModel.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id
  });
  user.posts.push(postdata._id); // Fixed the variable name
  await user.save(); // will save the post on db under the user profile
  res.send("Done!");
});


router.get("/profile", isLoggedIn, async function(req, res, next){
  const user = await userModel.findOne({
    username : req.session.passport.user
  });
  res.render("profile", { user });
});

router.post('/edit-profile', isLoggedIn, async function (req, res, next) {
  try {
    // Update user's profile information in the database
    const updatedUser = req.body; // Assuming the form fields have the same names as the user schema fields
    const user = await userModel.findByIdAndUpdate(req.user._id, updatedUser, { new: true });
    if (!user) {
      // Handle case where user is not found
      return res.status(404).send('User not found');
    }
    res.redirect('/profile');
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).send('An error occurred while updating the profile');
  }
});





router.post("/register", function (req, res) {
  const { username, email } = req.body;
  const userData = { username, email };

  userModel.register(userData, req.body.password).then(function () {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true //create flash msg
}), function (req, res) {

})

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

router.get('/edit-profile', isLoggedIn, function (req, res, next) {
  res.render('edit-profile', { user: req.user });
});

router.post('/edit-profile', isLoggedIn, async function (req, res, next) {
  try {
    // Update user's profile information in the database
    const updatedUser = req.body; // Assuming the form fields have the same names as the user schema fields
    const user = await userModel.findByIdAndUpdate(req.user._id, updatedUser, { new: true });
    if (!user) {
      // Handle case where user is not found
      return res.status(404).send('User not found');
    }
    res.redirect('/profile');
  } catch (error) {
    // Handle error
    console.error(error);
    res.status(500).send('An error occurred while updating the profile');
  }
});



module.exports = router;



































// router.get('/alluserposts', async  function (req, res, next)
// {
//   let user = await userModel.findOne({_id: "66124e3bdaee426431ed296c"})
//   .populate('posts')
//   res.send(user);
// });

// router.get('/createuser', async function(req, res, next)
// { 
//   let createduser = await userModel.create({
//   username: "Aditi",
//   password: "Aditi",
//   posts: [],
//   email: "aditi@gmail.com",
//   fullName: "Aditi Sharma",
// });

// res.send(createduser);
// });

// router.get('/createpost', async function(req, res, next)
// { 
//   let createdpost = await postModel.create({
//     postText: "Hello, everyone",
//     user: "66124e3bdaee426431ed296c"
//   });
//     // whenever now post will be created , it will have the user id of the user who have created the post
//    let user = await userModel.findOne({_id: "66124e3bdaee426431ed296c" });
//    user.posts.push(createdpost._id);
//    // user ke andr ek array hai jisme humne push krdi createduser ki id
//    await user.save();
//    res.send("Done");
// });
