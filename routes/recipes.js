var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a recipe by its id
 */
router.get("/details/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
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
