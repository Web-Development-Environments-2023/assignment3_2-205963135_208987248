var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const { user } = require("pg/lib/defaults");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.userName) {
    DButils.execQuery("SELECT userName FROM users").then((users) => {
      if (users.find((x) => x.userName === req.session.userName)) {
        req.userName = req.session.userName;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(userName,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(userName);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipeId)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe_id,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings
 * ,ingredients and save this recipe in the recipe table and also in the family list of the logged-in user
 */
 router.post('/family', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    let rowNum = await user_utils.getNumOfFamilyRecipeRows(userName);
    const recipe_id = userName + '_' + "family"+ '_' + rowNum;
    const glutenFree =  req.body.glutenFree;
    const instructions =  req.body.instructions;
    const picture =  req.body.image;
    const popularity =  req.body.popularity;
    const preparationTime =  req.body.readyInMinutes;
    const recipeName =  req.body.title;
    const vegan =  req.body.vegan;
    const vegetarian =  req.body.vegetarian;
    const servings =  req.body.servings;
    const ingredients =  req.body.ingredients;
    let recipes = await recipe_utils.checkIfFamilyRecipeExists(glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients,userName);
    if(recipes.length == 0){
      await recipe_utils.addRecipe(recipe_id,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients);
      await user_utils.saveFamilyRecipe(userName,recipe_id);
      res.status(200).send("The Recipe successfully saved as family recipe");
    }
    else{
        res.status(400).send("This Recipe was already added to user family recipes");
    }
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the family recipes that were saved by the logged-in user
 */
router.get('/family', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    const recipes_id = await user_utils.getFamilyRecipes(userName);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipeId)); //extracting the recipe ids into array
    const results = await recipe_utils.getLocalRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path gets body with recipe_id,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings
 * ,ingredients and save this recipe in the recipe table and also in the my list of the logged-in user
 */
 router.post('/my', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    let rowNum = await user_utils.getNumOfMyRecipeRows(userName);
    const recipe_id = userName+ '_' + "my"+ '_' + rowNum;
    const glutenFree =  req.body.glutenFree;
    const instructions =  req.body.instructions;
    const picture =  req.body.image;
    const popularity =  req.body.popularity;
    const preparationTime =  req.body.readyInMinutes;
    const recipeName =  req.body.title;
    const vegan =  req.body.vegan;
    const vegetarian =  req.body.vegetarian;
    const servings =  req.body.servings;
    const ingredients =  req.body.ingredients;
    let recipes = await recipe_utils.checkIfMyRecipeExists(glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients, userName);
    if(recipes.length == 0){
      await recipe_utils.addRecipe(recipe_id,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients);
      await user_utils.saveMyRecipe(userName,recipe_id);
      res.status(200).send("The Recipe successfully saved as my recipe");
    }
    else{
      res.status(400).send("This Recipe was already added to user my recipes");
    }
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the my recipes that were saved by the logged-in user
 */
router.get('/my', async (req,res,next) => {
  try{
    const userName = req. session.userName;
    const recipes_id = await user_utils.getMyRecipes(userName);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipeId)); //extracting the recipe ids into array
    const results = await recipe_utils.getLocalRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.get('/watch', async (req,res,next) => {
  try{
    const userName = req.session.userName;
    const recipes_id = await user_utils.get3WatchedRecipes(userName);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipeId)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

module.exports = router;
