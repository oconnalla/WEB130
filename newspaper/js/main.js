import { loadArticles } from './listView';
import { loadArticle } from './detailView';
import { renderMenuItems } from './categories';

let params = new URLSearchParams(window.location.search);
renderMenuItems();
if (params.get('article') !== null) {
    const id = params.get('article');
    loadArticle(id);
} else {
    loadArticles();
}

