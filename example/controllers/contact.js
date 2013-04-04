
exports.controller = (function(){

	function contact() {
	}

	contact.prototype.ng_card_$id = function(context, id) {
		context.res.json({
			id: context.req.params.id,
			name: {first: "John", last: "Doe"},
			age: '33',
			telephone: '123 456 7890'
		});
	}
	
	return contact;
})();

