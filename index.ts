import DiscordJS, { SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new DiscordJS.Client({intents:33281});
const {REST, Routes} = require('discord.js');
const fun = require('./functions.js');




client.on('ready',() => {
    console.log('The bot is ready');
    client.user?.setActivity('Defending the U.S. of A');
});



const commands = [
    {
        name : 'bobo',
        description : 'replies with pong!',
    },
    {
        name : 'get',
        description : 'unloads houses following a common parameter', 
        options : [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name : 'mark',
        description : 'marks a house with flag in',
        options : [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    },{
        name : 'unmark',
        description : 'marks a house with flag in',
        options : [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'paid',
        description : 'marks a house as paid',
        options : [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    },{
        name: 'unpaid',
        description : 'marks a house as paid',
        options : [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    },
    {
        name: 'change',
        description: 'changes one characteristic based on a known identifier',
        options: [
            {
                name: 'identifier',
                description:'give a trait about the house',
                type: 3,
                required: true,
            },
        ],
    }
];
const rest = new REST({version : '10'}).setToken(process.env.TOKEN);
(async () => {
    try{
        console.log('Started refreshing application (/) commands.');
        
        await rest.put(Routes.applicationCommands(process.env.clientId), {body: commands});

        console.log('Successfully reloaded application (/) commands.');
    }catch (error){
        console.error(error);
    }
})();



client.on('interactionCreate',  async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'bobo'){
        let i =0;
        let j='Bobo <@1002969191017627669>';
        if (interaction.user.id.includes('1002969191017627669')){
            j='Bobo <@600727040597032990>';
        }
        await interaction.reply(j);
        let x=2000;
        while (i<500){
            if (i%150==0) x=5000;
            await interaction.followUp(j);
            setTimeout(function (){   
                //console.log('');             
            },2000);
        i++;
        }
    }else if (interaction.commandName === 'get'){
        const house = String(interaction.options.getString('identifier'));
            interaction.reply("Sending " + house);
            const arr = Array(await fun.get(house))[0][0];
            const txt = String(fun.format(arr)).split("\n\n");
            txt.forEach(element => {
                interaction.followUp(String(element)+".\n");
            });
                 
    }else if (interaction.commandName === 'mark'){
        const house = String(interaction.options.getString('identifier'));
        interaction.reply("Marking" + house);
        let arr = [];
        try{
         arr = Array(await fun.change(house,'Marked'))[0][0];
        }catch(error){
            interaction.followUp("Try Again");
        }
        //const txt = String(fun.format(arr)).split("\n\n");
        //txt.forEach(element => {
        
            interaction.followUp(fun.format(Array(arr))+".\n");
       // });
    }else if (interaction.commandName === 'unmark'){
        const house = String(interaction.options.getString('identifier'));
        interaction.reply("Unmarking "+ house );
        let arr = [];
        try{
         arr = Array(await fun.change(house,'Unmarked'))[0][0];
        }catch(error){
            interaction.followUp("Try Again");
        }
        //const txt = String(fun.format(arr)).split("\n\n");
        //txt.forEach(element => {
        
            interaction.followUp(fun.format(Array(arr))+".\n");
       // });
    }else if (interaction.commandName === 'paid'){
        const house = String(interaction.options.getString('identifier'));
        interaction.reply("Paid" + house);
        let arr = [];
        try{
         arr = Array(await fun.change(house,'Paid'))[0][0];
        }catch(error){
            interaction.followUp("Try Again");
        }
        //const txt = String(fun.format(arr)).split("\n\n");
        //txt.forEach(element => {
        
            interaction.followUp(fun.format(Array(arr))+".\n");
       // });
    }else if (interaction.commandName === 'unpaid'){
        const house = String(interaction.options.getString('identifier'));
        interaction.reply("Unpaid" + house);
        let arr = [];
        try{
         arr = Array(await fun.change(house,'Unpaid'))[0][0];
        }catch(error){
            interaction.followUp("Try Again");
        }
        //const txt = String(fun.format(arr)).split("\n\n");
        //txt.forEach(element => {
        
            interaction.followUp(fun.format(Array(arr))+".\n");
       // });
    }
    
});

client.login(process.env.TOKEN);