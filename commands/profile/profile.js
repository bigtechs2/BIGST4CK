module.exports = {
    name: "profile",
    aliases: ["me", "prof", "profil"],
    category: "profile",
    code: async (ctx) => {
        try {
            const users = ctx.db.users.getAll();
            const userDb = ctx.db.user;

            const leaderboardData = users.map(user => ({
                jid: user.jid,
                level: user.level || 0,
                winGame: user.winGame || 0
            })).sort((a, b) => b.winGame - a.winGame || b.level - a.level);

            const premiumStatus = ctx.sender.isOwner() ? "Owner" : 
                (userDb?.premium ? `Premium (${userDb?.premiumExpiration ? `${ctx.format.convertMsToDuration(userDb.premiumExpiration - Date.now(), ["days", "hours"])} remaining` : "Forever"})` : "Freemium");

            await ctx.reply(
                `»› ${ctx.format.bold("Name")}: ${ctx.sender.pushName}\n` +
                `»› ${ctx.format.bold("Status")}: ${premiumStatus}\n` +
                `»› ${ctx.format.bold("Level")}: ${userDb?.level || 0} (${userDb?.xp || 0}/100)\n` +
                `»› ${ctx.format.bold("Coins")}: ${ctx.sender.isOwner() || userDb?.premium ? "Unlimited" : (userDb?.coin || 0)}\n` +
                `»› ${ctx.format.bold("Wins")}: ${userDb?.winGame || 0}\n` +
                `»› ${ctx.format.bold("Rank")}: ${leaderboardData.findIndex(user => ctx.helper.areJidsSameUser(user.jid, ctx.sender.lid)) + 1}`
            );
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};