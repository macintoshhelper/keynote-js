import '@jxa/global-type';

// import { Keynote } from '@jxa/types/src/core/Keynote';

import { run } from '@jxa/run';





interface KeynoteShape {
  // pcls: 'shape',
  // backgroundFillType is read only :( (no API for backgroundColor fill yet)
    // - Looks like we have to inject it into the raw file... whyyy apple...
  backgroundFillType?: 'no fill' | 'color fill' | 'gradient fill' | 'advanced gradient fill' | 'image fill' | 'advanced image fill',
  width?: number,
  height?: number,
  position?: { x: number, y: number },
  opacity?: number,
  reflectionShowing?: false,
  objectText?: string,
  rotation?: 0,
  reflectionValue?: 0,
  locked?: false
};

export class Shape {
  props: { [key: string]: any };
  id?: number;
  index: number;

  constructor(props) {

    this.props = props;
  }

  async create() {
    const { props } = this;

    const res: string = await run((props = {}) => {
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

      // TODO: Figure out if this is definitely read only??? No API for setting fills? Wow :(
      // options.backgroundFillType = 'color fill';

      // if (parent) {
      //   options.parent = parentSlide;
      // }

      const shape = Keynote.Shape(options);

      parentSlide.shapes.push(shape);


      if (text) {
        shape.objectText = text;
      }
      // shape.backgroundColor = [62194, 42148, 15420];

      // if (title) {
      //   slide.defaultTitleItem.objectText = title;
      // }
      // if (body) {
      //   slide.defaultBodyItem.objectText = body;
      // }

      return JSON.stringify({
        index: parentSlide.shapes.length - 1,
      });
      // return JSON.stringify({ parentName: parentSlide.name });
      // return JSON.stringify(slide.properties());
    }, props);

    const properties = JSON.parse(res);

    console.log({ properties });

    this.index = properties.index;
    // this.id = properties.id;
  }
}
