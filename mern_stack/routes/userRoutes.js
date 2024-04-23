// routes/userRoutes.js

// controls user requests such as login and registration

const bcrypt = require('bcrypt');
const User = require('../client/models/User');

module.exports = function(app) {

	// handles registration
	app.post('/register', async (req, res) => {
		const {username, email, password, role} = req.body;
		console.log("registering user "+username);
		try {

			// Prepare username and password for regex check
			const lowercaseUsername = username.toLowerCase();
			const lowercasePassword = password.toLowerCase();
			
			// Check if any keywords are in username or password
			const mongodbKeywordsRegex = /(\$eq|\$gt|\$gte|\$in|\$lt|\$lte|\$ne|\$nin|\$and|\$not|\$nor|\$or|\$exists|\$type|\$expr|\$jsonSchema|\$mod|\$regex|\$text|\$where|\$geoIntersects|\$geoWithin|\$near|\$nearSphere|\$all|\$elemMatch|\$size|\$bitsAllClear|\$bitsAllSet|\$bitsAnyClear|\$bitsAnySet|\$|\$elemMatch|\$meta|\$slice|\$comment|\$rand|\$currentDate|\$inc|\$min|\$max|\$mul|\$rename|\$set|\$setOnInsert|\$unset|\$|\$\[\]|\$\[<identifier>\]|\$addToSet|\$pop|\$pull|\$push|\$pullAll|\$each|\$position|\$slice|\$sort|\$bit)/i;
			if (mongodbKeywordsRegex.test(lowercaseUsername)) {
				console.log("Username contains mongodb keyword");
				return res.status(400).json({msg: 'Username contains mongodb keywords'});
			}
			if (mongodbKeywordsRegex.test(lowercasePassword)) {
				console.log("Password contains mongodb keyword")
				return res.status(400).json({msg: 'Password contains mongodb keywords'});
			}

			// find user
			let user = await User.findOne({email});

			if (user) {
				return res.status(400).json({msg: 'User already exists'});
			}

			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// create our new user
			user = new User({
				username,
				email,
				password: hashedPassword,
				role: role
			});
			
			await user.save();
			
			return res.status(201).json({msg: 'User registered successfully'});

		} catch (err) {
			console.error('Error registering user:', err);
			return res.status(500).json({ msg: 'Server Error' });
		}
	});

	// handles login
	app.post('/login', async (req, res) => {
		const {username, password} = req.body;
		console.log("login from user "+username);
		try {
			const user = await User.findOne({$or: [{username}, {email: username}]});

			if (!user) {
				return res.status(401).json({msg: 'Invalid credidentials.'});
			}

			// compare hashed password with provided password
			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!passwordMatch) { // Change to password != user.password before running server.js to login w/ plaintext
				return res.status(401).json({msg: 'Invalid credidentials.'});
			}

			// if we want to use jwt tokens
			// const token = jwt.sign({userId: user._id}, 'your_secret_key', {expiresIn: '1h'});
			res.json({user});
			
		} catch (err) {
			console.error('Error registering user:', err);
			res.status(500).json({msg: "Server Error"});
		}
	});

	// handles getting all users
	app.get('/getAllUser', async (req, res) => {
		try {
			console.log("getting all users");
			const users = await User.find();
			res.status(200).json({ users });
		} catch (err) {
			console.error('Error fetching users:', err);
			res.status(500).json({msg: 'Failed to fetch users' });
		}
	});
}