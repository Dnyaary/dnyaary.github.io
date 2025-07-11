

let surrealBrowser, embeddedIframe, browserUrlInput, browserRefreshBtn;

const Portal = {
    init: function(browserId, iframeId, urlInputClass, refreshBtnClass) {
        surrealBrowser = document.getElementById(browserId);
        embeddedIframe = document.getElementById(iframeId);
        browserUrlInput = document.querySelector(`.${urlInputClass}`);
        browserRefreshBtn = document.querySelector(`.${refreshBtnClass}`);
    },

    openPortal: function(currentLang) {

        const targetUrl = 'https://www.wikipedia.org/'; 
        embeddedIframe.src = targetUrl;
        
        browserUrlInput.value = currentLang === 'pt' ? 'wikipedia.corrompida' : 'wikipedia.corrupted';
        
        browserRefreshBtn.onclick = () => {
            embeddedIframe.src = targetUrl;

        };
    },

    hidePortal: function() {
        embeddedIframe.src = 'about:blank';
    }
};
