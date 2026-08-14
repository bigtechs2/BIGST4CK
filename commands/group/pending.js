module.exports = [{
    name: "approve",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "all") {
            const pendings = await ctx.group().pendingMembers();
            if (pendings.length === 0) return await ctx.reply(ctx.format.info("There are no pending members awaiting approval."));

            try {
                const allJids = pendings.map(pending => pending.jid);
                await ctx.group().approvePendingMembers(allJids);

                return await ctx.reply(ctx.format.info(`Successfully approved all members (${allJids.length}).`));
            } catch (error) {
                return await ctx.helper.handleError(ctx, error);
            }
        }

        const target = await ctx.target(["text"]);

        if (!target.jid)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "6281234567891")}\n` +
                ctx.format.generateNotes([
                    `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} all`)} to approve all pending members.`
                ])
            );

        const pendings = await ctx.group().pendingMembers();
        const isPending = pendings.some(pending => ctx.helper.areJidsSameUser(pending.jid, target.jid));
        if (!isPending) return await ctx.reply(ctx.format.info("Account not found in the pending members list."));

        try {
            await ctx.group().approvePendingMembers(target.jid);

            await ctx.reply(ctx.format.info("Successfully approved!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}, {
    name: "reject",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        if (ctx.args[0]?.toLowerCase() === "all") {
            const pendings = await ctx.group().pendingMembers();
            if (pendings.length === 0) return await ctx.reply(ctx.format.info("There are no pending members awaiting approval."));

            try {
                const allJids = pendings.map(pending => pending.jid);
                await ctx.group().rejectPendingMembers(allJids);

                return await ctx.reply(ctx.format.info(`Successfully rejected all members (${allJids.length}).`));
            } catch (error) {
                return await ctx.helper.handleError(ctx, error);
            }
        }

        const target = await ctx.target(["text"]);

        if (!target.jid)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "6281234567891")}\n` +
                ctx.format.generateNotes([
                    `Type ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} all`)} to reject all pending members.`
                ])
            );

        const pendings = await ctx.group().pendingMembers();
        const isPending = pendings.some(pending => ctx.helper.areJidsSameUser(pending.jid, target.jid));
        if (!isPending) return await ctx.reply(ctx.format.info("Account not found in the pending members list."));

        try {
            await ctx.group().rejectPendingMembers(target.jid);

            await ctx.reply(ctx.format.info("Successfully rejected!"));
        } catch (error) {
            await ctx.helper.handleError(ctx, error);
        }
    }
}];