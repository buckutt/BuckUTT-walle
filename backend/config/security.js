
exports.permissions = {
	anonymous: {
		users : {
			read : false
		},

		teams : {
			read : false
		},

		animations : {
			read : true
		}
	},

	player: {
		users : {
			read : true
		},

		teams : {
			read : true
		},

		animations : {
			read : true
		}
	},

	admin: {
		users : {
			read : true
		},

		teams : {
			read : true
		},

		animations : {
			read : true
		}
	}
};
