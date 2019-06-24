// import 'module-alias/register';
import Fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import axios from 'axios';
import { Server, IncomingMessage, ServerResponse } from 'http';
import WordsMorphFacade from './facades/WordsMorphFacade';
import blackListWords from './blackListWords';

module.exports = function(
	fastify: Fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>,
	options: any,
	next: () => void
) {
	fastify.register(fastifyCors, {
		origin: /(localhost)|(tickytook\.ru):*/i,
	});

	const opts: Fastify.RouteShorthandOptions = {
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						result: {
							type: 'array',
							items: {
								type: 'string',
							},
						},
					},
				},
			},
		},
	};

	fastify.post<{ words?: string[] }>(
		'/extra-words',
		opts,
		async (request, reply) => {
			const words = request.body.words as string[];
			const wordsArray = words || [];

			if (!words || words.length === 0) {
				reply.code(200).send({ result: [] });
				return;
			}

			const wordsMorphHandler = new WordsMorphFacade(wordsArray);

			await wordsMorphHandler.init();

			const keywords = [
				...wordsMorphHandler.getLatins(),
				...wordsMorphHandler.getNouns(),
			].map(w => w.inflect()._word);

			const t = await axios.get('http://mytager.com/get_tags.php', {
				params: {
					words: (keywords.length > 0 ? keywords : words)
						.map(w => `#${w}`)
						.join('+'),
					lang: 'ru',
				},
			});

			const { matches, top } = t.data;

			const queryWords = (matches || []).filter(
				(s: string | undefined) =>
					s &&
					s.length > 0 &&
					top.indexOf(s) < 0 &&
					blackListWords.indexOf(s) < 0
			);

			const result = keywords.concat(queryWords);

			reply.code(200).send({ result });
		}
	);
	next();
};
