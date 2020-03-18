import { loadArticlesList, loadFilteredArticlesList } from './listView';
import { loadArticle } from './detailView';
import { renderMenuItems } from './categories';
import { login, createArticle } from './api';

let params = new URLSearchParams(window.location.search);
renderMenuItems();

if(typeof js_page !== 'undefined' && js_page === 'articles'){
    if (params.get('article') !== null) {
        const id = params.get('article');
        loadArticle(id);
    }else if(params.get('filter') !== null){
        loadFilteredArticlesList(params.get('filter'));
    }else {
        loadArticlesList();
    }
}
if(typeof js_page !== 'undefined' && js_page === 'login'){
    login();
}
if(typeof js_page !== 'undefined' && js_page === 'createArticle'){
    createArticle();
}