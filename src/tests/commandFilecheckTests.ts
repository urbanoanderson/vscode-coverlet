import { stripAllButOneFile } from '../strip';
import { expect } from 'chai';
import 'mocha';

describe('Filecheck', () => {
	it('Not a JSON should return null', () => {
		const result = stripAllButOneFile("invalid report", "file.cs");
		expect(result).to.equal(null);
	  });

	  it('File not in report should strip all files', () => {
		const input = JSON.stringify({"App":{"File1.cs":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]}}},"File2.cs":{"Class":{"Method1":{"Lines":{"8":0,"9":0,"10":0},"Branches":[]}}}}});
		const result = stripAllButOneFile(input, "File3.cs");
		expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{}}));
	  });

	  it('Files with same name but different path should strip only correct path', () => {
		const input = JSON.stringify({"App":{"folderA/File.cs":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]}}},"folderB/File.cs":{"Class":{"Method1":{"Lines":{"8":0,"9":0,"10":0},"Branches":[]}}}}});
		const result = stripAllButOneFile(input, "folderA/File.cs");
		expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{"folderA/File.cs":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]}}}}}));
	  });

	  it('Happy path should strip other files from JSON', () => {
		const input = JSON.stringify({"App":{"File1.cs":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]}}},"File2.cs":{"Class":{"Method1":{"Lines":{"8":0,"9":0,"10":0},"Branches":[]}}}}});
		const result = stripAllButOneFile(input, "File1.cs");
		expect(JSON.stringify(result)).to.equal(JSON.stringify({"App":{"File1.cs":{"Class":{"Method1":{"Lines":{"6":1,"7":1,"8":1},"Branches":[]}}}}}));
	  });
});



