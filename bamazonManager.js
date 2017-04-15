var inquirer = require("inquirer");
var mysql = require("mysql");

var programStarted = false;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
	if (err) throw err;
	// console.log("connected as id " + connection.threadId);
	
	console.log("\x1b[1m%s\x1b[0m",
		"\n\n\n\n\n\n\n\n"
		+"Welcome to Brian's MySQL Marketplace App!\n"
		+"You are a Manager, connected as id " +connection.threadId +"\n"
		+returnHR() 
	);

	viewProducts("ALL");
});


//DELETE PRODUCTS
// connection.query("DELETE FROM products WHERE ?", {
//   product_name: "best hat"
// }, function(err, res) {});


function mainPrompts() {
	inquirer.prompt([
		{
		    type: "list",
	    	message: mainMessage(),
	    	choices: [
	    		"View Products for Sale", 
	    		"View Low Inventory", 
	    		"Add to Inventory",
	    		"Add New Product", 
	    		"Quit"
	    	],
	    	name: "command"
		}
	]).then(function(results) {

		switch (results.command) {
		  case "View Products for Sale":
		    viewProducts("ALL");
		    break;

		  case "View Low Inventory":
		    viewProducts("LOW");
		    break;

		  case "Add to Inventory":
		   	purchase(1);
		    break;

		  case "Add New Product":
		    addProductPromts("get name");
		    break;

		  case "Quit":
		    console.log("\nYou Quit Brian's Liri CLI App.\n\n\n");
		    connection.end();
		    break;
		}

	});
}


function mainMessage() {
	var choices = [", Now", ", Next", ", This Time", ""];
	if(programStarted == true){ 
		return ("What would you like to do"
			+choices[Math.floor(Math.random() * 4 )]+"?\n" );
	}else{ 
		programStarted = true; 
		return ("What would you like to do?\n"); 
	}
}







function viewProducts(which) {
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;
	
		console.log("\n"+which+" PRODUCT LISTING:\n");
  		for (var i = 0; i < res.length; i++) {
  		
	  		//CHECK if ITEM is in stock
	  		var stockCheck = "Yes";
	  		if(res[i].stock_quantity <= 0){
	  			stockCheck = "No";
			}

			if(which == "ALL"
				|| which == "LOW" 
				&& res[i].stock_quantity < 5){
				console.log(
					res[i].item_id 
					+ " : " + res[i].product_name 
					+ " | Price: " + res[i].price
					+ " | In Stock: " + stockCheck 
					+ "("+res[i].stock_quantity + ")"
				);
			}
		}
		console.log(returnHR());
		mainPrompts();
	});
}



function purchase(which, answer1) {
	var question = "";
	if(which == 1){ question = "What is the ID of the product you would like to purchase more of?"; }
	if(which == 2){ question = "How many additional units would you like to buy?"; }

	inquirer.prompt([
		{
		    type: "input",
		    message: question,
		    name: "user_input"
		}
	]).then(function(results) {
		if(which == 1){

			if( isNaN(results.user_input) 
				|| results.user_input.trim().length == 0){
				//restart
				purchase(1);
			}else{
				//can continue
				purchase(2, results.user_input);
			}

		}
		if(which == 2){

			if( isNaN(results.user_input) 
				|| results.user_input.trim().length == 0){
				//restart
				purchase(2, answer1);
			}else{
				//can continue
				placeOrder(answer1, results.user_input);
			}
		}
	});

}



function placeOrder(sentID, quantityWanted) {
	connection.query("SELECT * FROM products WHERE ?", { item_id: sentID}, function(err, res) {

		var pName = res[0].product_name;
		var currentStock = res[0].stock_quantity;

		//Update the SQL database to reflect the remaining quantity.
		connection.query("UPDATE products SET ? WHERE ?", [{
		  stock_quantity: (parseFloat(currentStock) + parseFloat(quantityWanted))
		}, { item_id: sentID
		}], function(err, res) {

			console.log(
				"\nYou Purchased "
				+ quantityWanted 
				+ " of " 
				+ pName
				+ "\n"
				+ returnHR()
			);

			mainPrompts();
			
		});


	});

};


function addProductPromts(whatToDo, name, price, department, stock) {
	var question = "";

	if(whatToDo == "get name"){
		question = "\nPlease enter the Name of the new product"
	}
	if(whatToDo == "get price"){
		question = "\nPlease enter the Price of the new product"
	}
	if(whatToDo == "get department"){
		question = "\nPlease enter the Department of this product"
	}
	if(whatToDo == "get stock"){
		question = "\nPlease enter the Amount of product to order"
	}



	inquirer.prompt([
		{
		    type: "input",
		    message: question,
		    name: "user_input"
		}
	]).then(function(userResults) {
		if(whatToDo == "get name"){
			if( userResults.user_input.trim().length == 0){	
				addProductPromts("get name");
			}else{
				addProductPromts("get price", userResults.user_input);
			}
		}
		if(whatToDo == "get price"){
			if( isNaN(userResults.user_input) 
			|| userResults.user_input.trim().length == 0){
				addProductPromts("get price", name);
			}else{
				addProductPromts("get department", name, userResults.user_input);
			}
		}

		if(whatToDo == "get department"){
			if( userResults.user_input.trim().length == 0){		
				addProductPromts("get department", name, price);
			}else{
				addProductPromts("get stock", name, price, userResults.user_input);	
			}
		}

		if(whatToDo == "get stock"){
			if( isNaN(userResults.user_input) 
			|| userResults.user_input.trim().length == 0){		
				addProductPromts("get stock", name, price, department);
			}else{
				createProduct(name, price, department, userResults.user_input);	
			}
		}
	});
}


function createProduct(n, p, d, s) {
	connection.query("INSERT INTO products SET ?", {
		product_name: n,
		price: p,
		department_name: d,
		stock_quantity: s
	}, function(err, res) {
		console.log(
			"\n"
			+ s 
			+" of "
			+ n 
			+ " added to Inventory.\n"
			+ returnHR()
		);

		mainPrompts();
	});
}



//////////////////////////////
//START 
//RE-USABLE FUNCTIONS
//////////////////////////////


function returnHR() {
	var col = process.stdout.columns;
	var myHR = "";
	if(process.stdout.columns != null){
		for (var i = 0; i < col; i++) {
			myHR = myHR + "_";
		}
		
	}else{ myHR = "__________"; }

	return myHR;
}