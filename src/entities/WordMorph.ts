import Az from 'az';

export default class WordMorph {
	_sentencePart: Pick<Az.Tag, 'POS'>['POS'] | 'UNKNOWN';
	_isName: boolean;
	_isOrganisation: boolean;
	_isProperName: boolean;
	_word: string;
	inflect: () => WordMorph;

	constructor(azWordMorph: Az.WordMorph | {}) {
		const tag = (azWordMorph as Az.WordMorph).tag || {
			POS: 'UNKNOWN',
		};
		const word = (azWordMorph as Az.WordMorph).word || '';

		this._word = word;
		this._sentencePart = tag.POS;
		this._isName = !!tag.Name;
		this._isOrganisation = !!tag.Orgn;
		this._isProperName =
			this._isName || this._isOrganisation || tag.POS === 'LATN';
		this.inflect = () => {
			const _azWordMorph = (azWordMorph as any).inflect
				? (azWordMorph as Az.WordMorph).inflect()
				: azWordMorph;

			return new WordMorph(_azWordMorph);
		};
	}

	get sentencePart() {
		return this._sentencePart;
	}

	get isName() {
		return this._isName;
	}

	get isOrganisation() {
		return this._isOrganisation;
	}

	get isProperName() {
		return this._isProperName;
	}

	get word() {
		return this._word;
	}
}
