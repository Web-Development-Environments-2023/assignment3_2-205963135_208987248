const DButils = require("./DButils");

async function markAsFavorite(userName, recipeId){
    await DButils.execQuery(`insert into MyFavoriteRecipes values ('${userName}','${recipeId}')`);
}

async function getFavoriteRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from MyFavoriteRecipes where userName='${userName}'`);
    return recipes_id;
}

async function saveFamilyRecipe(userName, recipeId){
    await DButils.execQuery(`insert into MyFamilyRecipes values ('${userName}','${recipeId}')`);
}

async function getFamilyRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from MyFamilyRecipes where userName='${userName}'`);
    return recipes_id;
}
async function saveMyRecipe(userName, recipeId){
    await DButils.execQuery(`insert into MyRecipes values ('${userName}','${recipeId}')`);
}

async function getMyRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from MyRecipes where userName='${userName}'`);
    return recipes_id;
}

async function addRecipe(recipeId,createDate,glutenFree,insturctions,picture,popularity,preparationTime,recipeName,vegan,vegeterain)
{
    await DButils.execQuery(`insert into Recipes values ('${recipeId}',${createDate},${glutenFree},'${insturctions}'
    ,'${picture}',${popularity},${preparationTime},'${recipeName}',${vegan},${vegeterain})`);
}

async function addWatchedRecipe(userName, recipeId)
{
    await DButils.execQuery(`insert into WatchedLogs values ('${userName}','${recipeId}')`);
}

async function getAllWatchedRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from WatchedLogs where userName='${userName}'`);
    return recipes_id;
}





exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.saveFamilyRecipe = saveFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.saveMyRecipe = saveMyRecipe;
exports.getMyRecipes = getMyRecipes;
exports.addRecipe = addRecipe;
exports.addWatchedRecipe = addWatchedRecipe;
exports.getAllWatchedRecipes = getAllWatchedRecipes;
