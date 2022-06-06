const axios = require("axios");
const res = require("express/lib/response");
require('dotenv').config();
const api_domain = "https://api.spoonacular.com/recipes";
const DButils = require("./DButils");


/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, instructions, servings, extendedIngredients } = recipe_info.data;
    //todo add extendedIngredients, servings
    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        instructions: instructions,
        servings: servings,
        extendedIngredients: extendedIngredients,
    }
}

async function addRecipe(recipeId,glutenFree,insturctions,picture,popularity,preparationTime,recipeName,vegan,vegeterain,servings,extendedIngredients){
    let recipes = await DButils.execQuery(`select recipeId from Recipes where recipeId='${recipeId}'`);
    if(recipes.length == 0){
        let instructions = JSON.stringify(extendedIngredients).replaceAll("'","");
        await DButils.execQuery(`insert into Recipes (recipeId,glutenFree,insturctions,picture,popularity,preparationTime,recipeName,vegan,vegeterain,ingredients,servings) values ('${recipeId}',${glutenFree},'${insturctions}'
    ,'${picture}',${popularity},${preparationTime},'${recipeName}',${vegan},${vegeterain}, '${instructions}'
    ,${servings})`);
    }
}

function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.data) {
            data = recipe_info.data;
        }
        const {
            id,
            title,
            readyInMinutes,
            image,
            aggregateLikes,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: id,
            title: title,
            image: image,
            readyInMinutes: readyInMinutes,
            popularity: aggregateLikes,
            vegan: vegan,
            vegetarian: vegetarian,
            glutenFree: glutenFree
        }
    })
  }
  

async function getRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformation(id));
    });
    let info_res = await Promise.all(promises);
    // info_res.map((recp)=>{console.log(recp.data)});
    // console.log(info_res);
    return extractPreviewRecipeDetails(info_res);
  }

async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random`,{
        params: {
            number: 12,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

async function getRandom3Recipes(){
    let random_list = await getRandomRecipes();
    let filtered_random_list = random_list.data.recipes.filter((random) => (random != undefined) && (random.recipeId != "") && (random.image != "") && (random.instructions != ""))
    if (filtered_random_list.length < 3 ){
        return getRandom3Recipes();
    }
    return extractPreviewRecipeDetails([filtered_random_list[0],filtered_random_list[1], filtered_random_list[2]]);
}


exports.getRecipeDetails = getRecipeDetails;
exports.addRecipe = addRecipe;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
exports.getRandom3Recipes = getRandom3Recipes;




