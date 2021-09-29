const { Client } = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Load status");

/**
 * @param {Client} client
 */

module.exports = async (client) => {

  // events start
  readdirSync("./events/").forEach((file) => {
    const events = readdirSync("./events/").filter((file) =>
      file.endsWith(".js")
    );
    for (let file of events) {
      let pull = require(`../events/${file}`);
      if (pull.name) {
        client.events.set(pull.name, pull);
      }
    }
    console.log((`${file}  Events Loaded Successfullly`));
  });

  // slashcommands start
  const slashCommands = await globPromise(
    `${process.cwd()}/slashCommands/**/*.js`
  );
  const arrayofslashCommands = [];

  const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if(['MESSAGE', 'USER'].includes(file.type)) delete file.description;
        if(file.userPermissions) file.defaultPermission = false;
        arrayOfSlashCommands.push(file);
    });

  client.on("ready", async () => {
    client.guilds.cache.forEach(async (g) => {
      await client.application.commands.set(arrayOfSlashCommands);
      const getRoles = (commandNames) => {
        const permissions = arrayOfSlashCommands.find((x) => x.name === commandName).userPermissions;

        if(!permissions) return null;
        return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);


      };
    });
  });
};
