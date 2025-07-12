import Quill from 'quill';

const Inline: any = Quill.import('blots/inline');

class RedUnderline extends Inline {
  static create() {
    const node = super.create();
    node.style.textDecoration = 'underline';
    node.style.textDecorationColor = 'red';
    return node;
  }

  static formats() {
    return true;
  }
}

RedUnderline['blotName'] = 'redUnderline';
RedUnderline['tagName'] = 'span';

Quill.register(RedUnderline);
