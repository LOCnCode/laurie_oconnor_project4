

//when the user clicks on one of them
//display more information about that recipe

const recipeApp = {};  //recipeApp object, everything is stored in here

// http://api.yummly.com/v1/api/recipes?_app_id=app-id&_app_key=app-key&your _search_parameters
recipeApp.baseApiUrl = "http://api.yummly.com/v1/api/recipes";
recipeApp.appId = "6f7badbf";
recipeApp.appKey = "460afd38d8d0b88875e8074010d82259";

recipeApp.init = function() {
	recipeApp.getRecipes("vodka");
	recipeApp.events();
};

//get a list of recipes
recipeApp.getRecipes = function(alcohol) {  //alcohol
	$.ajax({
		url: recipeApp.baseApiUrl,   //this is adding to the end of the base URL
		method: "GET",
		dataType: "json",
		data:{
			_app_id: recipeApp.appId,
			_app_key: recipeApp.appKey,
			requirePictures: "true",
			allowedIngredient: alcohol,  //this will change from string to just alcohol to allow this to be the userschoice
			excludedIngredient: "eggnog",
			q: "cupcake"
		}
	})
	.then(function(recipes) {

	  recipeApp.showData(recipes);
	});
};

$("#alcohol-select").on("click", "a", function(){
    // console.log("new alcohol selected");
    var alcohol = $(this).attr("id");
		console.log(alcohol);
		recipeApp.getRecipes(alcohol);
});

// wrap event listener, on submit do this function
recipeApp.getUserChoice = function() {
	var usersChoice = $('input').val();
	console.log(usersChoice);
	recipeApp.getRecipes(usersChoice);

}

recipeApp.showData = function(recipes) {

	$('#app').empty();

	recipes.matches.forEach(function(recipe){
		// console.log(recipe.imageUrlsBySize['90']);
			// $(".recipeContainer").remove();
			const recipeWrapper = $("<div>").addClass("recipeWrapper");
			const recipeContainer = $("<div>").addClass("recipeContainer container");
			const recipeName = $("<h2>").text(recipe.recipeName).addClass("recipeName");
			const recipeImage = $("<div>").css({"background-image": `url(${recipe.smallImageUrls[0].replace("=s90", "")}`}).addClass('gallery-image');
			const emptyDiv = $("<div>").addClass("emptyDiv")
			const recipeButtonContainer = $("<div>").attr("id", recipe.id).addClass("buttonContainer container");
			const recipeButton = $("<button>").text("Get Recipe").addClass("getRecipeButton button").data("recipe", recipe.id)
			const recipeIngredientsBox = $("<div>").addClass("ingredientsBox");
			// const ingredientsDialogue = $("p").text(content [,"Hello World"]);
			const recipeIngredients = $("<p>").text(recipe.ingredients).addClass("ingredients");

			recipeContainer.append(recipeName, recipeImage, emptyDiv);
			recipeButtonContainer.append(recipeButton, recipeIngredientsBox); 
			// recipeIngredientsBox.append(recipeIngredients);
			recipeWrapper.append(recipeContainer, recipeButtonContainer);

			$("#app").append(recipeWrapper);

		});
	}


recipeApp.events = function() {
	//setup a click listener for when the image is clicked 

	$("#app").on("click",".getRecipeButton",function() {
		// console.log("clicked");

		var clickedItem = $(this).data(); 

		recipeApp.getRecipeById(clickedItem.recipe);
	});
};

recipeApp.getRecipeById = function(recipeId) {
	// console.log(recipeId);
	$.ajax({
		url: `http://api.yummly.com/v1/api/recipe/${recipeId}`,   //http://api.yummly.com/v1/api/recipe/recipe-id
			method: "GET",
			dataType: "json",
			data:{
				_app_id: recipeApp.appId,
				_app_key: recipeApp.appKey
			}
		}).then(function(data){
			console.log(data)

			recipeApp.showRecipeDetails(data);
		})

};

	recipeApp.showRecipeDetails = function(data) {
		const linkContainer = $("<div>").addClass("linkContainer");
		const recipeSource = $(`<a class="linkButton" target="_blank">`).attr('href', data.source.sourceRecipeUrl).text("Recipe Link").addClass("recipeLink");
		const recipeIngredientDetails = $("<p>").text(data.ingredientLines);

		linkContainer.append(recipeSource, recipeIngredientDetails);

		$("#" + data.id).append(linkContainer);
	}


$(function() {
	recipeApp.init();
});

