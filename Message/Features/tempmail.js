export default {
    command: ["tempmail"],
    description: "Create tempmail and check message.",
    category: "Tools",
    owner: false,
    admin: false,
    hidden: false,
    limit: false,
    group: false,
    private: false,

    execute: async function (m, { sock, api, text }) {
        if (!text) {
            return m.reply(`Need action (create or check).`);
        }

        const [action, param] = text.split(" ");

        if (action === "create") {
            let name = param || "icikiwir"; // default is icikiwir if u don't input param, usage: tempmail create <name>

            const { data } = await api.post("/tools/tempMail/new", {
                name,
            });

            const { status, message, email } = data;

            if (!status) {
                return m.reply(message);
            }

            await sock.sendMessage(m.chat, { text: email }, { quoted: m });
        } else if (action === "check") {
            const { data } = await api.post("/tools/tempMail/messages", {
                email: param,
            });

            const { status, message, mails } = data;

            if (!status) {
                return m.reply(message);
            }

            let messageText = "*Message In Email:*\n\n";

            mails.forEach(email => {
                Object.keys(email).forEach(key => {
                    messageText += `*${key}:* ${email[key]}\n`;
                });
                messageText += "\n";
            });

            await sock.sendMessage(m.chat, { text: messageText.trim() }, { quoted: m });
        }
    },
    failed: "Failed to execute the %cmd command\n%error",
    wait: null,
    done: null,
};