// File://home/rose/BOT/SuryaRB/Message/Features/fetcher.js
import axios from "axios";

export default {
    command: ["get", "fetch"],
    description: "get something from the url",
    category: "Utility",
    owner: false,
    admin: false,
    hidden: false,
    limit: 0,
    group: false,
    private: false,

    execute: async function (m, { sock, args }) {
        const url = args[0];
        if (!url) {
            return m.reply("Need url");
        }

        try {
            const { data, headers } = await axios.get(url, {
                responseType: "arraybuffer",
            });

            if (!data || !headers) {
                return m.reply("Failed to fetch the url");
            }

            const mediaMap = {
                image: "image",
                video: "video",
                audio: "audio",
            };

            function getContentType() {
                for (const key in mediaMap) {
                    if (headers?.["content-type"]?.includes(mediaMap[key])) {
                        return key;
                    }
                }
                return null;
            }

            const contentType = getContentType();
            if (contentType) {
                return sock.sendMessage(
                    m.chat,
                    { [contentType]: Buffer.from(data) },
                    { quoted: m }
                );
            }

            try {
                const json = JSON.parse(data.toString());
                return m.reply(JSON.stringify(json, null, 2));
            } catch {
                return m.reply(data.toString());
            }
        } catch (error) {
            return m.reply(`Failed to execute the command: ${error}`);
        }
    },

    failed: "Failed to execute the %cmd command\n%error",
    wait: null,
    done: null,
};
