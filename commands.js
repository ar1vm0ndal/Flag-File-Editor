const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('get')
    .setDescription('Retrieves singular row data')
    .addStringOption((option) =>
        option.setName('input')
               .setDescription('Identifier for row')
               .setMinLength(5)
               .setRequired(true)),
    
    async execute(interaction){
        const identifier = interaction.options.getString('reason',true);
    }
}