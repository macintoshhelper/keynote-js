const { document, Document, Slide, Shape, TextItem } = require('../');


const main = async () => {
  const result = await document.getSelectedDocument();
  console.log(result, null, 2);

  const doc = new Document({ name: 'Test 123', theme: 'Test Theme' });

  await doc.create();

  const parentDoc = await doc.get();
  console.log(JSON.stringify({ parentDoc }, null, 2));

  const docSlides = await doc.getSlides();

  // There appears to be some distortion by JXA interface in a color space conversion. FIXME: Investigate how we can work around this to preverse the colour
  docSlides[0].setTitle('Welcome to Slide 1!', { color: '#F1A33C', fontSize: 100 });

  // SHOULD BE: 241, 163, 60
    // 61937, 41891, 15420
  // ACTUAL: 245, 178, 76
    // 62965, 45746, 19532

    // offset is: 1028, 3855, 4112
      // 4, 15, 16
  const slide = await new Slide({
    parent: parentDoc,
    baseSlide: {
      name: 'Title - Center'
    },
    title: 'Welcome!'
  });

  await slide.create();

  const slide2 = await new Slide({
    parent: parentDoc,
    baseSlide: {
      name: 'Title & Bullets'
    },
    title: 'Welcome to Slide 3!',
    body: ['List item 1', 'List item 2'].join('\n'),
  });

  await slide2.create();

  const group = await new Shape({
    parent: parentDoc,
    frame: {
      left: 100,
      top: 100,
      width: 400,
      height: 400,
    },
    text: 'Hello World'
  });

  await group.create();

  const textItem = await new TextItem({
    parent: parentDoc,
    text: 'Hello World. Lorem ipsum here.',
    frame: { width: 600 },
  });

  await textItem.create();
};

main();
