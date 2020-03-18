/*global $ */
import moment from 'moment';

const articleQL = (id) => {
    return `
    query{
      article(
        where:{
          id: "${id}"
        })
      {
        id
        title
        published
        author{
          name
        }
        category
        content{
          html
        }
      }
    }`;
};

const renderArticle = (data) => {
    const dateView = new moment(data.published).format('MM/DD/YYYY hh:mm A');
    return `
    <article class = "col-md-12">
        <h2>${data.title}</h2>
        <small>Published on: ${dateView}</small>
        <div>
            <p>${data.content.html}</p>
        </div>
    </article>
    `;
};

const loadArticle = (id) => {
    $.post({
        url: 'https://api-uswest.graphcms.com/v1/ck71ll9vz3mye01cy9khd4ks6/master',
        data: JSON.stringify({ query: articleQL (id) }),
        success: (response) => {
            const article = response.data.article;
            const html = renderArticle(article);
            $('main').html(html);
        },
        contentType: 'application/json'
    });
};

export { loadArticle };
