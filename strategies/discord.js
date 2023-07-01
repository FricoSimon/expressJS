const passport = require('passport');
const { Strategy } = require('passport-discord');
const DiscordUser = require('../database/schema/discordUser');

passport.serializeUser((user, done) => {
    console.log('serialize user');
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    console.log('deserialize user');
    console.log(id);
    try {
        const user = await DiscordUser.findById(id)
        if (!user) throw new Error('User not found!');
        done(null, user);
    } catch (err) {
        console.log(err);
        done(err);
    }
})

passport.use(new Strategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify'],

},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const DiscordUserDB = await DiscordUser.findOne({ discordId: profile.id });
            if (DiscordUserDB) {
                console.log('user found');
                return done(null, DiscordUserDB);
            } else {
                console.log('user created');
                const newDiscordUser = await DiscordUser.create({ discordId: profile.id });
                return done(null, newDiscordUser);
            }
        } catch {
            return done(err);
        }
    }
));