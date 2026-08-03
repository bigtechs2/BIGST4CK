const session = new Map();

module.exports = {
    name: "trivia",
    aliases: ["quiz"],
    category: "game",

    code: async (ctx) => {
        if (session.has(ctx.id)) return await ctx.reply(tools.msg.info("A game session is already running!"));

        try {
            const QUESTIONS = [
                { q: "What is the capital of France?",               a: "paris",       hint: "P_ _ _ _"       },
                { q: "How many sides does a hexagon have?",          a: "6",           hint: "Between 5 and 7" },
                { q: "What planet is closest to the Sun?",           a: "mercury",     hint: "M_ _ _ _ _ _"   },
                { q: "Who painted the Mona Lisa?",                   a: "da vinci",    hint: "Da V_ _ _ _"    },
                { q: "What is the largest ocean on Earth?",          a: "pacific",     hint: "P_ _ _ _ _ _"   },
                { q: "How many bones are in the human body?",        a: "206",         hint: "2 _ _"          },
                { q: "What is the chemical symbol for Gold?",        a: "au",          hint: "_ U"            },
                { q: "Which country invented pizza?",                a: "italy",       hint: "I_ _ _ _"       },
                { q: "What is the speed of light in km/s?",          a: "300000",      hint: "3 _ _ _ _ _"    },
                { q: "How many players are in a football team?",     a: "11",          hint: "Between 10-12"  },
                { q: "What is the hardest natural substance?",       a: "diamond",     hint: "D_ _ _ _ _ _"   },
                { q: "Which animal is the fastest on land?",         a: "cheetah",     hint: "C_ _ _ _ _ _"   },
                { q: "What language is spoken in Brazil?",           a: "portuguese",  hint: "P_ _ _ _ _ _ _ _" },
                { q: "How many continents are there?",               a: "7",           hint: "Between 6 and 8" },
                { q: "What is H2O commonly known as?",               a: "water",       hint: "W_ _ _ _"       },
                { q: "What is the tallest mountain in the world?",   a: "everest",     hint: "E_ _ _ _ _ _"   },
                { q: "What is the smallest planet in our system?",   a: "mercury",     hint: "M_ _ _ _ _ _"   },
                { q: "How many hours are in a day?",                 a: "24",          hint: "2 _"            },
                { q: "What is the longest river in the world?",      a: "nile",        hint: "N_ _ _"         },
                { q: "What is the chemical symbol for Water?",       a: "h2o",         hint: "H _ _"          },
                { q: "Which planet has the most moons?",             a: "saturn",      hint: "S_ _ _ _ _"     },
                { q: "What is the capital of Japan?",                a: "tokyo",       hint: "T_ _ _ _"       },
                { q: "How many days are in a leap year?",            a: "366",         hint: "3 _ _"          },
                { q: "What gas do plants absorb from the air?",      a: "co2",         hint: "C _ _"          },
                { q: "Who wrote Romeo and Juliet?",                  a: "shakespeare", hint: "S_ _ _ _ _ _ _ _ _" }
            ];

            const q = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

            const game = {
                question: q,
                timeout: 30000,
                coin: 8
            };

            session.set(ctx.id, true);

            await ctx.reply({
                text:
                    `🧠 *TRIVIA*\n\n` +
                    `❓ ${q.q}\n\n` +
                    `› ${formatter.bold("Reward")}: ${game.coin} Coins\n` +
                    `› ${formatter.bold("Time limit")}: ${tools.msg.convertMsToDuration(game.timeout)}`,
                buttons: [
                    { text: "Hint (3 Coins)", id: `hint_${ctx.used.command}` },
                    { text: "Give Up", id: `surrender_${ctx.used.command}` }
                ]
            });

            const collector = ctx.MessageCollector({ time: game.timeout });
            const playAgain = [{ text: "Play Again", id: ctx.used.prefix + ctx.used.command }];

            collector.on("collect", async (collCtx) => {
                const input = collCtx.msg.body?.toLowerCase().trim();
                const participantDb = collCtx.db.user;

                if (input === `hint_${ctx.used.command}`) {
                    if (participantDb.coin < 3) return await collCtx.reply(tools.msg.info(config.msg.coin));
                    participantDb.coin -= 3;
                    participantDb.save();
                    return await collCtx.reply(
                        tools.msg.info(`Hint: *${game.question.hint}*`)
                    );
                }

                if (input === `surrender_${ctx.used.command}`) {
                    session.delete(ctx.id);
                    collector.stop();
                    return await collCtx.reply({
                        text: tools.msg.info(`You gave up! The answer was *${tools.msg.ucwords(game.question.a)}*`),
                        buttons: playAgain
                    });
                }

                if (input === game.question.a) {
                    session.delete(ctx.id);
                    collector.stop();
                    participantDb.coin += game.coin;
                    participantDb.winGame += 1;
                    participantDb.save();
                    return await collCtx.reply({
                        text: tools.msg.info(`✅ CORRECT! +${game.coin} Coins`),
                        buttons: playAgain
                    });
                }

                if (tools.cmd.didYouMean(input, [game.question.a]) === game.question.a) {
                    return await collCtx.reply(tools.msg.info("So close! Try again."));
                }
            });

            collector.on("end", async () => {
                if (session.has(ctx.id)) {
                    session.delete(ctx.id);
                    await ctx.reply({
                        text: tools.msg.info(`Time's up! The answer was *${tools.msg.ucwords(game.question.a)}*`),
                        buttons: playAgain
                    });
                }
            });

        } catch (error) {
            session.delete(ctx.id);
            await tools.cmd.handleError(ctx, error, true);
        }
    }
};