declare module 'az' {
	// properties is from http://opencorpora.org/dict.php?act=gram
	export type Tag = {
		Name?: boolean;
		Orgn?: boolean;
		ANim?: string;
		GNdr?: 'masc' | 'femn' | 'neut' | 'ms-f';
		NMbr?: 'sing' | 'plur';
		POS: 'NOUN' | 'VERB' | 'PREP' | 'LATN';
	};

	export type WordMorph = {
		tag: Tag;
		parser: 'Dictionary' | 'Latin';
		inflect: () => WordMorph;
		base: () => string;
		log: () => void;
		word: string;
	};

	type Config = {
		ignoreCase?: boolean;
		stutter?: number;
		typos?: string | number;
		forceParse?: boolean;
	};

	const Morph: {
		(word: string, config?: Config): Array<WordMorph | {}>;
		init: (...args: any[]) => void;
	};
}
