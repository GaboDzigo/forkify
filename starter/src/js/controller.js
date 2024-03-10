import * as model from './model.js';
import RecipeView from './views/recipeView.js';
import SearchView from './views/searchView.js';
import ResultsView from './views/resultViews.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import recipeView from './views/recipeView.js';

// if(module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    RecipeView.renderSpinner();
    // 1) loading recipe
    await model.loadRecipe(id);

    // 2) rendering the recipe
    RecipeView.render(model.state.recipe);
  } catch (err) {
    RecipeView.renderError();
  }
};

const controlSearchResults = async function() {
  try {
    ResultsView.renderSpinner();

    // 1) Get search query
    const query = SearchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // ResultsView.render(model.state.search.results);
    ResultsView.render(model.getSearchResultsPage());

    // 4) Render intial pagination buttons
    paginationView.render(model.state.search)
  } catch(err) {
    console.log(err);
  }
};

const controlPagination = function(goToPage) {
    // 1) Render NEW results
    ResultsView.render(model.getSearchResultsPage(goToPage));

    // 4) Render NEW pagination buttons
    paginationView.render(model.state.search)
};

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  RecipeView.render(model.state.recipe);
}

const init = function () {
  RecipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

};
init();


