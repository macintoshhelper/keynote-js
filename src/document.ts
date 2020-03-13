import '@jxa/global-type';

// import { Keynote } from '@jxa/types/src/core/Keynote';

import { run } from '@jxa/run';

import { Slide } from './slide';

const getDocuments = async (conditions: { [key: string]: any }) => {
  const res: string = await run(conditions => {
    let documents;
    if (conditions) {
      documents = Application("Keynote").documents.whose(conditions);
    } else {
      documents = Application("Keynote").documents;
    }
    var results = [];

    for (var i = 0, len = documents.length; i < len; i++) {
      results.push({
        id: documents[i].id
      });
    }

    return JSON.stringify(results);
  }, conditions);

  const results = JSON.parse(res);

  return results;
};

type TransitionEffect = 'no transition effect' | 'magic move' | 'shimmer' | 'sparkle' | 'swing' | 'object cube' | 'object flip' | 'object pop' | 'object push' | 'object revolve' | 'object zoom' | 'perspective' | 'clothesline' | 'confetti' | 'dissolve' | 'drop' | 'droplet' | 'fade through color' | 'grid' | 'iris' | 'move in' | 'push' | 'reveal' | 'switch' | 'wipe' | 'blinds' | 'color planes' | 'cube' | 'doorway' | 'fall' | 'flip' | 'flop' | 'mosaic' | 'page flip' | 'pivot' | 'reflection' | 'revolving door' | 'scale' | 'swap' | 'swoosh' | 'twirl' | 'twist';

interface KeynoteSlideProps {
  pcls: 'slide',
  slideNumber: number,
  skipped: boolean,
  bodyShowing: boolean,
  presenterNotes: string,
  transitionProperties: {
    transitionDuration: number,
    transitionDelay: number,
    transitionEffect: TransitionEffect,
    automaticTransition: boolean
  },
  titleShowing: true
};

const getSelectedDocument = async () => {
  const res: string = await run(() => {
    const app = Application("Keynote");
    const window = app.windows()[0];

    const doc = window.document();

    // const slides = doc.slides.map((slide) => slide.properties());
    var slides = [];

    for (var i = 0, len = doc.slides.length; i < len; i++) {
      const slideProps: KeynoteSlideProps = doc.slides[i].properties();

      slides.push({
        index: slideProps.slideNumber - 1,
        id: slideProps.slideNumber,
        transitionProperties: slideProps.transitionProperties,
      });
    }

    // doc.properties()

    // doc.properties()
    return JSON.stringify({
      slides,
      selectedSlide: slides[doc.currentSlide.properties().slideNumber - 1],
      // selectedSlide: slides[doc.currentSlide.slideNumber - 1],
    });
  });

  const { slides, selectedSlide } = JSON.parse(res);

  return {
    slides: slides.map((slide: { id: number }) => new Slide({ id: slide.id })),
    selectedSlide: new Slide({ id: selectedSlide.id })
  };
}

interface DocumentProperties {
  id: string,
  pcls: string,
  height: number,
  width: number,
  autoRestart: boolean,
  maximumIdleDuration: number,
  file: any,
  modified: boolean,
  slideNumbersShowing: boolean,
  autoPlay: boolean,
  autoLoop: boolean,
  name: string,
};

type DocumentTheme = 'Black' | 'White' | 'Gradient' | 'Showroom' | 'Modern Type' | 'Exhibition' | 'Drafting' | 'Photo Essay' | 'Classic' | 'Slate' | 'Cream Paper' | 'Artisan' | 'Improv' | 'Renaissance' | 'Photo Portfolio' | 'Editorial' | 'Kyoto' | 'Brushed Canvas' | 'Typeset' | 'Moroccan' | 'Craft' | 'Industrial' | 'Modern Portfolio' | 'Harmony' | 'Graph Paper' | 'Blueprint' | 'Formal' | 'Leather Book' | 'Vintage' | 'Hard Cover' | 'Linen Book' | 'Chalkboard' | 'Parchment';



interface KeynoteDocument {
  id?: string,
  pcls?: 'document',
  name?: string,
  slideNumbersShowing?: boolean,
  documentTheme?: DocumentTheme,
  autoLoop?: boolean,
  autoPlay?: boolean,
  autoRestart?: boolean,
  maximumIdleDuration?: number,
  currentSlide?: any,
  height?: number,
  width?: number,
};

export class Document {
  props: { [key: string]: any };
  id: string;
  name: string;
  document?: { height: number, width: number };
  slides?: Slide[];

  constructor(props: { [key: string]: any }) {

    this.props = props;
  }

  async create() {
    const { props } = this;

    const res: string = await run((props = {}) => {
      const { name, width, height } = props;

      const Keynote = Application('Keynote');
      let theme;

      if (props.theme && typeof props.theme !== 'string' && props.theme.id) {
        //@ts-ignore
        theme = Keynote.themes.whose({ id: theme.id }).first;
      }

      const docProperties: KeynoteDocument = {};

      if (typeof props.theme === 'string') {
        docProperties.documentTheme = Keynote.themes[props.theme];
      }
      if (width) {
        docProperties.width = width;
      }
      if (height) {
        docProperties.height = height;
      }
      if (name) {
        docProperties.name = name;
      }

      const doc = Keynote.Document(docProperties);

      Keynote.documents.push(doc);

      const resProps = doc.properties();

      const slides = [];

      for (var i = 0, len = doc.slides.length; i < len; i++) {
        const slide = doc.slides[i];
        slides.push({
          id: i + 1,
        });
      }

      return JSON.stringify({
        id: resProps.id,
        height: resProps.height,
        width: resProps.width,
        name: resProps.name,
        slides,
      });
    }, props);

    const { id, height, width, name, slides } = JSON.parse(res);

    // this.id = properties.id;

    this.id = id;
    this.name = name;
    this.document = { height, width };
    this.slides = (slides as { id: number }[]).map(({ id: slideId }) => new Slide({ id: slideId, parent: { id } }));
  }

  async get() {
    const { id, name } = this;
    return {
      ...this.document,
      id,
      name,
    };
  }

  async getSlides() {
    const { slides } = this;

    return slides;
  }
}

export default {
  getDocuments,
  getSelectedDocument,
};
