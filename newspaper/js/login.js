/*global $ */
import md5 from 'md5';

const genereateCreateArticleQL = (data) => `
    mutation {
        createArticle(
            data: {
                status: PUBLISHED
                title: "${data.title}"
                category: ${data.category}
                content: "${data.content}"
                published: "${data.published}"
            }
        ) {
            id
            title
        }
    }
`;

const setToken = (user, pass) => {
    sessionStorage.setItem('token', btoa(`${user}:${md5(pass)}`));
};

const login = () => {
    $.ajaxSetup({
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Basic ${sessionStorage.getItem('token')}`);
        }
    });
    $('form button').on('click', (event) => {
        event.preventDefault();
        const user = $('form input[name="username"]').val();
        const pass = $('form input[name="password"]').val();
        setToken(user, pass);
        $.post('/api/login', (res) => {
            if (res.status === 'SUCCESS') {
                window.location.href = '/form.html';
            } else {
                alert('Invaid credentials.');
            }
        }, 'json');
    });
};

const createArticle = () => {
    $.ajaxSetup({
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Basic ${sessionStorage.getItem('token')}`);
        }
    });
    $('form button').on('click', (event) => {
        event.preventDefault();
        let data = {};
        data.title = $('form input[name="title"]').val();
        data.category = $('form select[name="category"]').val();
        data.content = $('form textarea[name="content"]').val();
        data.published = new Date().toISOString();
        const createArticleQl = genereateCreateArticleQL(data);
        $.post('/api/form', JSON.stringify({'query': createArticleQl}), (res) => {
            if (res.status === 'SUCCESS') {
                alert('Article created!');
                $('form')[0].reset();
            } else {
                alert('Something went wrong: ' + res.reason);
            }
        }, 'json');
    });
};

export { login, createArticle };
