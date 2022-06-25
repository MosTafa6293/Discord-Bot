const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play Songs From YouTube")
        .addSubcommand((subcommand) => subcommand
            .setName("song")
            .setDescription("Play a single song from")
            .addStringOption((option) => option
                .setName("url")
                .setDescription("The song's URL")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName("playlist")
            .setDescription("Play a playlist from YouTube")
            .addStringOption((option) => option
                .setName("url")
                .setDescription("The playlist's URL")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) => subcommand
            .setName("search")
            .setDescription("Search for song based on provided keywords")
            .addStringOption((option) => option
                .setName("searchterms")
                .setDescription("The search keywords")
                .setRequired(true)
            )
        ),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("You need to be in a VC to use this command")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const res = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if (res.tracks.length === 0)
                return interaction.editReply("No results")

            const song = res.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})**\n has been added to the queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })

        } else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const res = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if (res.tracks.length === 0)
                return interaction.editReply("No results")

            const playlist = res.playlist
            await queue.addTracks(res.tracks)
            embed
                .setDescription(`**${res.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the queue`)
                .setThumbnail(playlist.thumbnail)
        } else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            const res = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (res.tracks.length === 0)
                return interaction.editReply("No results")

            const song = res.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})**\n has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })
        }
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
    }
}