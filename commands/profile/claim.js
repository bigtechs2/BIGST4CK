module.exports = {
    name: "claim",
    aliases: ["bonus", "klaim"],
    category: "profile",
    code: async (ctx) => {
        const input = ctx.text;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "daily")}\n` +
                ctx.format.generateNotes([
                    `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} list`)} to see the list.`
                ])
            );

        if (input.toLowerCase() === "list") {
            const listText = await ctx.list.get(ctx, "claim");
            return await ctx.reply(listText);
        }

        const senderDb = ctx.db.user;
        const claim = claimRewards[input];
        const level = senderDb?.level || 0;

        if (!claim) return await ctx.reply(ctx.format.info("Invalid reward!"));
        if (ctx.sender.isOwner() || senderDb?.premium) return await ctx.reply(ctx.format.info("You already have unlimited coins!"));
        if (level < claim.level) return await ctx.reply(ctx.format.info(`You need to reach level ${claim.level} to claim this reward. Your current level is ${level}.`));

        const currentTime = Date.now();

        const lastClaim = (senderDb?.lastClaim ?? {})[input] || 0;
        const timePassed = currentTime - lastClaim;
        const remainingTime = claim.cooldown - timePassed;
        if (remainingTime > 0) return await ctx.reply(ctx.format.info(`You have already claimed ${input}. Wait ${ctx.format.convertMsToDuration(remainingTime)} to claim again.`));

        try {
            const rewardCoin = (senderDb?.coin || 0) + claim.reward;
            senderDb.coin = rewardCoin;
            (senderDb.lastClaim ||= {})[input] = currentTime;
            senderDb.save();

            await ctx.reply(ctx.format.info(`You successfully claimed ${input} reward of ${claim.reward} coins! Your current coins: ${rewardCoin}`));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
};

// Available claim rewards
const claimRewards = {
    daily: {
        reward: 100,
        cooldown: 24 * 60 * 60 * 1000, // 24 hours (100 coins)
        level: 1
    },
    weekly: {
        reward: 500,
        cooldown: 7 * 24 * 60 * 60 * 1000, // 7 days (500 coins)
        level: 15
    },
    monthly: {
        reward: 2000,
        cooldown: 30 * 24 * 60 * 60 * 1000, // 30 days (2000 coins)
        level: 50
    },
    yearly: {
        reward: 10000,
        cooldown: 365 * 24 * 60 * 60 * 1000, // 365 days (10000 coins)
        level: 75
    }
};