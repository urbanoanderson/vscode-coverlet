import { stripAllTestedCode } from '../strip';
import { expect } from 'chai';
import 'mocha';

describe('Strip Report', () => {

  it('Not a JSON should return null', () => {
    const result = stripAllTestedCode("invalid report");
    expect(result).to.equal(null);
  });

  it('JSON without \'lines\' should parse', () => {
    const result = stripAllTestedCode(JSON.stringify({"App":{"File":{"Class":{"Method":{"Branches":[]}}}}}));
    expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{}}));
  });

  it('JSON without \'branches\' should parse', () => {
    const result = stripAllTestedCode(JSON.stringify({"App":{"File":{"Class":{"Method":{"Lines":{"6":1,"7":1,"8":1}}}}}}));
    expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{}}));
  });

  it('JSON branch does not contain Hits should return null', () => {
    const result = stripAllTestedCode(JSON.stringify({"App":{"File":{"Class":{"Method":{"Branches":[{"Line":17,"Offset":10,"EndOffset":16,"Path":1,"Ordinal":1}]}}}}}));
    expect(result).to.equal(null);
  });

  it('Happy path should strip JSON', () => {
    const input = JSON.stringify({"App":{"File1":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]},"Method2":{"Lines":{"11":1,"12":1,"13":1},"Branches":[]},"Method3":{"Lines":{"16":1,"17":1,"18":1,"20":0,"21":1},"Branches":[{"Line":17,"Offset":10,"EndOffset":12,"Path":0,"Ordinal":0,"Hits":1},{"Line":17,"Offset":10,"EndOffset":16,"Path":1,"Ordinal":1,"Hits":0}]}}},"File2":{"Class":{"Method":{"Lines":{"8":0,"9":0,"10":0,"11":0},"Branches":[]}}}}});
    const result = stripAllTestedCode(input);
    expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{"File1":{"Class":{"Method3":{"Lines":{"20":0},"Branches":[{"Line":17,"Offset":10,"EndOffset":16,"Path":1,"Ordinal":1,"Hits":0}]}}},"File2":{"Class":{"Method":{"Lines":{"8":0,"9":0,"10":0,"11":0}}}}}}));
  });

});