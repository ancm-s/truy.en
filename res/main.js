'use strict';
const parser = new DOMParser();

const _fetch = () => {
    const url = ['http:', 'truyentranhtuan.com', 'one-piece'].join('//');
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const chapters = xhr.responseText
                    .match(/<span class="chapter-name">\n<a href="(.*?)">(.+?)<\/a>/g)
                    .slice(0, 5)
                    .map(chapter => ({
                        name: /\>(.*?)<\//.exec(chapter)[1],
                        url: /href="(.+?)"/.exec(chapter)[1]
                    }));
                resolve(chapters);
            }
        };
        xhr.send();
    });
};
const _check = (chapter) => {
    chrome.history.search({
        text: chapter.url
    }, (result) => {
        if (result[0]) return;
        chrome.notifications.create(chapter.url, {
            type: "basic",
            title: "One Piece",
            iconUrl: "./img/icon.png",
            message: "Truyện đã có chương mới, vào đọc ngay đi cưng"
        });
    });
};

chrome.notifications.onClicked.addListener(function(url) {
    chrome.tabs.create({ url });
});

const $interval = setInterval(function(config) {
    console.log('#check', Date());
    _fetch().then((chapter) =>
        chapter.map((chapter) => _check(chapter))
    );
}, 18e8, {});
