/**
 * @name attrAdder
 * @author unknown81311#6969
 * @description Adds attributes to elements, can be used for more features in themes.
 * @version 1.2
 * @invite https://discord.gg/yYJA3qQE5F
 * @authorId 359174224809689089
 */
this.threadDATA = BdApi.findModuleByProps('getThreadSidebarState')

module.exports = class attrAdder {
    load() {
        if(!document.body.hasAttribute('plugins')){
            const path = require("path");
            const bdpp = path.resolve(path.dirname(BdApi.Plugins.folder), "data", DiscordNative.app.getReleaseChannel(), "plugins.json");
            this.watcher = require('fs').watch(bdpp, (eventType, filename) => {
                document.body.setAttribute('plugins',BdApi.Plugins.getAll().map(p => p.id).filter(BdApi.Plugins.isEnabled));
            });
        }
    }
    start() {
        if(!document.body.hasAttribute('plugins')){
            const path = require("path");
            const bdpp = path.resolve(path.dirname(BdApi.Plugins.folder), "data", DiscordNative.app.getReleaseChannel(), "plugins.json");
            this.watcher = require('fs').watch(bdpp, (eventType, filename) => {
                document.body.setAttribute('plugins',BdApi.Plugins.getAll().map(p => p.id).filter(BdApi.Plugins.isEnabled));
            });
        }
    } 
    stop() {
        this.watcher.close();
        if(document.body.hasAttribute('plugins')) document.body.removeAttribute('plugins');
    }
    observer (mutations) {
        if(document.querySelector('.threadSidebar-1o3BTy') && !document.querySelector('.threadSidebar-1o3BTy[id]')){
            document.querySelector('.threadSidebar-1o3BTy').setAttribute('id',this.threadDATA.getThreadSidebarState(BdApi.findModuleByProps('getChannelId').getChannelId())?.channelId);
        }
        if(!document.querySelector('main.chatContent-a9vAAp[guild]')){
            try{let ids = window.location.pathname.match(/\d+/g).reduce((obj, el, index) => { obj[index === 0 ? 'guild' : 'channel'] = el; return obj; }, {})
            for (let key in ids){document.querySelector('main').setAttribute(key, ids[key])}}catch{}
        }
    }
    
}
