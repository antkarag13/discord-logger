const {MessageAttachment} = require('discord.js');
const Canvas = require('canvas');


async function guildMemberAddLog (member, channel) {
    const applyText = (canvas, text) => {
        const context = canvas.getContext('2d');

        // Declare a base size of the font
        let fontSize = 70;

        do {
            // Assign the font to the context and decrement it so it can be measured again
            context.font = `${fontSize -= 10}px sans-serif`;
            // Compare pixel width of the text to the canvas minus the approximate avatar size
        } while (context.measureText(text).width > canvas.width - 300);

        // Return the result to use in the actual canvas
        return context.font;
    };
    // Create a 700x250 pixel canvas and get its context
    // The context will be used to modify the canvas
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext('2d');

    const background = await Canvas.loadImage('./wallpaper.jpg');

    // This uses the canvas dimensions to stretch the image onto the entire canvas
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Set the color of the stroke
    context.strokeStyle = '#0099ff';

    // Draw a rectangle with the dimensions of the entire canvas
    context.strokeRect(0, 0, canvas.width, canvas.height);

    // Slightly smaller text placed above the member's display name
    context.font = '28px sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

    // Add an exclamation point here and below
    context.font = applyText(canvas, `${member.displayName}!`);
    context.fillStyle = '#ffffff';
    context.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

    // Pick up the pen
    context.beginPath();

    // Start the arc to form a circle
    context.arc(125, 125, 100, 0, Math.PI * 2, true);

    // Put the pen down
    context.closePath();

    // Clip off the region you drew on
    context.clip();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));

    // Move the image downwards vertically and constrain its height to 200, so that it's square
    context.drawImage(avatar, 25, 25, 200, 200);

    // Use the helpful Attachment class structure to process the file for you
    const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

    channel.send({ files: [attachment] });
}
module.exports = guildMemberAddLog()