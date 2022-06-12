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
        ingredients: extendedIngredients,
    }
}

async function addRecipe(recipeId,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients,analyzedInstructions){
    let recipes = await DButils.execQuery(`select recipeId from danamaordb.Recipes where recipeId='${recipeId}'`);
    if(recipes.length == 0){
        let ingredientsToIsert
        if(ingredients != undefined){
            ingredientsToIsert = JSON.stringify(ingredients).replaceAll("'","");
        }
        else{
            ingredientsToIsert = "";
        }
        await DButils.execQuery(`insert into Recipes (recipeId,glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,ingredients,servings,analyzedInstructions) 
        values ('${recipeId}',${glutenFree},'${instructions}' ,'${picture}',${popularity},${preparationTime},'${recipeName}',${vegan},${vegetarian}, '${ingredientsToIsert}' ,${servings}, '${JSON.stringify(analyzedInstructions)}')`);
    }
}

function extractPreviewRecipeDetails(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data =  recipe_info;
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
  
  function extractPreviewRecipeDetailsLocal(recipes_info) {
    return recipes_info.map((recipe_info) => {
        //check the data type so it can work with diffrent types of data
        let data = recipe_info;
        if (recipe_info.length > 0) {
            data = recipe_info[0];
        }
        const {
            recipeId,
            recipeName,
            preparationTime,
            picture,
            popularity,
            vegan,
            vegetarian,
            glutenFree,
        } = data;
        return {
            id: recipeId,
            title: recipeName,
            image: picture,
            readyInMinutes: preparationTime,
            popularity: popularity,
            vegan: Boolean(vegan),
            vegetarian: Boolean(vegetarian),
            glutenFree: Boolean(glutenFree)
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

async function getLocalRecipesPreview(recipes_ids_list) {
    let promises = [];
    recipes_ids_list.map((id) => {
        promises.push(getRecipeInformationLocal(id));
    });
    let info_res = await Promise.all(promises);
    // info_res.map((recp)=>{console.log(recp.data)});
    // console.log(info_res);
    return extractPreviewRecipeDetailsLocal(info_res);
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

async function searchRecipes(querySearch,numberSearch,cuisineSearch,dietSearch,intoleranceSearch){
    const response = await axios.get(`${api_domain}/complexSearch`,{
        params: {
            query: querySearch,
            number: numberSearch,
            cuisine: cuisineSearch,
            diet: dietSearch,
            intolerance: intoleranceSearch,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response.data.results;
}

async function getRecipeInformationLocal(recipeId){
    const recipes = await DButils.execQuery(`select * from danamaordb.recipes where recipeId='${recipeId}'`);
    return recipes;
}

async function checkIfMyRecipeExists(glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients, userName){
    let sql = `select * from danamaordb.recipes where glutenFree=${glutenFree} and
    instructions='${instructions}' and picture='${picture}' and popularity=${popularity} and preparationTime=${preparationTime} 
    and recipeName='${recipeName}' and vegan=${vegan} and vegetarian=${vegetarian} and servings=${servings} 
    and ingredients='${JSON.stringify(ingredients).replaceAll("'","")}' and recipeId like '${userName}_my%'`;
    const recipes = await DButils.execQuery(sql);
    return recipes;
}

async function checkIfFamilyRecipeExists(glutenFree,instructions,picture,popularity,preparationTime,recipeName,vegan,vegetarian,servings,ingredients, userName){
    let sql = `select * from danamaordb.recipes where glutenFree=${glutenFree} and
    instructions='${instructions}' and picture='${picture}' and popularity=${popularity} and preparationTime=${preparationTime} 
    and recipeName='${recipeName}' and vegan=${vegan} and vegetarian=${vegetarian} and servings=${servings} 
    and ingredients='${JSON.stringify(ingredients).replaceAll("'","")}' and recipeId like '${userName}_family%'`;
    const recipes = await DButils.execQuery(sql);
    return recipes;
}

async function getNumOfMealRecipeRows(userName){
    const rowsCounter = await DButils.execQuery(`select count(*) as numberOfRows from danamaordb.Meal where userName='${userName}'`);
    return rowsCounter[0].numberOfRows;
}

async function addMealRecipes(userName, recipeId){
    let num_of_rows = await getNumOfMealRecipeRows(userName);
    let watchedRecipes = await DButils.execQuery(`select * from danamaordb.meals where userName='${userName}' and recipeId='${recipeId}'`);
    await DButils.execQuery(`insert into danamaordb.meals (userName, recipeId, orderRecipe) values ('${userName}','${recipeId}', ${num_of_rows})`);
}

async function getMealRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from danamaordb.Meal where userName='${userName}' order by orderRecipe asc `);
    return recipes_id;
}

async function changeMealRecipes(userName, recipes_list){
    for (i in Range(recipes_list.length))
    {

    }
}

async function getAnalyzedInstructions(recipeId){
    const response = await axios.get(`${api_domain}/${recipeId}/analyzedInstructions`,{
        params: {
            stepBreakdown: true,
            apiKey: process.env.spooncular_apiKey
        }
    });
    return response;
}

async function getAnalyzedInstructionsFromDB(recipeId){
    let sql = `select analyzedInstructions from danamaordb.recipes where recipeId = '${recipeId}'`;
    let analyzedInstructions = await DButils.execQuery(sql);
    analyzedInstructions = analyzedInstructions[0].analyzedInstructions;
    analyzedInstructions = JSON.parse(analyzedInstructions);
    return analyzedInstructions;
}

exports.getLocalRecipesPreview = getLocalRecipesPreview;
exports.getRecipeDetails = getRecipeDetails;
exports.addRecipe = addRecipe;
exports.getRecipesPreview = getRecipesPreview;
exports.getRandomRecipes = getRandomRecipes;
exports.getRandom3Recipes = getRandom3Recipes;
exports.searchRecipes = searchRecipes;
exports.checkIfMyRecipeExists = checkIfMyRecipeExists;
exports.checkIfFamilyRecipeExists = checkIfFamilyRecipeExists;
exports.getMealRecipes = getMealRecipes;
exports.changeMealRecipes =changeMealRecipes;
exports.addMealRecipes = addMealRecipes;
exports.getAnalyzedInstructions = getAnalyzedInstructions;
exports.getAnalyzedInstructionsFromDB = getAnalyzedInstructionsFromDB;



