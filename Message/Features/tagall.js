// File://home/rose/BOT/SuryaRB/Message/Features/tagall.js
export default {
    command: ["tagall", "everyone"],
    description: "Tag all members.",
    category: "Group",
    owner: false,
    admin: true,
    hidden: false,
    limit: 0,

    execute: async function (m, { sock }) {
        const data = await sock.groupMetadata(m.chat);
        const len = data.participants.length;
        const mentions = [];
        for (let i = 0; i < len; i++) {
            const serialized = data.participants[i].id.split('@')[0];
            mentions.push({
                tag: `@${serialized}\n`,
                mention: `${serialized}@s.whatsapp.net`
            });
        }
        const messageText = mentions.map(mention => mention.tag).join(' ');
        sock.sendMessage(m.chat, {
            text: messageText,
            mentions: mentions.map(mention => mention.mention)
        });
    },
    failed: "Failed to execute the %cmd command\n%error",
    wait: null,
    done: null,
};