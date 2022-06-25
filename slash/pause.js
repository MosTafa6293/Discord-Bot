const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the song"),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply("There is no songs in the queue")
        }

        queue.setPaused(true)
        await interaction.editReply("Song has been paused! Use `/resume` to resume the song.")
    }
}