import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import axios from 'axios';
import { Server, IncomingMessage, ServerResponse } from 'http';

const server: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({});

server.register(fastifyCors, {
  origin: /localhost:*/i,
});

const opts: fastify.RouteShorthandOptions = {
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

server.get<{ words?: string[] }>(
  '/extra-words',
  opts,
  async (request, reply) => {
    if (!request.query.words || request.query.words.length === 0) {
      reply.code(200).send({ result: [] });
      return;
    }

    const t = await axios.get('http://mytager.com/get_tags.php', {
      params: {
        words: request.query.words,
        lang: 'ru',
      },
    });
    const result = (t.data.matches || []).filter(
      (s: string | undefined) => s && s.length > 0
    );

    reply.code(200).send({ result });
  }
);

server.listen(4004);
