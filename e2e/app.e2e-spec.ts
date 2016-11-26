import { TraduxPage } from './app.po';

describe('tradux App', function() {
  let page: TraduxPage;

  beforeEach(() => {
    page = new TraduxPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
