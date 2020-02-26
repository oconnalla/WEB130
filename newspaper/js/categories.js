/*global $ */
let category = {
    Sports: 'Sports',
    Local: 'Local',
    National: 'National',
    Opinion: 'Opinion',
    Lifestyle: 'Lifestyle'
};

const renderMenuItems = () => {
    let html = '';
    for( let Category in category){
        html += `<a class="dropdown-item" href="?filter=${Category}">
            ${Category}
        </a>`;
    }
    $('#categoryDrop').html(html);
};

export{ category, renderMenuItems };
