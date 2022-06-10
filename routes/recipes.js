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
    //todo add recipe to db and then to watched
    await recipes_utils.addRecipe(recipe.id, recipe.glutenFree, recipe.instructions, recipe.image, recipe.popularity, recipe.readyInMinutes,
      recipe.title, recipe.vegan, recipe.vegetarian, recipe.servings, recipe.ingredients)
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

module.exports = router;
