var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils")

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.post("/details", async (req, res, next) => {
  try {
    let recipe_id = (req.body.recipeId).trim()
    let user_name = (req.body.userName).trim()
    // console.log(user_name);
    const recipe = await recipes_utils.getRecipeDetails(recipe_id);
    res.send(recipe);
    let analyzedInstructions =  await recipes_utils.getAnalyzedInstructions(recipe_id);
    analyzedInstructions = analyzedInstructions.data[0]
    //todo add recipe to db and then to watched
    await recipes_utils.addRecipe(recipe.id, recipe.glutenFree, recipe.instructions, recipe.image, recipe.popularity, recipe.readyInMinutes,
      recipe.title, recipe.vegan, recipe.vegetarian, recipe.servings, recipe.ingredients, analyzedInstructions)
    await user_utils.addWatchedRecipe(user_name, recipe_id);
  } catch (error) {
    next(error);
  }
});

router.post("/previewDetails", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRecipesPreview(req.body.recipeIdList);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getRandom3Recipes();
    res.send(recipes);
  } catch (error) {
    next(error);
  }
})

router.post("/search", async (req, res, next) => {
  try {
    let querySearch = (req.body.querySearch);
    let numberSearch = (req.body.numberSearch);
    let cuisineSearch = (req.body.cuisineSearch);
    let dietSearch = (req.body.dietSearch);
    let intoleranceSearch = (req.body.intoleranceSearch);
    const recipes = await recipes_utils.searchRecipes(querySearch, numberSearch, cuisineSearch, dietSearch, intoleranceSearch);
    res.send(recipes);
  } catch (error) {
    next(error);
  }
})

/**
 * This path returns the analyzedInstructions of a recipe by its id
 */
 router.post("/analyzedInstructions", async (req, res, next) => {
  try {
    let recipe_id = (req.body.recipeId).trim()
    let analyzedInstructions =  await recipes_utils.getAnalyzedInstructionsFromDB(recipe_id);
    res.send(analyzedInstructions);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the analyzedInstructions of a recipe by its id
 */
 router.post("/changemealorder", async (req, res, next) => {
  try {
    let data = req.body.recipesAndOrderList;
    let userName =  req.body.userName;
    let recipes_and_order_list = data.map(function(e){return [e["recipeId"], e["orderRecipe"]]});
    await recipes_utils.changeMealRecipes(userName, recipes_and_order_list);
    res.send("Meal order was updated successfully");
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the analyzedInstructions of a recipe by its id
 */
 router.post("/addmeal", async (req, res, next) => {
  try {
    let recipeId = req.body.recipeId;
    let userName =  req.body.userName;
    let cond = await recipes_utils.addMealRecipes(userName, recipeId);
    if(cond){
      res.send("Recipe was added to meal successfully");
    }
    else{
      res.send("This recipe is already in the meal");
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the analyzedInstructions of a recipe by its id
 */
 router.post("/deletemeal", async (req, res, next) => {
  try {
    let recipeId = req.body.recipeId;
    let userName =  req.body.userName;
    let data = req.body.recipesAndOrderList;
    let newRecipeAndOrderList = data.map(function(e){return [e["recipeId"], e["orderRecipe"]]});
    await recipes_utils.deleteMealRecipes(userName, recipeId);
    await recipes_utils.changeMealRecipes(userName, newRecipeAndOrderList);
    res.send("Recipe was deleted from meal successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
