/**
 * @name attrAdder
 * @author unknown81311#6969
 * @description Adds attributes to elements, can be used for more features in themes.
 * @version 1.0.0
 * @invite yYJA3qQE5F
 * @authorId 359174224809689089
 * @source https://github.com/unknown81311/attrAdder
 * @updateUrl https://raw.githubusercontent.com/unknown81311/attrAdder/main/attrAdder.plugin.js
 */
/*@cc_on
@if (@_jscript)
   
   // Offer to self-install for clueless users that try to run this directly.
   var shell = WScript.CreateObject("WScript.Shell")
   var fs = new ActiveXObject("Scripting.FileSystemObject")
   var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins")
   var pathSelf = WScript.ScriptFullName
   // Put the user at ease by addressing them in the first person
   shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30)
   if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
       shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40)
   } else if (!fs.FolderExists(pathPlugins)) {
       shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10)
   } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
       fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true)
       // Show the user where to put plugins in the future
       shell.Exec("explorer " + pathPlugins)
       shell.Popup("I'm installed!", 0, "Successfully installed", 0x40)
   }
   WScript.Quit()
@else@*/
module.exports = (() => {
        const config = {
            info: {
                name: "attrAdder",
                authors: [{
                    name: "unknown81311",
                    discord_id: "359174224809689089"
                }],
                version: "1.0.0",
                description: "Adds attributes to elements, can be used for more features in themes.",
            },
            defaultConfig: [{
                type: "switch",
                id: "watch",
                name: "All plugins",
                note: "Adds a plugin attribute to the body of all the plugin names.",
                value: true
            },{
                type: "switch",
                id: "threads",
                name: "threads",
                note: "Adds thread id to the thread element.",
                value: true
            },{
                type: "switch",
                id: "main",
                name: "main and channel",
                note: "Adds channel and guild id to the main element.",
                value: true
            },{
                type: "switch",
                id: "popup",
                name: "user popup",
                note: "Add user id to user popups.",
                value: true
            },{
                type: "switch",
                id: "module",
                name: "user module",
                note: "Add user id to user modules.",
                value: true
            },{
                type: "switch",
                id: "peopleList",
                name: "peopleList",
                note: "Add user id to the peopleList.",
                value: true
            },{
                type: "switch",
                id: "auditLog",
                name: "auditLog",
                note: "Add user id to the auditLog.",
                value: true
            }]
        }
        return !global.ZeresPluginLibrary ? class {
            constructor() {
                this._config = config
            }
            load() {
                BdApi.showConfirmationModal("Library plugin is needed", [`The library plugin neede∂d for ${config.info.name} is missing. Please click Download Now to install it.`], {
                    confirmText: "Download",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async(error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9")
                            await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r))
                        })
                    }
                })
            }
            start() {}
            stop() {}

        } : (([Plugin, Api]) => {
            const plugin = (Plugin, Api) => {
                return class PluginName extends Plugin {
                    getSettingsPanel() {
                        const panel = this.buildSettingsPanel();
                        panel.addListener(() => {
                            this.testWatcher();
                        });
                        return panel.getElement();
                    }
                    testWatcher() {
                        if(this.settings.watch){
                            const path = require("path");
                            const bdpp = path.resolve(path.dirname(BdApi.Plugins.folder), "data", DiscordNative.app.getReleaseChannel(), "plugins.json");
                            this.watcher = require('fs').watch(bdpp, (eventType, filename) => {
                                document.body.setAttribute('plugins', BdApi.Plugins.getAll().map(p => p.id).filter(BdApi.Plugins.isEnabled));
                            });
                        }else if(!this.settings.watch && this.settings.watch){
                            this.watcher.close();
                            document.body.removeAttribute('plugins');
                        }
                    }
                    load() {
                        this.threadDATA = BdApi.findModuleByProps('getThreadSidebarState');
                        this.channelDATA = BdApi.findModuleByProps('getChannelId');
                        this.getDMFromUserId = BdApi.findModuleByProps("getDMFromUserId", "getChannel");
                        this.getLastSelectedChannelId = BdApi.findModuleByProps("getLastSelectedChannelId", "getChannelId");
                    }
                    start() {
                        if(this.settings.watch){
                            const path = require("path");
                            const bdpp = path.resolve(path.dirname(BdApi.Plugins.folder), "data", DiscordNative.app.getReleaseChannel(), "plugins.json");
                            this.watcher = require('fs').watch(bdpp, (eventType, filename) => {
                                document.body.setAttribute('plugins', BdApi.Plugins.getAll().map(p => p.id).filter(BdApi.Plugins.isEnabled));
                            });
                        }
                    }
                    stop() {
                        if(this.settings.watch){
                            this.watcher.close();
                            document.body.removeAttribute('plugins');
                        }
                    }
                    onSwitch() {
                        if (this.settings.threads && document.querySelector('.threadSidebar-1o3BTy') && !document.querySelector('.threadSidebar-1o3BTy[id]')) {
                            document.querySelector('.threadSidebar-1o3BTy').setAttribute('id', this.threadDATA.getThreadSidebarState(this.channelDATA.getChannelId()).channelId);
                        }
                        if (this.settings.main && !document.querySelector('main.chatContent-a9vAAp[guild]')) {
                            if (location.href.indexOf('@me/') > 0) {
                                let userId = this.getDMFromUserId.getChannel(this.getLastSelectedChannelId.getChannelId()).recipients[0];
                                document.querySelector('main').setAttribute('guild', userId)
                            } else {
                                try {
                                    let ids = window.location.pathname.match(/\d+/g).reduce((obj, el, index) => {
                                        obj[index === 0 ? 'guild' : 'channel'] = el;
                                        return obj;
                                    }, {})
                                    for (let key in ids) {
                                        document.querySelector('main').setAttribute(key, ids[key])
                                    }
                                } catch {}
                            }
                        }
                    }

                    observer(mutations) {
                        if (this.settings.popup && document.querySelector('div.userPopout-xaxa6l')) {
                            let popup = document.querySelector('div.userPopout-xaxa6l'),
                                id = BdApi.getInternalInstance(popup).return.return.return.return.return.return.pendingProps.userId;
                            popup.setAttribute('id', id);
                        }
                        if (this.settings.module && document.querySelector('div.root-3QyAh1')) {
                            let root3QyAh1 = document.querySelector('div.topSection-y3p-_D header'),
                                id = BdApi.getInternalInstance(root3QyAh1).return.pendingProps.user.id;
                            document.querySelector('div.root-3QyAh1').setAttribute('id', id);
                        }
                        if (this.settings.peopleList && document.querySelector('div.peopleList-3c4jOR div.content-3YMskv')) {
                            let elms = document.querySelectorAll('div.peopleList-3c4jOR div.content-3YMskv div.peopleListItem-2nzedh')
                            for (const elm of elms) {
                                elm.setAttribute('id',
                                    BdApi.getInternalInstance(elm).return.return.return.pendingProps.id
                                )
                            }
                        }
                        if (this.settings.auditLog && document.querySelector('div.content-FNlD6K div.auditLog-3jNbM6')) {
                            let elms = document.querySelectorAll('div.content-FNlD6K div.auditLog-3jNbM6')
                            for (const elm of elms) {
                                elm.setAttribute('id',
                                    BdApi.getInternalInstance(elm).return.return.pendingProps.id
                                )
                            }
                        }
                    }
                }
            }
            return plugin(Plugin, Api)
        })(global.ZeresPluginLibrary.buildPlugin(config))
    })()
    /*@end@*/
