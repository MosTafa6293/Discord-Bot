const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the song"),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply("There is no songs in the queue")
        }

        queue.setPaused(false)
        await interaction.editReply("Song has been resumed!")
    }
}