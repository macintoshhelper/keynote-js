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

export class Slide {
  props: { [key: string]: any };
  id: number;

  slide: { id: number, index: number };

  constructor(props: { [key: string]: any }) {

    this.props = props;
  }

  async create() {
    const { props } = this;

    const res: string = await run((props = {}) => {
      const { title, body, name, width, height, baseSlide, parent } = props;

      const Keynote = Application('Keynote');
      let theme;

      const docs = Application("Keynote").documents.whose({ id: parent.id });
      const doc = docs[0];

      const options: KeynoteSlide & { parent?: Object } = {};

      if (typeof props.theme === 'string') {
        // options.baseSlide = doc.masterSlides[the_key_here];
      }

      var masterSlides = [];
      for (var i = 0, len = doc.masterSlides.length; i < len; i++) {
        const mSlide = doc.masterSlides[i];

        masterSlides.push({
          name: mSlide.name(),
          body: mSlide.defaultBodyItem().objectText(),
          // slideNumber: mSlide.slideNumber(),
        });
      }
      if (baseSlide) {
        const mSlides = doc.masterSlides.whose(baseSlide);
        const masterSlide = mSlides[0];

        options.baseSlide = masterSlide;
      }
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

      const slide = Keynote.Slide(options);

      doc.slides.push(slide);

      if (title) {
        slide.defaultTitleItem.objectText = title;
      }
      if (body) {
        slide.defaultBodyItem.objectText = body;
      }

      return JSON.stringify({
        id: doc.slides.length,
        index: doc.slides.length - 1
      });
      // return JSON.stringify(slide.properties());
    }, props);

    const properties: { id: number, index: number } = JSON.parse(res);

    this.id = properties.id;
    this.slide = properties;
  }

  async setTitle(title: string, style: { [key: string]: any }) {
    const { id, props } = this;

    console.log(JSON.stringify({ id, props, title }, null, 2));

    await run((props = {}) => {
      function hexToRGB(h: string) {
        let r: string | number = 0, g: string | number = 0, b: string | number = 0;

        // 3 digits
        if (h.length == 4) {
          r = "0x" + h[1] + h[1];
          g = "0x" + h[2] + h[2];
          b = "0x" + h[3] + h[3];

          // 6 digits
        } else if (h.length == 7) {
          r = "0x" + h[1] + h[2];
          g = "0x" + h[3] + h[4];
          b = "0x" + h[5] + h[6];
        }

        return [(+r) * 257, (+g) * 257, (+b) * 257];
      }

      const { title, id, style, parent } = props;
      const { color, fontSize, fontFamily } = style || {};

      const docs = Application("Keynote").documents.whose({ id: parent.id });
      const doc = docs[0];

      const slide = doc.slides[id - 1];

      slide.defaultTitleItem.objectText = title;
      if (color) {
        // [62194, 42148, 15420]
        slide.defaultTitleItem.objectText.color = hexToRGB(color);
      }
      if (fontSize) {
        slide.defaultTitleItem.objectText.size = fontSize;
      }
      if (fontFamily) {
        slide.defaultTitleItem.objectText.font = fontFamily;
      }

    }, { title, id, style, ...props });
  }

  async setBody(title: string) {
    const { id, props } = this;

    await run((props = {}) => {
      const { title, id, parent } = props;

      const docs = Application("Keynote").documents.whose({ id: parent.id });
      const doc = docs[0];

      const slide = doc.slides[id - 1];

      slide.defaultBodyItem.objectText = title;

    }, { title, id, ...props });
  }

  async get() {
    return this.slide;
  }
}

