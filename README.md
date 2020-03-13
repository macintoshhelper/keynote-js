# keynote-js
Node.js JavaScript API interface for Keynote (Apple iWork slideshow app).

## Getting Started

Installing:

```sh
npm i keynote-js
```

Create file `script.js`:

```js
const { document } = require('keynote-js');

const main = async () => {
  const doc = new Document({ name: 'Test 123', theme: 'Test Theme' });

  await doc.create();

  const parentDoc = await doc.get();
  
  const docSlides = await doc.getSlides();

  // First slide is created by default, when we initialise the Document, so we can just access it with docSlides[0] and modify it.
  docSlides[0].setTitle('Welcome to Slide 1!', { fontSize: 90 });
  
  // Creating new slides:
  const slide = await new Slide({
    parent: parentDoc,
    baseSlide: {
      name: 'Title - Center'
    },
    title: 'Welcome to the Second Slide!'
  });

  await slide.create();
};

main();
```

and run with:

```sh
node script.js
```
