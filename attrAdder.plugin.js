/**
 * @name attrAdder
 * @author unknown81311#6969
 * @description Adds attributes to elements, can be used for more features in themes.
 * @version 2
 * @invite https://discord.gg/yYJA3qQE5F
 * @authorId 359174224809689089
 * @source https://github.com/unknown81311/attrAdder
 * @updateUrl https://raw.githubusercontent.com/unknown81311/attrAdder/main/attrAdder.plugin.js
 */


module.exports = class attrAdder {
    load() {
        this.threadDATA = BdApi.findModuleByProps('getThreadSidebarState');
        this.channelDATA = BdApi.findModuleByProps('getChannelId');
        this.getDMFromUserId = BdApi.findModuleByProps("getDMFromUserId", "getChannel");
        this.getLastSelectedChannelId = BdApi.findModuleByProps("getLastSelectedChannelId", "getChannelId");
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
            document.querySelector('.threadSidebar-1o3BTy').setAttribute('id',this.threadDATA.getThreadSidebarState(this.channelDATA.getChannelId())?.channelId);
        }
        if(!document.querySelector('main.chatContent-a9vAAp[guild]')){
            if(location.href.indexOf('@me') > 0){
                let userId = this.getDMFromUserId.getChannel(this.getLastSelectedChannelId.getChannelId()).recipients[0];
                document.querySelector('main').setAttribute('guild', userId)
            }else{
                try{let ids = window.location.pathname.match(/\d+/g).reduce((obj, el, index) => { obj[index === 0 ? 'guild' : 'channel'] = el; return obj; }, {})
                for (let key in ids){document.querySelector('main').setAttribute(key, ids[key])}}catch{}
            }
        }
    }
    
}
