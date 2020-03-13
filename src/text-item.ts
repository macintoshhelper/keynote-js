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

interface KeynoteShape {
  // baseSlide?: BaseSlide,
  backgroundFillType?: 'no fill' | 'color fill' | 'gradient fill' | 'advanced gradient fill' | 'image fill' | 'advanced image fill',
  width?: number,
  height?: number,
  position?: { x: number, y: number },
  // bodyShowing?: boolean,
  // skipped?: boolean,
  // slideNumber?: number,
  // titleShowing?: boolean,
  // defaultBodyItem?: any,
  // defaultTitleItem?: any,
  // presenterNotes?: any,
  // transitionProperties?: any,
};

export class TextItem {
  props: { [key: string]: any };
  id: string;

  constructor(props: { [key: string]: any }) {

    this.props = props;
  }

  async create() {
    const { props } = this;

    const properties: SlideProperties = await run((props = {}) => {
      const { title, body, name, text, frame, baseSlide, parent } = props;
      const { left = 0, top = 0, width = 100, height = 100 } = frame || {};

      const Keynote = Application('Keynote');
      let theme;

      const docs = Application("Keynote").documents.whose({ id: parent.id });
      const doc = docs[0];

      const options: KeynoteShape & { parent?: Object } = {};

      if (typeof props.theme === 'string') {
        // options.baseSlide = doc.masterSlides[the_key_here];
      }

      const parentSlide = doc.slides[doc.slides.length - 1];

      // const parentSlide = slides[0];

      if (width) {
        options.width = width;
      }
      if (height) {
        options.height = height;
      }
      // if (name) {
      //   options.name = name;
      // }
      // if (parent) {
      //   options.parent = doc;
      // }
      options.position = { x: left, y: top };

      // TODO: Figure out if this is definitely read only??? No API for setting fill colors? Wow :(
      // options.backgroundFillType = 'color fill';

      // if (parent) {
      //   options.parent = parentSlide;
      // }

      const textItem = Keynote.TextItem(options);

      parentSlide.textItems.push(textItem);

      if (text) {
        textItem.objectText = text;
      }

      // if (title) {
      //   slide.defaultTitleItem.objectText = title;
      // }
      // if (body) {
      //   slide.defaultBodyItem.objectText = body;
      // }

      return JSON.stringify({
        index: parentSlide.textItems.length - 1,
      });
      // return JSON.stringify({ parentName: parentSlide.name });
      // return JSON.stringify(slide.properties());
    }, props);

    console.log({ properties });

    this.id = properties.id;
  }
}
