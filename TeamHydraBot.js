import discord
import youtube_dl
from discord.ext import commands

TOKEN = 'NDg3MTcxNDQ2NTk5MDU3NDA4.DnLQsw.g0KsXPZqJERDda0UJ-2q3fcS5ck'
client = commands.Bot(command_prefix = '?')

players = {}

@client.event
async def on_ready():
    print('Bot online.')

@client.command(pass_context=True)
async def join(ctx):
    channel = ctx.message.author.voice.voice_channel
    await client.join_voice_channel(channel)

@client.command(pass_context=True)
async def leave(ctx):
    server = ctx.message.server
    voice_client = client.voice_client_in(server)
    await voice_client.disconnect()

@client.command(pass_context=True)
async def play(ctx, url):
    server = ctx.message.server
    voice_client = client.voice_client_in(server)
    player = await voice_client.create_ytdl_player(url)
    players[server.id] = player
    player.start()

@client.command(pass_context=True)
async def pause(ctx):
    id = ctx.message.server.id
    players[id].pause()

@client.command(pass_context=True)
async def resume(ctx):
    id = ctx.message.server.id
    players[id].resume()

    
@client.command(pass_context=True)
async def clear(ctx, amount=100):
    channel = ctx.messages.channel
    messages = []
    async for message in client.logs_from(channel, limit=int(amount) +1):
        messages.append(message)
    await client.delete_message(messages)
    await client.say('Messages deleted')

    
@client.event
async def on_member_join(member):
    role = discord.utils.get(member.server.roles, name ='-=Hydra soldiers=-')
    await client.add_roles(member, role)


    


client.run(TOKEN)

