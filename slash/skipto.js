const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skip to a certain song")
        .addNumberOption((option) => option
            .setName("tracknum")
            .setDescription("The track to skip to")
            .setMinValue(1)
            .setRequired(true)
        ),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply("There is no songs in the queue")
        }

        const songnum = interaction.opitons.getNumber("tracknum")
        if (songnum > queue.tracks.length)
            return interaction.editReply("Invalid track number")

        queue.skipTo(songnum - 1)
        await interaction.editReply(`Skipped ahead to track number ${songnum}`)
    }
}