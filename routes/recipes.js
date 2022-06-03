var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
const user_utils = require("./utils/user_utils")

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/details/:recipeId/:userName", async (req, res, next) => {
  try {
    let recipe_id = (req.params.recipeId).trim()
    let user_name = (req.params.userName).trim()
    // console.log(user_name);
    const recipe = await recipes_utils.getRecipeDetails(recipe_id);
    res.send(recipe);
    // user_utils.addWatchedRecipe(user_name, recipe_id);
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

module.exports = router;
