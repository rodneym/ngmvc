
exports.controller = (function(){

	function contact() {
	}

	contact.prototype.ng_card = function(context) {
		context.res.json({
			name: {first: "John", last: "Doe"},
			age: '33',
			telephone: '123 456 7890'
		});
	}
	
	return contact;
})();

