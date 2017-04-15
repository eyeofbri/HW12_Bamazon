var inquirer = require("inquirer");
var mysql = require("mysql");

var programStarted = false;


//NOTES:
//Running this application will...
//... first display all of the items available for sale. 
//... ...Include the ids, names, and prices of products for sale

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
	
	// resetStock();

	console.log("\x1b[1m%s\x1b[0m",
		"\n\n\n\n\n\n\n\n"
		+"Welcome to Brian's MySQL Marketplace App!\n"
		+"You are a Customer, connected as id " +connection.threadId +"\n"
		+returnHR() 
	);

	viewProducts();
});


function resetStock() {
	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 10 }, { item_id: 1 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 10 }, { item_id: 2 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 2 }, { item_id: 3 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 5 }, { item_id: 4 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 3 }, { item_id: 5 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 4 }, { item_id: 6 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 10 }, { item_id: 7 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 5 }, { item_id: 8 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 4 }, { item_id: 9 }], function(err, res) {});

	connection.query("UPDATE products SET ? WHERE ?", [{ 
	stock_quantity: 8 }, { item_id: 10 }], function(err, res) {});
}





function mainPrompts() {
	console.log(returnHR() + "\n");

	inquirer.prompt([
		{
		    type: "list",
	    	message: mainMessage(),
	    	choices: [
	    		"Purchase A Product", 
	    		"View Products",
	    		"Quit"
	    	],
	    	name: "command"
		}
	]).then(function(results) {

		switch (results.command) {
		  case "Purchase A Product":
		    purchase(1);
		    break;

		  case "View Products":
		    viewProducts();
		    break;

		  case "Quit":
		    console.log("\nYou Quit Brian's MySQL Marketplace App.\n\n\n");
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



//NOTES:
// The app should then prompt users with two messages.

// The first should ask them...
//...for  the ID of the product they would like to buy.

// The second message should ask...
//...how many units of the product they would like to buy.

function viewProducts() {
	connection.query("SELECT * FROM products", function(err, res) {
	if (err) throw err;
	
	console.log("\nPRODUCT LISTING:\n");
  	for (var i = 0; i < res.length; i++) {
  		
  		//CHECK if ITEM is in stock
  		var stockCheck = "Yes";
  		if(res[i].stock_quantity <= 0){
  			stockCheck = "No";
		}
		console.log(
			res[i].item_id 
			+ " : " + res[i].product_name 
			+ " | Price: " + res[i].price
			+ " | In Stock: " + stockCheck 
			+ "("+res[i].stock_quantity + ")"
		);
	}
	mainPrompts();
	});
}

function purchase(which, answer1) {
	var question = "";
	if(which == 1){ question = "What is the ID of the product you would like to buy?"; }
	if(which == 2){ question = "How many units would you like to buy?"; }

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

		//Once the customer has placed the order, 
		//check if your store has enough of the product to meet the customer's request.
		var currentStock = res[0].stock_quantity;

		if(currentStock <= 0){
			//If not in stock, 
			//the app should log a phrase 
			//like Insufficient quantity!, 
			//and then prevent the order from going through.

			console.log(
				"\nSORRY SHOPPER, " 
				+res[0].product_name
				+ " is Sold Out.\n"
			);

			mainPrompts();
		}else{

			//if in stock...
			//...fulfill the customer's order.
			

			//how many can i buy? 
			//(i might want More than are in stock)
			if(quantityWanted > currentStock){
				console.log(
					"\nSorry, we only have " +currentStock+
					" in stock, but we will sell you all of them.\n" 
				);
				quantityWanted = currentStock;
			}

			//Update the SQL database to reflect the remaining quantity.
			connection.query("UPDATE products SET ? WHERE ?", [{
			  stock_quantity: (currentStock - quantityWanted)
			}, { item_id: sentID
			}], function(err, res) {

				//Once the update goes through,...
				//...show the customer the total cost of their purchase.
				printReceipt(sentID, quantityWanted);
				
			});

			
		}


	});

};



function printReceipt(itemID, quantityPurchased) {
	connection.query("SELECT * FROM products WHERE ?", { item_id: itemID}, function(err, res) {

		var price_withoutTax = parseFloat(res[0].price * quantityPurchased).toFixed(2);

		var tax = 0.06875;
		var salesTax = (price_withoutTax * tax).toFixed(2);

		var price_total = (parseFloat(price_withoutTax) + parseFloat(salesTax) ).toFixed(2);

		console.log(
			returnHR()

			+ "\n\nMySQL Marketplace App\n"

			+ "CUSTOMER RECEIPT COPY \n\n"

			+ new Date() + "\n\n"

			//product name
			+ res[0].product_name 

			//retrieve spaces to position the price on the right side
			+ returnSpaces(res[0].product_name, price_withoutTax )
			+price_withoutTax

			//how many the customer purchased
			+ "\nQTY " + quantityPurchased
			+ " @" + res[0].price
			+ "\n\n"

			//sales tax 
			+ "NJ 6.875%"
			+ returnSpaces("NJ 6.875%", salesTax )
			+ salesTax
			+ " \n\n"

			//full total
			+ "TOTAL"
			+ returnSpaces("TOTAL", price_total )
			+ price_total
			+ "\n"
		);

		//return back to main
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



function returnSpaces(a1, a2) {
	var spaces = process.stdout.columns;
	if(process.stdout.columns == null){ spaces = 10; }

	// console.log(spaces + "--" + a1.length + "---" + a2.toString().length);
	spaces = spaces - (a1.length);
	spaces = spaces - (a2.toString().length) - 3;
	if(spaces <=0){ spaces = 3;}
	// if(spaces >25){ spaces = 25;}

	s = "   ";

	for (var i = 0; i < spaces; i++) {
		s = s + " ";
	}

	return s;
}

