const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip the song"),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply("There is no songs in the queue")
        }

        const song = queue.current

        queue.skip()
        await interaction.editReply({
            embeds: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription(`${song.title} has been skipped!`)
            ]
        })
    }
}