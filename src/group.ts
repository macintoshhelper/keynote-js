import '@jxa/global-type';

// import { Keynote } from '@jxa/types/src/core/Keynote';

import { run } from '@jxa/run';




interface SlideProperties { // FIXME:
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

type BaseSlideName = 'Title & Subtitle' | 'Photo - Horizontal' | 'Title - Center' | 'Photo - Vertical' | 'Title - Top' | 'Title & Bullets' | 'Title, Bullets & Photo' | 'Bullets' | 'Photo - 3 Up' | 'Quote' | 'Photo' | 'Blank';

interface BaseSlide {
  name: BaseSlideName
};

interface KeynoteSlide {
  baseSlide?: BaseSlide,
  bodyShowing?: boolean,
  skipped?: boolean,
  slideNumber?: number,
  titleShowing?: boolean,
  defaultBodyItem?: any,
  defaultTitleItem?: any,
  presenterNotes?: any,
  transitionProperties?: any,
};

export class Group {
  props: { [key: string]: any };
  id: string;

  constructor(props: { [key: string]: any }) {

    this.props = props;
  }

  async create() {
    const { props } = this;

    const properties: SlideProperties = await run((props = {}) => {
      const { title, body, name, width, height, baseSlide, parent } = props;

      const Keynote = Application('Keynote');
      let theme;

      const docs = Application("Keynote").documents.whose({ id: parent.id });
      const doc = docs[0];

      const options: KeynoteSlide & { parent?: Object } = {};

      if (typeof props.theme === 'string') {
        // options.baseSlide = doc.masterSlides[the_key_here];
      }

      const parentSlide = doc.slides[parent.index];

      // const parentSlide = slides[0];

      // if (width) {
      //   options.width = width;
      // }
      // if (height) {
      //   options.height = height;
      // }
      // if (name) {
      //   options.name = name;
      // }
      // if (parent) {
      //   options.parent = doc;
      // }
      if (parent) {
        options.parent = parentSlide;
      }

      const group = Keynote.Group(options);


      // if (title) {
      //   slide.defaultTitleItem.objectText = title;
      // }
      // if (body) {
      //   slide.defaultBodyItem.objectText = body;
      // }

      return JSON.stringify(group.properties());
      // return JSON.stringify(slide.properties());
    }, props);

    console.log({ properties });

    this.id = properties.id;
  }
}
