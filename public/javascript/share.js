function buildURI(item) {
    if (item.href == 'mailto:?') {
        subject = 'subject=' + document.getElementById('header').innerText;
        body = "&body=Check out at this url : " + window.location.href;
        item.setAttribute('href', item.href + subject + body);
    } else {
        item.setAttribute('href', item.href + window.location.href);
    }
    item.onclick = null;
}

function goBack() {
    window.history.back();
}