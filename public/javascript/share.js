function buildURI(item) {
    console.log(item)
    if (item.href == 'mailto:?') {
        subject = 'subject=' + document.querySelector('post-title').innerText;
        body = "&body=Check out at this url : " + window.location.href;
        item.setAttribute('href', item.href + subject + body);
    } else {
        item.setAttribute('href', item.href + window.location.href);
    }
    item.onclick = null;
}