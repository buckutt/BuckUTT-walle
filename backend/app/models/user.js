
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');


/**
 * Schema
 */
var UserSchema = new Schema({
	slug            : String,
	email           : String,
	salt            : String,
	hashed_password : String,
	firstname       : String,
	lastname        : String,
	nickname        : String,
	city            : String,
	postalCode      : String,
	country         : String,
	color           : String,
	colorPoints     : Number,
	games           : Array,
	avatar          : String,
	achievements    : Array,
	isEnabled       : Boolean,
	isUTT           : Boolean,
	role            : String,
	token           : String,
	spotlightTeam   : { type: Schema.Types.ObjectId, ref: 'Team' }
});


/**
 * Virtual fields
 */
UserSchema
	.virtual('password')
	.set(function(password) {
		this._password = password;
		this.salt = this.makeSalt();
		this.hashed_password = this.encrypt(password);
	})
	.get(function() {
		return this._password;
	});


/**
 * Methods
 */
UserSchema.methods = {};

UserSchema.methods.authenticate = function(plain_password) {
	return this.hashed_password == this.encrypt(plain_password);
};

UserSchema.methods.makeSalt = function() {
	return crypto.createHash('sha1').update(new Buffer(tools.rand.string(32))).digest('hex').substr(0, 31);
};

UserSchema.methods.encrypt = function(plain_password) {
	if (! plain_password) {
		return '';
	}

	var salted = plain_password + '{'+ this.salt +'}';

	return crypto.createHash('sha512').update(new Buffer(salted)).digest('base64');
};


/**
 * API authorizations
 */
// Authorizations for the entire collection
UserSchema.statics.authorize = function(req) {
	var permissions = security.getPermissions(req.session.user);

	return {
		write: false,
		read: permissions.users.read
	};
};


/**
 * API statics
 */
UserSchema.statics.me = function(req, callback) {
	this.find({ _id: req.session.user._id }, callback);
};

UserSchema.statics.slug = function(req, callback) {
	this.findOne({ slug: req.query.slug }, callback);
};


mongoose.model('User', UserSchema);
