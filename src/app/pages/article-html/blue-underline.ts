import Quill from 'quill';

const Inline: any = Quill.import('blots/inline');

class BlueUnderline extends Inline {
  static create() {
    const node = super.create();
    node.style.textDecoration = 'underline';
    node.style.textDecorationColor = '#0d79c9';
    return node;
  }

  static formats() {
    return true;
  }
}

BlueUnderline['blotName'] = 'blueUnderline';
BlueUnderline['tagName'] = 'span';

Quill.register(BlueUnderline);
