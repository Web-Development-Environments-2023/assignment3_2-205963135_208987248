const DButils = require("./DButils");

async function markAsFavorite(userName, recipeId){
    let favorites = await DButils.execQuery(`select * from danamaordb.MyFavoriteRecipes where userName='${userName}' and recipeId='${recipeId}'`);
    if(favorites.length == 0){
        await DButils.execQuery(`insert into danamaordb.MyFavoriteRecipes (userName, recipeId) values ('${userName}','${recipeId}')`);
    }
}

async function getFavoriteRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from danamaordb.MyFavoriteRecipes where userName='${userName}'`);
    return recipes_id;
}

async function saveFamilyRecipe(userName, recipeId){
    let family = await DButils.execQuery(`select * from danamaordb.MyFamilyRecipes where userName='${userName}' and recipeId='${recipeId}'`);
    if(family.length == 0){
        await DButils.execQuery(`insert into danamaordb.MyFamilyRecipes (userName, recipeId) values ('${userName}','${recipeId}')`);

    }
}

async function getFamilyRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from danamaordb.MyFamilyRecipes where userName='${userName}'`);
    return recipes_id;
}
async function saveMyRecipe(userName, recipeId){
    let myRecipes = await DButils.execQuery(`select * from danamaordb.myrecipes where userName='${userName}' and recipeId='${recipeId}'`);
    if(myRecipes.length == 0){
        await DButils.execQuery(`insert into danamaordb.myrecipes (userName, recipeId) values ('${userName}','${recipeId}')`);
    }
}

async function getMyRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from danamaordb.myrecipes where userName='${userName}'`);
    return recipes_id;
}

async function addWatchedRecipe(userName, recipeId){
    let watchedRecipes = await DButils.execQuery(`select * from danamaordb.Watchedlogs where userName='${userName}' and recipeId='${recipeId}'`);
    if(watchedRecipes.length == 0){
        let sql = `insert into danamaordb.Watchedlogs (userName, recipeId, watchedDateTime) values ('${userName}','${recipeId}', NOW())`;
        await DButils.execQuery(sql);
    }
    else{
        await DButils.execQuery(`UPDATE danamaordb.Watchedlogs SET watchedDateTime = NOW() WHERE recipeId='${recipeId}' and userName='${userName}';`);
    }
}

async function get3WatchedRecipes(userName){
    const recipes_id = await DButils.execQuery(`select recipeId from danamaordb.Watchedlogs where userName='${userName}' order by watchedDateTime desc limit 3`);
    return recipes_id;
}

async function getAllUsers(){
    const allUsers = await DButils.execQuery('select * from danamaordb.users');
    return allUsers;
}

async function getNumOfFamilyRecipeRows(userName){
    const rowsCounter = await DButils.execQuery(`select count(*) as numberOfRows from danamaordb.MyFamilyRecipes where userName='${userName}'`);
    return rowsCounter[0].numberOfRows;
}

async function getNumOfMyRecipeRows(userName){
    const rowsCounter = await DButils.execQuery(`select count(*) as numberOfRows from danamaordb.myrecipes where userName='${userName}'`);
    return rowsCounter[0].numberOfRows;
}

async function checkIfRecipeInUserFamily(userName, recipeId){
    const recipes = await DButils.execQuery(`select * from danamaordb.MyFamilyRecipes where userName='${userName}' and recipeId='${recipeId}'`);
    return recipes;
}

async function checkIfRecipeInUserMy(userName, recipeId){
    const recipes = await DButils.execQuery(`select * from danamaordb.MyRecipes where userName='${userName}' and recipeId='${recipeId}'`);
    return recipes;
}

exports.getNumOfMyRecipeRows = getNumOfMyRecipeRows;
exports.getNumOfFamilyRecipeRows = getNumOfFamilyRecipeRows;
exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.saveFamilyRecipe = saveFamilyRecipe;
exports.getFamilyRecipes = getFamilyRecipes;
exports.saveMyRecipe = saveMyRecipe;
exports.getMyRecipes = getMyRecipes;
exports.addWatchedRecipe = addWatchedRecipe;
exports.getAllUsers = getAllUsers;
exports.get3WatchedRecipes = get3WatchedRecipes
exports.checkIfRecipeInUserFamily = checkIfRecipeInUserFamily
exports.checkIfRecipeInUserMy = checkIfRecipeInUserMy