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

async function addWatchedRecipe(userName, recipeId){
    let watchedRecipes = await DButils.execQuery(`select * from WatchedLogs where userName='${userName}' and recipeId='${recipeId}'`);
    if(watchedRecipes.length == 0){
        await DButils.execQuery(`insert into WatchedLogs values ('${userName}','${recipeId}')`);
    }   
}

async function getAllWatchedRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from WatchedLogs where userName='${userName}'`);
    return recipes_id;
}

async function getAllUsers(){
    const allUsers = await DButils.execQuery('select * from users');
    return allUsers;
}

// async function get3LastWatched(){
//     const allWatchedRecipes = getAllWatchedRecipes();

// }



exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.saveFamilyRecipe = saveFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.saveMyRecipe = saveMyRecipe;
exports.getMyRecipes = getMyRecipes;
exports.addWatchedRecipe = addWatchedRecipe;
exports.getAllWatchedRecipes = getAllWatchedRecipes;
exports.getAllUsers = getAllUsers;
