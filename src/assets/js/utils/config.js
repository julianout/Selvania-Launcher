/**
 * @author Luuxis
 * Luuxis License v1.0 (voir fichier LICENSE pour les détails en FR/EN)
 */

const pkg = require('../package.json');
const nodeFetch = require("node-fetch");
const convert = require('xml-js');
let url = pkg.user ? `${pkg.url}/${pkg.user}` : pkg.url

let config = `${url}/launcher/config-launcher/config.json`;
let news = `${url}/launcher/news-launcher/news.json`;

class Config {
    GetConfig() {
        return new Promise((resolve, reject) => {
            nodeFetch(config).then(async config => {
                if (config.status === 200) return resolve(config.json());
                else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
            }).catch(error => {
                return reject({ error });
            })
        })
    }

    async getInstanceList() {
        let InstanceList = `${this.config.url}/files/`
        return new Promise((resolve, reject) => {
            nodeFetch(InstanceList).then(async config => {
                if (config.status === 200) {
                    let instances = await config.json();
                    // Modifier l'instance hypixel pour Pif Paf Pouf
                    if (instances.hypixel) {
                        instances.hypixel.name = "Pif Paf Pouf";
                        instances.hypixel.url = "http://cdn.inoxia.me/files?instance=hypixel";
                        instances.hypixel.loadder.minecraft_version = "1.21.8";
                        instances.hypixel.loadder.loadder_type = "neoforge";
                        instances.hypixel.loadder.loadder_version = "21.8.39";
                        instances.hypixel.status.nameserver = "Pif Paf Pouf Server";
                        instances.hypixel.status.ip = "mc301.boxtoplay.com";
                        instances.hypixel.status.port = 26327;
                    }
                    return resolve(instances);
                }
                else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
            }).catch(error => {
                return reject({ error });
            })
        })
    }

    async getNews() {
        let config = await this.GetConfig() || {}

        if (config.rss) {
            return new Promise((resolve, reject) => {
                nodeFetch(config.rss).then(async config => {
                    if (config.status === 200) {
                        let news = [];
                        let response = await config.text()
                        response = (JSON.parse(convert.xml2json(response, { compact: true })))?.rss?.channel?.item;

                        if (!Array.isArray(response)) response = [response];
                        for (let item of response) {
                            news.push({
                                title: item.title._text,
                                content: item['content:encoded']._text,
                                author: item['dc:creator']._text,
                                publish_date: item.pubDate._text
                            })
                        }
                        return resolve(news);
                    }
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => reject({ error }))
            })
        } else {
            return new Promise((resolve, reject) => {
                nodeFetch(news).then(async config => {
                    if (config.status === 200) return resolve(config.json());
                    else return reject({ error: { code: config.statusText, message: 'server not accessible' } });
                }).catch(error => {
                    return reject({ error });
                })
            })
        }
    }
}

export default new Config;