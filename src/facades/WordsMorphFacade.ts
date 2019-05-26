import Az from 'az';
import WordMorph from '../entities/WordMorph';

export default class WordsMorphFacade {
	original: string[] = [];
	resultWords: WordMorph[] = [];

	constructor(words: string[]) {
		this.original = words;
	}

	init = () =>
		new Promise(resolve =>
			Az.Morph.init('node_modules/az/dicts', this.callback(resolve))
		);

	callback = (resolve: () => void) => () => {
		const azWords = this.original.map(w => {
			const morph = Az.Morph(w);
			if (morph.length === 0) return new WordMorph({});

			return new WordMorph(
				Object.keys(morph[0]).length > 0 ? (morph[0] as Az.WordMorph) : {}
			);
		});

		this.resultWords = azWords;

		resolve();
	};

	getNouns = () => {
		return this.resultWords.filter(w => w._sentencePart === 'NOUN');
	};

	getLatins = () => {
		return this.resultWords.filter(w => w._sentencePart === 'LATN');
	};

	getUnknowns = () => {
		return this.resultWords.filter(w => w._sentencePart === 'UNKNOWN');
	};
}
